import {useNavigation, useRoute} from '@react-navigation/native';
import {
  getExtendedHuntingMember,
  getExtendedLootsByHunting,
} from '@root/state/data/dataSelectors';
import {filter} from 'lodash';
import React from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import AnimalCard from '../../components/AnimalCard';
import EmptyState from '../../components/EmptyState';
import HeaderClose from '../../components/HeaderClose';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {theme} from '../../theme';

const HuntingMemberLoot = () => {
  const route = useRoute<any>();
  const {huntingMemberId, huntingId} = route.params;
  const navigation = useNavigation<any>();

  const member = useSelector(getExtendedHuntingMember(huntingMemberId));
  const loots = useSelector(getExtendedLootsByHunting(huntingId));
  const memberLoots = filter(loots, l => l.huntingMember.id === member.id);

  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={strings.loots} onGoBack={() => navigation.pop(2)} />
      <Container>
        <MemberName>{`${member?.user?.firstName} ${member?.user?.lastName}`}</MemberName>
        <FlatList
          contentContainerStyle={{paddingBottom: theme.footer}}
          data={memberLoots}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyState title={strings.noLoots} />}
          renderItem={({item}) => <AnimalCard lootData={item} />}
        />
      </Container>
    </Wrapper>
  );
};

const Container = styled(View)`
  flex: 1;
`;

const MemberName = styled(Text.M)`
  margin-top: 20px;
  margin-bottom: 18px;
  text-align: center;
`;

const Wrapper = styled(View)`
  flex: 1;
  background-color: white;
`;

export default HuntingMemberLoot;
