import React from 'react';
import {View, ViewProps} from 'react-native';
import styled from 'styled-components';
import Text from '../components/Text';
import {UserData, UserStatus} from '../state/types';
import {theme} from '../theme';
import {shortenName} from '../utils/formaters';
import Avatar from './Avatar';
import {Center} from './layout';
import AddUserIcon from './svg/AddUser';
import CheckIcon from './svg/Check';
import TargetIcon from './svg/Target';

const StatusColor: {[key: string]: string} = {
  [UserStatus.Invited]: '#DEE6E8',
  [UserStatus.Accepted]: theme.colors.success,
  [UserStatus.Declined]: theme.colors.error,
};

export type UserCardProps = {
  user: UserData;
  isManager?: boolean;
  style?: ViewProps;
  status?: string | null | undefined;
  createdBy?: UserData | null;
  lootsCount?: number;
};

const UserCard = ({
  user,
  isManager,
  style,
  createdBy,
  status,
  lootsCount,
}: UserCardProps) => {
  return user?.id ? (
    <Container style={style}>
      <Row>
        <View>
          <Avatar
            firstName={user?.firstName || '-'}
            lastName={user?.lastName || '-'}
            isManager={!!isManager}
          />
          {isManager && (
            <CrownWrapper>
              {/* <CrownIcon color={theme.colors.white} size={9} /> */}
            </CrownWrapper>
          )}
        </View>
        <MemberDataWrapper>
          <Name
            variant={Text.Variant.primaryDark}
            weight={Text.Weight.regular}
            isDeleted={!!user.deletedAt}
          >
            {`${user?.firstName || '-'} ${user?.lastName || '-'}`}
          </Name>
          {user.deletedAt && (
            <Text.XS variant={Text.Variant.error} weight={Text.Weight.regular}>
              Apribota teisė medžioti
            </Text.XS>
          )}
          <AdditionalData>
            {!!createdBy && createdBy.id !== user?.id && (
              <CreatedByUserWrapper>
                <UserIcon size={14} color={theme.colors.primaryLight} />
                <Text.S variant={Text.Variant.primary}>
                  {shortenName(createdBy?.firstName, createdBy?.lastName)}
                </Text.S>
              </CreatedByUserWrapper>
            )}
          </AdditionalData>
        </MemberDataWrapper>
      </Row>
      {status && (
        <StatusWrapper color={StatusColor[status]}>
          {status === UserStatus.Accepted && <CheckIcon size={12} />}
        </StatusWrapper>
      )}
      {!!lootsCount && (
        <LootInfoItem>
          <TargetIcon size={16} color={theme.colors.primaryDark} />
          <Label variant={Text.Variant.primaryDark}>{lootsCount}</Label>
        </LootInfoItem>
      )}
    </Container>
  ) : null;
};

const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const MemberDataWrapper = styled(View)`
  margin-left: 12px;
  justify-content: center;
  max-width: 75%;
`;

const Row = styled(View)`
  flex-direction: row;
  flex: 1;
`;

const StatusWrapper = styled(View)<{color: any}>`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: ${({color}) => color};
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const AdditionalData = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const UserIcon = styled(AddUserIcon)`
  margin-top: 2px;
  margin-right: 4px;
`;

const CrownWrapper = styled(View)`
  background-color: ${() => theme.colors.secondary};
  height: 16px;
  width: 16px;
  border-radius: 8px;
  border-color: white;
  border-width: 1.5px;
  position: absolute;
  right: -2px;
  top: -2px;
  justify-content: center;
  align-items: center;
`;

const CreatedByUserWrapper = styled(View)`
  flex-direction: row;
  margin-top: 4px;
`;

const LootInfoItem = styled(Center)`
  flex-direction: row;
`;

const Label = styled(Text.M)`
  margin-left: 2px;
`;

const Name = styled(Text.M)<{isDeleted: boolean}>`
  /* text-decoration: ${({isDeleted}) =>
    isDeleted ? 'line-through' : 'none'}; */
  /* text-decoration-color: ${({theme}) => theme.colors.primaryDark}; */
`;

export default UserCard;
