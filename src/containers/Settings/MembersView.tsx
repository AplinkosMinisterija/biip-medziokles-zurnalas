import {useNavigation} from '@react-navigation/native';
import {getTenantUsers} from '@root/state/tenants/tenantsSelectors';
import {Role, UserData} from '@root/state/types';
import {usePrevious} from '@utils/hooks';
import React, {useCallback, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import HeaderBack from '../../components/HeaderBack';
import SearchBar from '../../components/SearchBar';
import Text from '../../components/Text';
import UserCard from '../../components/UserCard';
import {strings} from '../../strings';
import {routes} from '../Router';

const Members = ({
  route: {
    params: {tenantUser},
  },
}: any) => {
  const navigation = useNavigation<any>();

  const [keywordEntered, setKeywordEntered] = useState(false);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const prevKeywords = usePrevious(keywordEntered);

  const members: UserData[] = useSelector(
    getTenantUsers(tenantUser?.tenant.id),
  );

  const handleUserSearch = (string: string | null) => {
    setKeywordEntered(!!string?.length);
    if (string?.length) {
      const filtered = members?.filter(
        (user: UserData) =>
          user?.firstName?.toLowerCase().includes(string) ||
          user?.lastName?.toLowerCase().includes(string),
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const listData = keywordEntered ? searchResults : members;

  const renderItem = useCallback(({item: member}: any) => {
    if (!member) return null;
    return (
      <MemberRow
        onPress={() =>
          navigation.navigate(routes.profile, {
            userId: member.id,
            tenantId: tenantUser?.tenant?.id,
          })
        }
      >
        <UserCard user={member} />
      </MemberRow>
    );
  }, []);

  const keyExtractor = (item: any) => item?.id;

  return (
    <Container>
      <HeaderBack title={strings.members} />
      {!!tenantUser.tenant && (
        <Title weight={Text.Weight.bold}>{tenantUser.tenant.name}</Title>
      )}
      <Content>
        {(tenantUser.role === Role.owner ||
          tenantUser.role === Role.userAdmin) && (
          <StyledButton
            variant={Button.Variant.Secondary}
            text={strings.inviteNewMember}
            onPress={() =>
              navigation.navigate(routes.newMember, {
                tenant: tenantUser.tenant,
              })
            }
          />
        )}
        <SearchBar
          onSearch={handleUserSearch}
          triggerClear={prevKeywords && !keywordEntered}
        />
        <FlatList
          data={listData}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 18}}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </Content>
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
  height: 100%;
`;

const Content = styled(View)`
  flex: 1;
`;

const MemberRow = styled(TouchableOpacity)`
  padding: 10px 16px 10px 16px;
  background-color: ${({theme}) => theme.colors.white};
`;

const StyledButton = styled(Button)`
  padding: 16px 16px 0 16px;
`;

const Title = styled(Text.M)`
  text-align: center;
  margin-top: 24px;
`;

export default Members;
