import {useNavigation} from '@react-navigation/native';
import {appActions} from '@state/app/actions';
import {
  ExtendedHuntingAreaData,
  ExtendedTenantUserData,
} from '@state/data/dataSelectors';
import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import RadioButtonCard from '../RadioButtonCard';
import Text from '../Text';

const TenantOption = ({
  tenantsUsers,
  selectedHuntingArea,
}: {
  tenantsUsers: ExtendedTenantUserData;
  selectedHuntingArea: ExtendedHuntingAreaData | null;
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const tenantName = tenantsUsers?.tenant?.name;

  return (
    <Container>
      <Section>
        <Text.M variant={Text.Variant.primaryDark} weight={Text.Weight.medium}>
          {tenantName}
        </Text.M>
        {(tenantsUsers?.huntingAreas || []).map(
          (ha: ExtendedHuntingAreaData) => {
            const selected = ha.id === selectedHuntingArea?.id;
            return (
              <HuntingAreaWrapper key={`huntingArea_${ha.id}`}>
                <RadioButtonCard
                  label={ha.name}
                  onPress={() => {
                    dispatch(appActions.setSelectedHuntingArea(ha.id));
                    navigation.goBack();
                  }}
                  value={null}
                  selected={selected}
                  variant={RadioButtonCard.Variant.rounded}
                />
              </HuntingAreaWrapper>
            );
          },
        )}
      </Section>
    </Container>
  );
};

const Container = styled(View)`
  margin-top: 16px;
`;

const Section = styled(View)`
  padding: 4px 0;
  display: flex;
`;

const HuntingAreaWrapper = styled(View)`
  padding: 8px 8px 8px 0;
`;

export default TenantOption;
