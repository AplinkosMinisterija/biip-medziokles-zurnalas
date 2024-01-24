import {JSXNode} from '@root/types';
import {getFormattedTimeValue} from '@utils/time';
import {differenceInSeconds} from 'date-fns';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, View} from 'react-native';
import styled from 'styled-components';
import Text from './Text';

const Countdown = ({
  time,
  date,
  onFinish,
}: {
  time: number;
  date: Date;
  onFinish?: () => void;
}): JSXNode => {
  const [timer, setTimer] = useState(time);

  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = Math.floor((timer % 3600) % 60);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const difference = differenceInSeconds(new Date(), date);
    setTimer(time - difference);
  }, [date, time, appStateVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer <= 0) {
        clearInterval(interval);
        onFinish?.();
      } else {
        setTimer(timer => timer - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return time ? (
    <Container>
      <Text.S variant={Text.Variant.secondary} weight={Text.Weight.medium}>
        {' '}
        {getFormattedTimeValue(minutes)} : {getFormattedTimeValue(seconds)}
      </Text.S>
    </Container>
  ) : null;
};

export default Countdown;

const Container = styled(View)`
  flex-direction: row;
  min-width: 65px;
`;
