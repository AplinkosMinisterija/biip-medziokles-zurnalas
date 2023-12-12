import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {appActions} from '@root/state/app/actions';
import {huntingActions} from '@root/state/huntings/actions';
import {
  canParticipateOrManageNewHunt,
  getStartedHuntings,
} from '@root/state/huntings/huntingsSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {getTenantUserByUserId} from '@root/state/tenants/tenantsSelectors';
import {HuntingStatus, NATIONALITY, State, UserStatus} from '@root/state/types';
import {theme} from '@root/theme';
import {ExtendedHuntingData} from '@state/data/dataSelectors';
import {formatPhoneNumber} from '@utils/format';
import {format} from 'date-fns';
import {some} from 'lodash';
import React, {useState} from 'react';
import {Linking, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import ActionsModal from '../../components/ActionsModal';
import Button from '../../components/Button';
import PhoneIcon from '../../components/svg/Phone';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {RootStackParamList, routes} from '../Router';

type HuntingMemberPanelRouteProp = RouteProp<
  RootStackParamList,
  routes.huntingMemberPanel
>;

const HuntingMemberPanel = () => {
  const route: HuntingMemberPanelRouteProp = useRoute();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  //TODO: myMember can be selected here
  const {member, huntingData, myMember} = route.params;
  const isConnected = useSelector((state: State) => state.network.isConnected);
  const loadingHunting: boolean = useSelector(getOnSync.huntings);
  const loadingMember: boolean = useSelector(getOnSync.huntingMember);
  const membersHuntings: ExtendedHuntingData[] = useSelector(
    getStartedHuntings(member.user.id),
  );
  const tenantUser = useSelector(getTenantUserByUserId(member.user.id));

  const [loadingOption, setLoaderOnOption] = useState('');

  const loading = loadingMember || loadingHunting;

  //Selected hunting constants
  const huntingOngoingOrEnded = some(
    [HuntingStatus.Started, HuntingStatus.Ended],
    status => status === huntingData?.status,
  );
  const acceptedAt = member.acceptedAt
    ? format(new Date(member.acceptedAt), 'yyyy-MM-dd HH:mm')
    : '-';
  const acceptMethod = member.acceptMethod
    ? strings.acceptCaseType[member.acceptMethod]
    : '-';
  const huntingStatus = huntingData?.status;

  //Selected member constants
  const memberIsMe = myMember?.user?.id === member?.user?.id;
  const memberIsGuest = member?.isGuest;
  const memberIsForeigner = member.user.nationality === NATIONALITY.foreigner;
  const memberPhone = member?.user?.phone;
  const isManagerPending = member.id === huntingData.managerPending;

  const memberCanParticipate = useSelector(
    canParticipateOrManageNewHunt(huntingData, member?.user?.id),
  );

  const memberCanBecomeManager = tenantUser
    ? tenantUser.permissions.huntingManager
    : false;
  //Connected user constants
  const iAmParticipating = some(
    huntingData?.huntingMembers,
    huntingMember => huntingMember.user.id === myMember?.user?.id,
  );
  const iAmManagerOfThisHunting = huntingData?.manager?.id === myMember?.id;
  //Show button conditions
  const showMakeManagerButton =
    iAmManagerOfThisHunting &&
    memberCanBecomeManager &&
    !isManagerPending &&
    !memberIsMe &&
    !memberIsGuest &&
    member.status === UserStatus.Accepted &&
    !member.leftAt &&
    huntingData.status !== HuntingStatus.Ended &&
    memberCanParticipate;

  const showRegisterLootButton =
    iAmManagerOfThisHunting &&
    memberIsForeigner &&
    huntingStatus === HuntingStatus.Started;
  const showLootsButton = iAmParticipating && huntingOngoingOrEnded;
  const showPhoneButton = !memberIsMe;
  const showLocationOnMapButton =
    iAmParticipating &&
    memberCanParticipate &&
    huntingStatus !== HuntingStatus.Ended &&
    !member.leftAt &&
    member.status !== UserStatus.Declined;
  const showConfirmButton =
    !memberIsMe &&
    iAmManagerOfThisHunting &&
    memberCanParticipate &&
    (huntingStatus === HuntingStatus.Ready ||
      huntingStatus === HuntingStatus.Started) &&
    member.status === UserStatus.Invited;
  const showRemoveMemberButton =
    !member.leftAt &&
    ((iAmManagerOfThisHunting && !memberIsMe) ||
      (!iAmManagerOfThisHunting && memberIsMe)) &&
    huntingStatus !== HuntingStatus.Ended;
  const showConfirmMyselfButton =
    memberIsMe &&
    !iAmManagerOfThisHunting &&
    memberCanParticipate &&
    (huntingStatus === HuntingStatus.Ready ||
      huntingStatus === HuntingStatus.Started) &&
    member.status === UserStatus.Invited;

  return (
    <ActionsModal
      title={`${member?.user?.firstName} ${member?.user?.lastName}`}
      scrollable
    >
      <>
        <Container>
          {isManagerPending && (memberIsMe || iAmManagerOfThisHunting) && (
            <>
              <Label>Paskirtas tapti vadovu</Label>
              <OptionButton
                key={'confirmManager'}
                text={'Tvirtinti vadovavimą'}
                loading={loading && loadingOption === 'changeManager'}
                disabled={!isConnected}
                onPress={() => {
                  setLoaderOnOption('changeManager');
                  if (iAmManagerOfThisHunting) {
                    navigation.navigate(routes.signatureModal, {
                      signer: member.user,
                      syncSelector: getOnSync.huntingMember,
                      onSign: (signature: string) => {
                        dispatch(
                          huntingActions.acceptHuntingManagerChange(
                            {
                              huntingId: huntingData.id,
                              signature,
                            },
                            {
                              onFinish: () => {
                                navigation.goBack();
                              },
                            },
                          ),
                        );
                        navigation.goBack();
                      },
                    });
                  } else {
                    dispatch(
                      huntingActions.acceptHuntingManagerChange(
                        {
                          huntingId: huntingData.id,
                        },
                        {
                          onFinish: () => {
                            navigation.goBack();
                          },
                        },
                      ),
                    );
                  }
                }}
              />
              <OptionButton
                key={'declineManager'}
                text={'Atšaukti vadovavimą'}
                variant={Button.Variant.Danger}
                loading={loading && loadingOption === 'changeManager'}
                disabled={!isConnected}
                onPress={() => {
                  setLoaderOnOption('changeManager');
                  dispatch(
                    huntingActions.declineHuntingManagerChange(
                      {
                        huntingId: huntingData.id,
                      },
                      {
                        onFinish: () => {
                          navigation.goBack();
                        },
                      },
                    ),
                  );
                }}
              />
            </>
          )}
          {member.acceptedAt && (
            <>
              <Row>
                <Label>Pradėjo medžioklę: </Label>
                <Value>{acceptedAt}</Value>
              </Row>
              <Row>
                <Label>Patvirtinimo būdas: </Label>
                <Value>{acceptMethod}</Value>
              </Row>
            </>
          )}
          {member.leftAt && (
            <Row>
              <Label>Baigė medžioklę: </Label>
              <Value>
                {format(new Date(member.leftAt), 'yyyy-MM-dd HH:mm')}
              </Value>
            </Row>
          )}
          {!!member.createdBy && (
            <Row>
              <Label>Pakvietė: </Label>
              <Value>{`${member.createdBy.firstName} ${member.createdBy.lastName}`}</Value>
            </Row>
          )}
          {!!membersHuntings && membersHuntings.length > 0 && (
            <>
              <Label>Šiuo metu dalyvauja: </Label>
              {membersHuntings.map((hunt, idx) => (
                <NoMarginRow key={idx}>
                  <SpacedView>
                    {hunt.manager.user.id === member.user.id && (
                      <ManagerMarker />
                    )}
                  </SpacedView>
                  <Value>{`${hunt.huntingArea.name} (${hunt.tenant.name})`}</Value>
                </NoMarginRow>
              ))}
            </>
          )}
          {showPhoneButton && (
            <OptionButton
              key={'phone'}
              text={
                memberPhone ? formatPhoneNumber(memberPhone) : 'Tel nr nėra'
              }
              loading={loading && loadingOption === 'phone'}
              disabled={!memberPhone}
              leftIcon={<PhoneIcon />}
              onPress={() =>
                memberPhone ? Linking.openURL(`tel:${memberPhone}`) : {}
              }
            />
          )}
          {showConfirmMyselfButton && (
            <OptionButton
              key={'confirmMyself'}
              text={strings.confirmMysef}
              loading={loading && loadingOption === 'confirmMyself'}
              disabled={!isConnected}
              onPress={() => {
                setLoaderOnOption('confirmMyself');
                // TODO refactor navigation
                navigation.navigate(routes.huntingMemberConfirmationPanel, {
                  member,
                  huntingId: huntingData.id,
                });
              }}
            />
          )}
          {showConfirmButton && (
            <OptionButton
              key={'confirm'}
              text={strings.memberOptions.confirm}
              loading={loading && loadingOption === 'confirm'}
              disabled={
                member?.status === UserStatus.Accepted ||
                member?.status === UserStatus.Declined ||
                !isConnected
              }
              onPress={() => {
                setLoaderOnOption('confirm');
                navigation.goBack();
                // TODO refactor navigation
                navigation.navigate(routes.signatureModal, {
                  signer: member.user,
                  syncSelector: getOnSync.huntingMember,
                  onSign: (signature: string) => {
                    dispatch(
                      huntingActions.acceptHuntingMember(
                        {
                          memberId: member.id,
                          signature,
                        },
                        {onFinish: () => {}},
                      ),
                    );
                    navigation.goBack();
                  },
                });
              }}
            />
          )}
          {showLocationOnMapButton && (
            <OptionButton
              key={'locationOnMap'}
              text={strings.memberOptions.locationOnMap}
              loading={loading && loadingOption === 'locationOnMap'}
              disabled={!isConnected}
              onPress={() => {
                // TODO refactor navigation
                navigation.navigate(routes.huntingAreaMap, {
                  memberId: member?.id,
                  huntingId: huntingData.id,
                  closePrevView: true,
                });
              }}
            />
          )}
          {showRegisterLootButton && (
            <OptionButton
              key={'registerLoot'}
              text={strings.memberOptions.registerLoot}
              loading={loading && loadingOption === 'registerLoot'}
              disabled={!isConnected}
              onPress={() => {
                setLoaderOnOption('registerLoot');
                navigation.goBack();
                navigation.navigate(routes.lootRegistration, {
                  huntingMemberId: member?.id,
                  huntingAreaMPVId: huntingData?.huntingArea.mpvId,
                });
              }}
            />
          )}
          {showMakeManagerButton && (
            <OptionButton
              key={'makeManager'}
              text={strings.memberOptions.makeManager}
              loading={loading && loadingOption === 'makeManager'}
              disabled={member?.status === UserStatus.Declined || !isConnected}
              onPress={() => {
                setLoaderOnOption('makeManager');
                if (huntingStatus === HuntingStatus.Created) {
                  dispatch(
                    huntingActions.changeHuntingManager({
                      huntingId: huntingData.id,
                      managerId: member?.id,
                    }),
                  );
                } else {
                  navigation.goBack();
                  if (huntingData?.id && member?.id) {
                    dispatch(
                      huntingActions.changeHuntingManager({
                        huntingId: huntingData.id,
                        managerId: member?.id,
                      }),
                    );
                  }
                }
              }}
            />
          )}
          {showLootsButton && (
            <OptionButton
              key={'loot'}
              text={strings.memberOptions.loot}
              loading={loading && loadingOption === 'loot'}
              disabled={false}
              onPress={() => {
                // TODO refactor navigation
                navigation.navigate(routes.huntingMemberLoot, {
                  huntingMemberId: member?.id,
                  huntingId: huntingData.id,
                });
              }}
            />
          )}

          {showRemoveMemberButton && (
            <OptionButton
              key={'remove'}
              text={
                memberIsMe ? 'Palikti medžioklę' : strings.memberOptions.remove
              }
              loading={loading && loadingOption === 'remove'}
              disabled={!isConnected}
              variant={Button.Variant.Danger}
              onPress={() => {
                setLoaderOnOption('remove');
                if (huntingData && member?.id) {
                  navigation.goBack();
                  huntingStatus === HuntingStatus.Started
                    ? setTimeout(() => {
                        dispatch(
                          appActions.showConfirmationModal({
                            visible: true,
                            title: memberIsMe
                              ? 'Palikti medžioklę?'
                              : strings.removeMemberHunting,
                            subtitle: memberIsMe
                              ? 'Ar tikrai norite palikti medžioklę?'
                              : strings.confirmRemoveMemberHunting,
                            ...(!memberIsMe && {
                              additionalData: `${member?.user?.firstName} ${member?.user?.lastName}`,
                            }),
                            primaryButton: memberIsMe
                              ? 'Palikti'
                              : strings.remove,
                            secondaryButton: strings.common.cancel,
                            loadingSelector: getOnSync.huntingMember,
                            onPrimaryPress: () => {
                              dispatch(
                                huntingActions.removeHuntingMember({
                                  memberId: member?.id,
                                }),
                              );
                              dispatch(appActions.closeConfirmationModal());
                            },
                          }),
                        );
                      }, 400)
                    : dispatch(
                        huntingActions.removeHuntingMember({
                          memberId: member?.id,
                        }),
                      );
                }
              }}
            />
          )}
        </Container>
      </>
    </ActionsModal>
  );
};

const Container = styled(View)`
  padding: 0 20px 20px 20px;
`;

const OptionButton = styled(Button)`
  margin-top: 24px;
`;

const Row = styled(View)`
  display: flex;
  flex-direction: row;
  margin: 8px 0;
  flex-wrap: wrap;
`;

const NoMarginRow = styled(View)`
  display: flex;
  flex-direction: row;
  margin: 0;
`;

const SpacedView = styled(View)`
  justify-content: center;
  align-items: center;
  width: 25px;
`;

const Label = styled(Text.M)`
  font-weight: 600;
  line-height: 24px;
`;

const Value = styled(Text.M)`
  line-height: 24px;
`;

const ManagerMarker = styled(View)`
  background-color: ${() => theme.colors.secondary};
  height: 16px;
  width: 16px;
  border-radius: 8px;
  border-color: white;
  border-width: 1.5px;
`;

export default HuntingMemberPanel;
