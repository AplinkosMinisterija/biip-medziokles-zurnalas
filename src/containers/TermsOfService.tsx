import Text from '@components/Text';
import {useNavigation} from '@react-navigation/native';
import Button, {ButtonVariant} from '@root/components/Button';
import CheckboxCard from '@root/components/CheckboxCard';
import {Padding} from '@root/components/layout';
import {dataActions} from '@root/state/data/actions';
import {getLatestTermsOfService} from '@root/state/data/dataSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

const TermsOfService: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const terms = useSelector(getLatestTermsOfService());
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onSync = useSelector(getOnSync.data);

  return (
    <Container>
      <ScrollView>
        <Padding vertical={10}>
          <Text.Heading>Naudojimosi taisyklės</Text.Heading>
        </Padding>
        <Text.M>{terms && terms.content}</Text.M>
        <Padding bottomPadding={40}>
          <CheckboxCard
            label="Susipažinau"
            onPress={() => setChecked(prev => !prev)}
            selected={checked}
          />
        </Padding>
        <Button
          loading={onSync}
          disabled={!checked}
          variant={ButtonVariant.Primary}
          text={'Grįžti prie programėlės naudojimo'}
          onPress={() => {
            terms && dispatch(dataActions.agreeToTermsOfService(terms?.id));
            // navigation.goBack();
          }}
        />
      </ScrollView>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  margin-horizontal: 14px;
`;

export default TermsOfService;
