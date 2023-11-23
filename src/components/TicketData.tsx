import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import TicketIcon from './svg/Ticket';
import Text from './Text';

const TicketNumber = ({ticketNumber}: any) => {
  return (
    <TicketData>
      <Icon />
      <Text.S variant={Text.Variant.primary}>{ticketNumber}</Text.S>
    </TicketData>
  );
};

const TicketData = styled(View)`
  margin-top: 4px;
  flex-direction: row;
  margin-right: 9px;
`;

const Icon = styled(TicketIcon)`
  margin-top: 2px;
  margin-right: 4px;
`;

export default TicketNumber;
