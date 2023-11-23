import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import styled from 'styled-components';
import {strings} from '../strings';
import {useDebounce} from '../utils/hooks';
import CloseIcon from './svg/Close';
import SearchIcon from './svg/Search';

type SearchBarProps = {
  onSearch: (val: string | null, option?: boolean) => void;
  style?: ViewProps;
  loading?: boolean;
  autoFocus?: boolean;
  disableDebounce?: boolean;
  triggerClear?: boolean;
};

const SearchBar = ({
  onSearch,
  style,
  loading,
  autoFocus,
  disableDebounce,
  triggerClear,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  const debouncedSearchTerm = useDebounce(
    inputValue,
    500,
    Boolean(disableDebounce),
  );

  const onClear = () => {
    setInputValue('');
    onSearch(null);
  };

  useEffect(() => {
    Boolean(triggerClear) && onClear();
  }, [triggerClear]);

  useEffect(() => {
    onSearch(debouncedSearchTerm.toLowerCase(), debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <Container style={style}>
      <Row>
        <StyledInput
          onChangeText={setInputValue}
          value={inputValue}
          returnKeyType="done"
          autoCapitalize="none"
          autoFocus={autoFocus}
          placeholder={strings.search}
        />

        {loading ? (
          <LoadingContainer>
            <ActivityIndicator />
          </LoadingContainer>
        ) : (
          <TouchableOpacity
            onPress={onClear}
            activeOpacity={inputValue ? 0.6 : 1}
          >
            {!inputValue ? <SearchIcon /> : <CloseIcon />}
          </TouchableOpacity>
        )}
      </Row>
    </Container>
  );
};

const StyledInput = styled(TextInput)`
  flex: 1;
  margin-right: 10px;
  padding: 0px;
`;

const LoadingContainer = styled(View)`
  margin-right: 12px;
`;

const Row = styled(View)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const Container = styled(View)`
  align-items: center;
  background-color: white;
  background-color: ${({theme}) => theme.colors.white};
  border-color: ${({theme}) => theme.colors.primaryDark};
  border-radius: 4px;
  border-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 13px;
  max-height: 40px;
  margin: 16px;
`;

export default memo(SearchBar);
