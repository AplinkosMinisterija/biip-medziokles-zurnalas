import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {getMe} from '@root/state/data/dataSelectors';
import {isIOS} from '@utils/layout';
import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Text from '../../components/Text';
import EventCard from '../Events/EventCard';
import {RootStackParamList, routes} from '../Router';

type ActiveHuntsRouteProps = RouteProp<
  RootStackParamList,
  routes.activeHuntsDialog
>;

const ActiveHuntsDialog = () => {
  const route: ActiveHuntsRouteProps = useRoute();
  const {activeHunts} = route.params;
  const navigation = useNavigation<any>();
  const myId = useSelector(getMe);

  const handleEventCardPress = (huntingId: string) => {
    navigation.pop();
    navigation.navigate(routes.hunting, {
      huntingId,
    });
  };

  return (
    <Container onPress={navigation.goBack}>
      <Overlay behavior={isIOS ? 'padding' : 'height'}>
        <DialogBox>
          <Title weight={Text.Weight.medium}>{'Vykstančios medžioklės'}</Title>
          <Message>{'Pasirinkite medžioklę'}</Message>
          {activeHunts.map(item => (
            <EventCard
              id={item.id}
              key={item.id}
              onPress={() => handleEventCardPress(item.id)}
              organizer={item?.manager?.user}
              date={new Date(item?.startDate)}
              endDate={item?.endDate ? new Date(item.endDate) : null}
              loot={item?.lootCount || null}
              membersCount={item?.membersCount}
              status={item?.status}
              huntingArea={item?.huntingArea?.name || ''}
              isAdmin={myId === item?.manager?.user?.id}
            />
          ))}
        </DialogBox>
      </Overlay>
    </Container>
  );
};

const Container = styled(TouchableWithoutFeedback)`
  height: 100%;
`;

const Overlay = styled(KeyboardAvoidingView)<any>`
  background-color: ${({theme}) => theme.colors.overlay};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const DialogBox = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  padding-vertical: 24px;
  padding-bottom: 10px;
  width: 90%;
  border-radius: 16px;
  ${({theme}) => theme.shadow.light};
`;

const Title = styled(Text.M)`
  text-align: center;
  margin-bottom: 8px;
`;

const Message = styled(Text.S)`
  text-align: center;
  margin-bottom: 24px;
  line-height: 21px;
`;

export default ActiveHuntsDialog;
