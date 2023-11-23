import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {LootUpdateData} from '@root/state/types';
import React, {useState} from 'react';
import {
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import HeaderClose from '../../components/HeaderClose';
import Commentary from '../LootRegistration/Commentary';
import {RootStackParamList, routes} from '../Router';

const AddLootCommentary = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, routes.addLootCommentary>>();
  const {loot} = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const loading = useSelector(getOnSync.loot);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const goBack = () => {
    navigation.pop();
  };

  // dispatch animal update with new comment
  const handleSave = (val: string) => {
    if (val === '') {
      setError('Paliktas tuščias laukas. Įrašykite pastabas');
    } else {
      dispatch(
        huntingActions.updateLoot({
          id: loot.id,
          huntingMember: loot.huntingMember.id,
          animal: loot.animal.id,
          attributes: {
            ...loot.attributes,
            comments: [
              ...(loot.attributes.comments ? loot.attributes.comments : []),
              {
                text: val,
                createdAt: new Date(),
              },
            ],
          },
        } as LootUpdateData),
      );
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Wrapper>
        <StatusBar barStyle="dark-content" />
        <HeaderClose title={loot.animal.name} onGoBack={goBack} />
        <Commentary
          error={error}
          loading={loading}
          isLastStep={true}
          onPress={handleSave}
          onBack={goBack}
        />
      </Wrapper>
    </TouchableWithoutFeedback>
  );
};

const Wrapper = styled(View)`
  flex: 1;
  background-color: white;
`;

export default AddLootCommentary;
