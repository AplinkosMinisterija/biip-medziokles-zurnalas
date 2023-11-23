import {getOnSync} from '@root/state/sync/syncSelectors';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import ButtonFooter from '../../components/ButtonFooter';
import SegmentedTabbar from '../../components/SegmentedTabbar';
import Text from '../../components/Text';
import {strings} from '../../strings';
import AmountInput from '../LootRegistration/AmountInput';

interface LootData {
  isPackMember: boolean;
  packData?: {
    amount: number;
    adults: number;
    juniors: number;
  };
}

type PackProps = {
  onPress: (val: LootData) => void;
  onBack: () => void;
  isLastStep: boolean;
};

const Pack = ({onPress, onBack, isLastStep}: PackProps) => {
  const loading = useSelector(getOnSync.loot);

  const [isPackMember, setIsPackMember] = useState(true);
  const [packData, setPackData] = useState({
    amount: 1,
    adults: 0,
    juniors: 0,
  });

  const routes = [
    {key: true, title: strings.isWolfPackMember.yes},
    {key: false, title: strings.isWolfPackMember.no},
  ];

  return (
    <Wrapper>
      <View>
        <SegmentedTabbar
          routes={routes}
          label={strings.isWolfPackMember.label}
          onSelect={val => setIsPackMember(Boolean(val))}
        />
        {isPackMember && (
          <View>
            <Label variant={Text.Variant.primaryDark}>
              {strings.isWolfPackMember.packMembers}
            </Label>
            <AmountInput
              value={packData.amount}
              label={strings.isWolfPackMember.total}
              onPress={val => setPackData({...packData, amount: val})}
            />
            <AmountInput
              value={packData.adults}
              label={strings.isWolfPackMember.adults}
              onPress={val => setPackData({...packData, adults: val})}
            />
            <AmountInput
              value={packData.juniors}
              label={strings.isWolfPackMember.juniors}
              onPress={val => setPackData({...packData, juniors: val})}
            />
          </View>
        )}
      </View>
      <ButtonFooter
        primaryButton={{
          action: () =>
            onPress({
              isPackMember,
              ...(isPackMember && {packData}),
            }),
          text: isLastStep ? strings.common.save : strings.common.continue,
          disabled: isPackMember && !packData.amount,
          loading: loading,
        }}
        secondaryButton={{
          action: onBack,
          text: strings.common.back,
          disabled: loading,
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  background-color: white;
  justify-content: space-between;
  flex: 1;
`;

const Label = styled(Text.M)`
  line-height: 22px;
  margin: 0px 16px 8px 16px;
`;

export default Pack;
