import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Button from '@root/components/Button';
import {Padding} from '@root/components/layout';
import WarningCard from '@root/components/WarningCard';
import {getMe} from '@root/state/data/dataSelectors';
import {strings} from '@root/strings';
import {format} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import ActionsModal from '../../components/ActionsModal';
import Text from '../../components/Text';
import {RootStackParamList, routes} from '../Router';

const LootInfoPanel = () => {
  const route = useRoute<RouteProp<RootStackParamList, routes.lootInfo>>();
  const {loot} = route.params;
  const me = useSelector(getMe);
  const isMyLoot = loot?.huntingMember?.user?.id === me;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const renderInfoItem = (label: string, value: string | number) => (
    <Row>
      <Label>{label} </Label>
      <Value>{value}</Value>
    </Row>
  );
  const gender = loot.attributes.category
    ? ` (${strings[loot.attributes.category]})`
    : '';
  const quantity = loot.amount > 1 ? ` x${loot.amount}` : '';
  return (
    <ActionsModal
      title={`${loot.animal.name}${gender}${quantity}`}
      scrollable={true}
    >
      <>
        <Container>
          {loot?.violation &&
            loot?.violations &&
            loot?.violations?.length > 0 && (
              <StyledWarningCard
                multiline={loot?.violations?.length > 1}
                text={loot?.violations
                  .map(violation => strings.violation[violation])
                  .join('.\n')
                  .concat('.')}
              />
            )}
          {/* info about loot */}
          {!!loot?.attributes?.other?.name &&
            renderInfoItem('Pateikta rūšis:', loot?.attributes?.other?.name)}
          {!!loot?.attributes?.horns &&
            renderInfoItem(
              strings.leftHornLabel,
              loot?.attributes?.horns?.left,
            )}
          {!!loot?.attributes?.horns &&
            renderInfoItem(
              strings.rightHornLabel,
              loot?.attributes?.horns?.right,
            )}
          {!!loot?.attributes?.coordinates &&
            renderInfoItem(
              'Koordinatės:',
              `${loot?.attributes?.coordinates.long}, ${loot?.attributes?.coordinates.lat}`,
            )}
          {loot?.attributes?.wolfHuntingType &&
            renderInfoItem(
              strings.wolfHuntingTypeQuestion,
              strings.wolfHuntingType[loot?.attributes?.wolfHuntingType],
            )}

          {loot?.attributes?.age &&
            renderInfoItem(`${strings.age}:`, strings[loot?.attributes?.age])}
          {loot?.attributes?.hasScabies &&
            renderInfoItem(
              strings.hasScabies,
              loot?.attributes?.hasScabies
                ? strings.common.yes
                : strings.common.no,
            )}
          {loot?.attributes?.hasDefects &&
            renderInfoItem(
              `${strings.hasDefects}:`,
              loot?.attributes?.hasDefects
                ? loot?.attributes?.appearanceNotes
                : strings.isNot,
            )}
          {loot?.attributes?.isPackMember &&
            renderInfoItem(
              strings.isWolfPackMember.label,
              loot?.attributes?.isPackMember
                ? strings.isWolfPackMember.yes
                : strings.isWolfPackMember.no,
            )}

          {loot?.attributes?.packData?.amount !== undefined &&
            renderInfoItem(
              strings.isWolfPackMember.totalWolfs,
              loot?.attributes?.packData?.amount,
            )}
          {loot?.attributes?.packData?.adults !== undefined &&
            renderInfoItem(
              strings.isWolfPackMember.totalAdults,
              loot?.attributes?.packData?.adults,
            )}
          {loot?.attributes?.packData?.juniors !== undefined &&
            renderInfoItem(
              strings.isWolfPackMember.totalJuniors,
              loot?.attributes?.packData?.juniors,
            )}
          {/* info about hunter */}
          {loot?.huntingMember?.user?.id &&
            renderInfoItem(
              strings.whoHunted,
              `${loot?.huntingMember.user.firstName} ${loot?.huntingMember?.user.lastName}`,
            )}
          {loot?.createdBy?.id &&
            renderInfoItem(
              strings.whoRegistered,
              `${loot?.createdBy.firstName} ${loot?.createdBy.lastName}`,
            )}
          {loot?.registeredAt &&
            renderInfoItem(
              strings.whenRegistered,
              format(new Date(loot.registeredAt), 'yyyy-MM-dd HH:mm'),
            )}
          {loot?.createdAt &&
            renderInfoItem(
              strings.whenSaved,
              format(new Date(loot.createdAt), 'yyyy-MM-dd HH:mm'),
            )}
          {loot.app &&
            renderInfoItem(
              strings.registrationMethodLabel,
              strings.registrationMethod[loot.app],
            )}
          {/* comments */}
          {loot?.attributes?.comments !== undefined &&
            loot?.attributes?.comments.length > 0 &&
            loot?.attributes?.comments.map((comment, idx) => (
              <Column key={idx}>
                <Label>{`Įvykio aplinkybės (${format(
                  new Date(comment.createdAt),
                  'yyyy-MM-dd HH:mm',
                )}):`}</Label>
                <Row>
                  <Value>{comment.text}</Value>
                </Row>
              </Column>
            ))}
          {isMyLoot && (
            <Padding topPadding={10}>
              <Button
                onPress={() => {
                  navigation.replace(routes.addLootCommentary, {
                    loot,
                  });
                }}
                text={'Rašyti įvykio aplinkybes'}
              />
            </Padding>
          )}
        </Container>
      </>
    </ActionsModal>
  );
};

const Container = styled(View)`
  padding: 0px 20px 0px 20px;
  max-height: 100%;
`;

const Row = styled(View)`
  display: flex;
  flex-direction: row;
  margin: 4px 0;
  flex-wrap: wrap;
`;

const Column = styled(Row)`
  flex-direction: column;
`;

const Label = styled(Text.M)`
  font-weight: 600;
  line-height: 24px;
`;

const Value = styled(Text.M)`
  line-height: 24px;
`;

const StyledWarningCard = styled(WarningCard)`
  margin-bottom: 20px;
`;

export default LootInfoPanel;
