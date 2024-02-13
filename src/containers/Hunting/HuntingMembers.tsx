import {useIsFocused} from '@react-navigation/native';
import Button from '@root/components/Button';
import {dataActions} from '@root/state/data/actions';
import {
  ExtendedHuntingData,
  ExtendedHuntingMemberData,
  getMe,
} from '@root/state/data/dataSelectors';
import {getMyHuntingMember} from '@root/state/huntingMembers/huntingMembersSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {HuntingStatus, UserStatus} from '@root/state/types';
import {strings} from '@root/strings';
import React from 'react';
import {RefreshControl, SectionList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Text from '../../components/Text';
import {theme} from '../../theme';
import AddMember from './AddMembers';
import HuntingMemberCard from './HuntingMemberCard';

interface HuntingMembersProps {
  huntingMembersSectionList: {
    title: string;
    data: ExtendedHuntingMemberData[];
  }[];
  huntingData: ExtendedHuntingData;
  isHuntingAdmin: boolean;
}

const HuntingMembers = ({
  huntingMembersSectionList,
  huntingData,
  isHuntingAdmin,
}: HuntingMembersProps) => {
  const dispatch = useDispatch();

  const onSync = useSelector(getOnSync.data);
  const isFocused = useIsFocused();

  const getData = () => {
    dispatch(dataActions.getMainData());
  };

  const me = useSelector(getMe);
  const myMember = useSelector(getMyHuntingMember(huntingData.id));
  const declined = myMember?.status === UserStatus.Declined;

  const huntingActionOnSync = useSelector(getOnSync.updateStatus);
  const loadingMember = useSelector(getOnSync.huntingMember);

  if (!huntingData) {
    return null;
  }

  const joinButton = huntingData.isMyHunting ? (
    <AddMember
      huntingData={huntingData}
      isHuntingAdmin={isHuntingAdmin}
      declined={declined}
    />
  ) : huntingData.status === HuntingStatus.Created ? (
    <ButtonWrapper>
      <StyledButton
        variant={Button.Variant.Secondary}
        text={strings.registerForParticipation}
        onPress={() => {
          dispatch(
            huntingActions.inviteHuntingMember({
              user: me,
              huntingId: huntingData.id,
            }),
          );
        }}
        loading={huntingActionOnSync || loadingMember}
      />
    </ButtonWrapper>
  ) : null;

  return (
    <Container>
      {huntingData.status !== HuntingStatus.Ended && joinButton}
      <SectionList
        contentContainerStyle={{paddingBottom: theme.footer + 90}}
        sections={huntingMembersSectionList}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={({item, index, section}) => (
          <HuntingMemberCard
            member={item}
            myMember={myMember}
            hunting={huntingData}
            enableEdit={isHuntingAdmin}
            isLast={index === section.data.length - 1}
            showStatus={
              huntingData.status === HuntingStatus.Ready ||
              (huntingData.status === HuntingStatus.Started &&
                item.status === UserStatus.Invited)
            }
          />
        )}
        renderSectionHeader={({section}) => <Title>{section.title}</Title>}
        refreshControl={
          <RefreshControl
            refreshing={isFocused && onSync}
            onRefresh={getData}
            tintColor={theme.colors.primaryDark}
            colors={[theme.colors.primaryDark]}
          />
        }
      />
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.almostWhite};
  padding-top: 12px;
`;

const Title = styled(Text.S)`
  color: ${({theme}) => theme.colors.primary};
  padding: 4px 20px 0px 20px;
  background-color: ${({theme}) => theme.colors.almostWhite};
`;

const StyledButton = styled(Button)`
  width: 60%;
`;

const ButtonWrapper = styled(View)`
  display: flex;
  padding: 8px 16px;
`;

export default HuntingMembers;
