import {getOnSync} from '@root/state/sync/syncSelectors';
import {getAnimal, getExtendedHuntingMember} from '@state/data/dataSelectors';
import {AnimalAttributes} from '@state/types';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import SignatureCanvas from '../../components/SignatureCanvas';
import Text from '../../components/Text';
import {strings} from '../../strings';

interface LootConfirmProps {
  huntingMember: string;
  onPress: (val: string) => void;
  lootData: {
    animal: string;
    amount?: number;
    attributes?: AnimalAttributes;
  };
}

const LootConfirm = ({lootData, huntingMember, onPress}: LootConfirmProps) => {
  const loading = useSelector(getOnSync.data);
  const member = useSelector(getExtendedHuntingMember(huntingMember));
  const animal = useSelector(getAnimal(lootData.animal));
  const handleConfirm = (signature: string) => {
    if (signature) {
      onPress(signature);
    }
  };

  const info = (
    <Container>
      <AnimalData variant={Text.Variant.primaryDark}>
        {`${
          lootData.attributes?.category
            ? `${strings[lootData.attributes.category]}`
            : animal.name
        } x${lootData.amount}`}
      </AnimalData>
      {!!lootData.attributes?.other?.name && (
        <AnimalData variant={Text.Variant.primaryDark}>
          {lootData.attributes?.other?.name}
        </AnimalData>
      )}
      {lootData.attributes?.horns && (
        <>
          <HornsLabel>{strings.branchCount}:</HornsLabel>
          <Text.M
            variant={Text.Variant.primary}
          >{`${strings.rightHorn} - ${lootData.attributes.horns.right}`}</Text.M>
          <Text.M
            variant={Text.Variant.primary}
          >{`${strings.leftHorn} - ${lootData.attributes.horns.left}`}</Text.M>
        </>
      )}
      <Member>{`${member?.user?.firstName} ${member?.user?.lastName}`}</Member>
    </Container>
  );

  return animal ? (
    <ConfirmationWrapper>
      <SignatureCanvas loading={loading} onPress={handleConfirm} info={info} />
    </ConfirmationWrapper>
  ) : null;
};

const Container = styled(View)``;

const HornsLabel = styled(Text.M)`
  text-transform: uppercase;
  line-height: 22px;
`;

const AnimalData = styled(Text.M)`
  margin-bottom: 6px;
`;

const Member = styled(Text.M)`
  margin-top: 22px;
`;

const ConfirmationWrapper = styled(View)`
  border-color: red;
  border-width: 2px;
  padding: 16px 16px 0 16px;
`;
// height: 300px;

export default LootConfirm;
