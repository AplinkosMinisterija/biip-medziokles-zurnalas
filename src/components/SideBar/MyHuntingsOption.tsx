import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {appActions} from '../../state/app/actions';
import {strings} from '../../strings';
import RadioButtonCard from '../RadioButtonCard';
import Text from '../Text';

const MyHuntingsOption = ({selected}: {selected: boolean}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <Container>
      <Section>
        <Text.M variant={Text.Variant.primaryDark} weight={Text.Weight.medium}>
          {strings.myHuntings}
        </Text.M>
        <HuntingAreaWrapper>
          <RadioButtonCard
            label={strings.personalHuntings}
            onPress={() => {
              dispatch(appActions.setSelectedHuntingArea(null));
              navigation.goBack();
            }}
            value={null}
            selected={selected}
            variant={RadioButtonCard.Variant.rounded}
          />
        </HuntingAreaWrapper>
      </Section>
    </Container>
  );
};

const Container = styled(View)`
  margin-top: 8px;
`;

const Section = styled(View)`
  padding: 4px 0;
  display: flex;
`;

const HuntingAreaWrapper = styled(View)`
  padding: 10px 8px 10px 0;
`;

export default MyHuntingsOption;
