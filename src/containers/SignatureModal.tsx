import {useRoute} from '@react-navigation/native';
import ActionsModal from '@root/components/ActionsModal';
import SignatureCanvas from '@root/components/SignatureCanvas';
import Text from '@root/components/Text';
import {strings} from '@root/strings';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

const SignatureModal = (): JSX.Element => {
  const route: any = useRoute();
  const {signer, syncSelector, onSign} = route.params;
  const loading: boolean = useSelector(syncSelector);
  const handleConfirm = (signature: string) => {
    if (signature) {
      onSign(signature);
    }
  };

  return (
    <ActionsModal scrollable={false}>
      <ConfirmationWrapper>
        <SignatureCanvas
          onPress={handleConfirm}
          info={
            <>
              <Title weight={Text.Weight.medium}>{strings.sign}</Title>
              <FullName>{`${signer.firstName} ${signer.lastName}`}</FullName>
              {signer.ticketNumber ? (
                <TicketNumber>{`Medžiotojo bilieto nr.: ${signer.ticketNumber}`}</TicketNumber>
              ) : null}
            </>
          }
          loading={loading}
        />
      </ConfirmationWrapper>
    </ActionsModal>
  );
};

const Title = styled(Text.M)`
  padding-bottom: 32px;
`;
const FullName = styled(Text.M)`
  padding-bottom: 8px;
`;

const TicketNumber = styled(Text.M)`
  padding-bottom: 8px;
  /* font-style: italic; */
`;

const ConfirmationWrapper = styled(View)`
  padding: 0 16px 16px 16px;
  height: 100%;
`;

export default SignatureModal;
