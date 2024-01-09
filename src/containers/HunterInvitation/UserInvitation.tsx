import {useNavigation, useRoute} from '@react-navigation/native';
import UserCard from '@root/components/UserCard';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {State, UserData} from '@root/state/types';
import {getNotInvitedHuntingAreaUsers} from '@root/state/users/usersSelectors';
import {useKeyboard, usePrevious} from '@utils/hooks';
import {hasNotch, isIOS} from '@utils/layout';
import React, {useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import HeaderBack from '../../components/HeaderBack';
import SearchBar from '../../components/SearchBar';
import {strings} from '../../strings';
import {routes} from '../Router';

const UserInvitation = () => {
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const {huntingId} = route.params;

  const isConnected = useSelector((state: State) => state.network.isConnected);
  const loading = useSelector(getOnSync.huntingMember);
  const members: UserData[] | undefined = useSelector(
    getNotInvitedHuntingAreaUsers(huntingId),
  );

  const [keywordEntered, setKeywordEntered] = useState(false);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [selectedMember, setSelectedMember] = useState<UserData | null>(null);

  const prevKeywords = usePrevious(keywordEntered);

  const openKeyboard = useKeyboard();

  const handleUserSearch = (string: string | null) => {
    setKeywordEntered(!!string?.length);
    if (string?.length) {
      const filtered = members
        ? members.filter(
            (user: UserData) =>
              user.firstName.toLowerCase().includes(string) ||
              user.lastName.toLowerCase().includes(string),
          )
        : [];
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const listData = keywordEntered ? searchResults : members;

  const handleHuntingMemberInvite = () => {
    if (selectedMember) {
      dispatch(
        huntingActions.inviteHuntingMember(
          {
            user: selectedMember.id,
            huntingId,
          },
          {
            onFinish: () => {
              navigation.navigate(routes.selectHunterLocation, {
                userId: selectedMember.id,
                huntingId,
              });
            },
          },
        ),
      );
    }
  };

  return (
    <Container>
      <HeaderBack title={strings.userInvitationTitle} />
      <Content behavior={isIOS ? 'padding' : 'height'}>
        <SearchBar
          onSearch={handleUserSearch}
          triggerClear={prevKeywords && !keywordEntered}
        />
        <FlatList
          data={listData}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 16}}
          keyExtractor={(item, index) => `${item?.id}_${index}`}
          renderItem={({item}) => {
            const selected = selectedMember?.id === item.id;
            return (
              <MemberRow
                onPress={() => setSelectedMember(selected ? null : item)}
                selected={selectedMember?.id === item.id}
              >
                <UserCard user={item} />
              </MemberRow>
            );
          }}
        />
      </Content>

      <ButtonWrapper openKeyboard={openKeyboard}>
        <Footer
          text={strings.huntingInvitationTitle}
          variant={Button.Variant.PrimaryDark}
          onPress={handleHuntingMemberInvite}
          disabled={!selectedMember || !isConnected}
          loading={loading}
        />
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

const Content = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const MemberRow = styled(TouchableOpacity)<{selected: boolean}>`
  padding: 10px 16px 10px 16px;
  background-color: ${({theme, selected}) =>
    selected ? theme.colors.primaryDark15 : theme.colors.white};
`;

const Footer = styled(Button)`
  margin: 16px 16px 16px 16px;
`;

const ButtonWrapper = styled(View)<{openKeyboard: boolean}>`
  ${({theme}) => theme.shadow.light};
  padding-bottom: ${({openKeyboard}) =>
    isIOS ? (hasNotch ? 16 : 0) : !openKeyboard ? 18 : 0}px;
`;

export default UserInvitation;
