import React from 'react';
import {Linking} from 'react-native';
import styled from 'styled-components';
import Button from '../../components/Button';
import EmailIcon from '../../components/svg/Email';
import PhoneIcon from '../../components/svg/Phone';
import {strings} from '../../strings';
import {formatPhoneNumber} from '../../utils/format';

interface UserFormProps {
  email?: string | null;
  phone?: string | null;
}

const MemberInfo = ({email, phone}: UserFormProps) => {
  return (
    <>
      <StyledButton
        text={phone ? formatPhoneNumber(phone) : strings.phoneNumber}
        onPress={() => Linking.openURL(`tel:${phone}`)}
        leftIcon={<PhoneIcon />}
        disabled={!phone}
      />
      <StyledButton
        text={email ? email : strings.email}
        onPress={() => Linking.openURL(`mailto:${email}`)}
        leftIcon={<EmailIcon />}
        disabled={!email}
      />
    </>
  );
};

const StyledButton = styled(Button)`
  padding: 0;
  margin-top: 14px;
`;

export default MemberInfo;
