import {JSXNode} from '@root/types';
import {getFormattedTimeValue} from '@utils/time';
import {differenceInSeconds} from 'date-fns';
import React, {memo, useEffect, useState} from 'react';
import {View} from 'react-native';
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

  useEffect(() => {
    const difference = differenceInSeconds(new Date(), date);
    setTimer(time - difference);
  }, [date, time]);

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

export default memo(Countdown);

const Container = styled(View)`
  flex-direction: row;
  min-width: 65px;
`;
