import {useNavigation} from '@react-navigation/native';
import ButtonFooter from '@root/components/ButtonFooter';
import {Padding} from '@root/components/layout';
import {getMyTenantUsers, getMyUser} from '@root/state/data/dataSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {FormikValues} from 'formik';
import React, {useRef} from 'react';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Avatar from '../../components/Avatar';
import HeaderBack from '../../components/HeaderBack';
import Text from '../../components/Text';
import TicketNumber from '../../components/TicketData';
import {strings} from '../../strings';
import MyInfo from './MyInfo';
import MyRoles from './MyRoles';

const Profile = ({
  route: {
    params: {userId, ownerProfile},
  },
}: any) => {
  const navigation = useNavigation();
  const formikRef = useRef<FormikValues>();
  const user = useSelector(getMyUser);
  const tenantUsers = useSelector(getMyTenantUsers);
  const loading = useSelector(getOnSync.user);

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const phone = user?.phone;
  const email = user?.email;
  const ticketNumber = user?.ticketNumber;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmitUpdate = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };

  return (
    <Container>
      <HeaderBack
        title={ownerProfile ? strings.ownerProfile : strings.myProfile}
      />
      <Content contentContainerStyle={{paddingBottom: 34}}>
        <UserInfo>
          <StyledAvatar
            firstName={firstName}
            lastName={lastName}
            isManager={false}
          />
          <Text.M>{`${firstName} ${lastName}`}</Text.M>
          <TicketNumber ticketNumber={ticketNumber} />
        </UserInfo>
        <MyInfo
          formikRef={formikRef}
          email={email}
          phone={phone}
          userId={userId}
        />
        <Padding topPadding={20} />
        {tenantUsers?.length > 0 && <MyRoles tenantUsers={tenantUsers} />}
      </Content>
      <ButtonFooter
        primaryButton={{
          action: handleSubmitUpdate,
          text: strings.update,
          loading: loading,
          disabled: loading,
        }}
        secondaryButton={{
          action: handleGoBack,
          text: strings.common.back,
          disabled: loading,
        }}
      />
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
`;

const Content = styled(ScrollView)`
  padding: 0 16px;
`;

const StyledAvatar = styled(Avatar)`
  margin-bottom: 4px;
  margin-top: 24px;
`;

const UserInfo = styled(View)`
  align-items: center;
  margin-bottom: 8px;
`;

export default Profile;
