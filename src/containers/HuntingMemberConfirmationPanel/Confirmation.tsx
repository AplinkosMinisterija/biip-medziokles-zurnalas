import {
  ExtendedHuntingData,
  getExtendedHunting,
} from '@state/data/dataSelectors';
import {shortenName} from '@utils/formaters';
import {convertStringToDate} from '@utils/time';
import {format, getDate, getMonth} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import CheckboxCard from '../../components/CheckboxCard';
import ClockIcon from '../../components/svg/Clock';
import Text from '../../components/Text';
import {strings} from '../../strings';

enum Confirmations {
  Terms = 'confirmationTerms',
  GunLicense = 'confirmationGunLicense',
}

const Confirmation = ({
  huntingId,
  confirmAllTerms,
}: {
  huntingId: string;
  confirmAllTerms: (val: boolean) => void;
}) => {
  const huntingData: ExtendedHuntingData | null = useSelector(
    getExtendedHunting(huntingId),
  );

  const [termsConfirmed, setConfirmationTerms] = useState(false);

  useEffect(() => {
    confirmAllTerms(termsConfirmed);
  }, [termsConfirmed]);

  const date = convertStringToDate(huntingData?.startDate || new Date());

  const month = getMonth(date);
  const day = getDate(date);
  const eventTime = format(date, 'HH:mm');

  const huntingManager = shortenName(
    huntingData?.manager.user?.firstName,
    huntingData?.manager.user?.lastName,
  );

  return huntingData ? (
    <ConfirmationWrapper>
      <HuntingAreaTitle weight={Text.Weight.medium}>
        {huntingData?.huntingArea.name}
      </HuntingAreaTitle>
      <InfoItem>
        <Text.S variant={Text.Variant.primary}>
          {`${strings.manager}: ${huntingManager}`}
        </Text.S>
        <Icon size={16} />
        <Text.S variant={Text.Variant.primary}>
          {`${day} ${strings.monthAbbreviations[month + 1]} ${eventTime}`}
        </Text.S>
      </InfoItem>
      {huntingData.notes && (
        <Description variant={Text.Variant.primaryLight}>
          {huntingData.notes}
        </Description>
      )}
      <CheckboxCard
        label={strings[Confirmations.Terms]}
        selected={termsConfirmed}
        onPress={() => setConfirmationTerms(!termsConfirmed)}
      />
    </ConfirmationWrapper>
  ) : null;
};

const HuntingAreaTitle = styled(Text.M)`
  margin-bottom: 2px;
`;

const Description = styled(Text.S)`
  padding-bottom: 10px;
  line-height: 19px;
`;

const ConfirmationWrapper = styled(View)`
  padding: 0 20px 0 20px;
`;

const Icon = styled(ClockIcon)`
  margin-left: 16px;
  margin-right: 4px;
`;

const InfoItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 10px;
`;

export default Confirmation;
