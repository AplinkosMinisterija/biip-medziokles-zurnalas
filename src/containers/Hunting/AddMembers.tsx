import {useNavigation} from '@react-navigation/native';
import {ExtendedHuntingData} from '@state/data/dataSelectors';
import {HuntingStatus, State, UserStatus} from '@state/types';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import PeopleIcon from '../../components/svg/People';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {theme} from '../../theme';
import {routes} from '../Router';

interface AddMemberProps {
  huntingData: ExtendedHuntingData;
  isHuntingAdmin: boolean;
  declined: boolean;
}

const AddMember = ({huntingData, isHuntingAdmin, declined}: AddMemberProps) => {
  const isConnected = useSelector((state: State) => state.network.isConnected);

  const navigation = useNavigation<any>();

  const huntingNotStarted =
    huntingData?.status === HuntingStatus.Created ||
    huntingData?.status === HuntingStatus.Ready;

  const acceptedMembers = huntingData.huntingMembers.reduce(
    (acc, curr) => acc + (curr.status === UserStatus.Accepted ? 1 : 0),
    0,
  );

  return (
    <Container>
      <Row>
        {(huntingNotStarted || isHuntingAdmin) && !declined && (
          <Button
            variant={Button.Variant.Primary}
            onPress={() => {
              if (huntingData.status !== HuntingStatus.Ended) {
                navigation.navigate(routes.hunterInvitation, {
                  huntingId: huntingData.id,
                });
              }
            }}
            text={strings.inviteHunter}
            width={'90%'}
            disabled={
              !isConnected || huntingData.status === HuntingStatus.Ended
            }
          />
        )}
        <InfoItem>
          <PeopleIcon size={16} color={theme.colors.primaryDark} />
          <Text.M variant={Text.Variant.primaryDark}>
            {' '}
            {huntingData.status === HuntingStatus.Ready && (
              <>
                <Text.M
                  variant={
                    acceptedMembers === huntingData.membersCount
                      ? Text.Variant.primaryDark
                      : Text.Variant.error
                  }
                >
                  {acceptedMembers}
                </Text.M>
                <Text.M>{' / '}</Text.M>
              </>
            )}
            {huntingData.huntingMembers?.length}
          </Text.M>
        </InfoItem>
      </Row>
    </Container>
  );
};

const Container = styled(View)`
  display: flex;
  padding: 8px 16px;
`;

const InfoItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;

const Row = styled(View)`
  flex-direction: row;
  min-height: 40px;
`;

export default AddMember;
