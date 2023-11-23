import {useNavigation} from '@react-navigation/native';
import {getAllExtendedAnimals} from '@root/state/data/dataSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {AnimalData, AnimalFormTypes} from '@root/state/types';
import {usePrevious} from '@utils/hooks';
import {isIOS} from '@utils/layout';
import {filter, find, values} from 'lodash';
import React, {useState} from 'react';
import {FlatList, Keyboard, KeyboardAvoidingView, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import ButtonFooter from '../../components/ButtonFooter';
import SearchBar from '../../components/SearchBar';
import Text from '../../components/Text';
import {strings} from '../../strings';
import AnimalOptionCard from './AnimalOptionCard';

type SelectAnimalProps = {
  selectedValue: string;
  isLastStep: boolean;
  onSelect: (val: string) => void;
  onPress: () => void;
  setIsWolfFlag: (val: boolean) => void;
};

const SelectAnimal = ({
  selectedValue,
  isLastStep,
  onPress,
  onSelect,
  setIsWolfFlag,
}: SelectAnimalProps) => {
  const navigation = useNavigation<any>();

  const animalsList = useSelector(getAllExtendedAnimals);
  const animals = values(animalsList);
  const loading: boolean = useSelector(getOnSync.loot);

  const [keywordEntered, setKeywordEntered] = useState(false);
  const [searchResults, setSearchResults] = useState<AnimalData[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(
    selectedValue,
  );

  const prevKeywords = usePrevious(keywordEntered);

  const handleAnimalSearch = (string: string | null) => {
    setKeywordEntered(!!string?.length);
    if (string?.length) {
      const filtered = filter(animals, animal =>
        animal.name.toLowerCase().includes(string),
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleAnimalSelect = (id: string) => {
    const isSelected = selectedValue === id;
    setSelectedAnimal(isSelected ? null : id);
    onSelect(isSelected ? '' : id);
    const animal = find(animals, animal => animal.id === id);
    setIsWolfFlag(animal?.formType === AnimalFormTypes.Wolf);
    Keyboard.dismiss();
  };

  const handleContinue = () => {
    onPress();
    Keyboard.dismiss();
  };

  const listData = keywordEntered ? searchResults : animals;

  return (
    <>
      <KeyboardView behavior={isIOS ? 'padding' : 'height'}>
        <SearchContainer>
          <SearchBarLabel>{strings.animal}</SearchBarLabel>
          <Search
            onSearch={handleAnimalSearch}
            triggerClear={prevKeywords && !keywordEntered}
          />
        </SearchContainer>
        <FlatList
          data={listData}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 16}}
          keyExtractor={item => item.id}
          initialNumToRender={13}
          renderItem={({item: animal, index}) => {
            const selected = selectedAnimal === animal.id;
            return (
              <AnimalOptionCard
                label={animal.name}
                icon={animal.iconUrl}
                index={index}
                selected={selected}
                onPress={() => handleAnimalSelect(animal.id)}
              />
            );
          }}
        />
      </KeyboardView>
      <ButtonFooter
        primaryButton={{
          action: handleContinue,
          text: isLastStep ? strings.common.save : strings.common.continue,
          disabled: !selectedAnimal,
          loading: loading,
        }}
        secondaryButton={{
          action: () => navigation.pop(2),
          text: strings.common.cancel,
          disabled: loading,
        }}
      />
    </>
  );
};

const KeyboardView = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: white;
`;

const SearchBarLabel = styled(Text.XS)`
  text-transform: uppercase;
  margin-left: 16px;
  margin-top: 18px;
`;

const Search = styled(SearchBar)`
  margin: 8px 16px 16px 16px;
`;

const SearchContainer = styled(View)`
  background-color: white;
`;

export default SelectAnimal;
