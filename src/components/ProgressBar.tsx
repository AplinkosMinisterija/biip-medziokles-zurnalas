import React, {memo} from 'react';
import {Animated, View} from 'react-native';
import styled from 'styled-components';
import {useWidthAnimation} from '../utils/hooks';

type ProgressBarProps = {
  barWidth: number;
  value: number;
  maxValue: number;
  initValue?: number;
};

const ProgressBar = ({
  barWidth,
  value,
  maxValue,
  initValue,
}: ProgressBarProps) => {
  const progressBarAnimation = useWidthAnimation({
    duration: 1000,
    percent: maxValue ? (value * 100) / maxValue : 0,
    width: barWidth,
  });

  const initWidth =
    initValue &&
    barWidth * ((maxValue ? (initValue * 100) / maxValue : 0) / 100);

  return (
    <ProgressBarWrapper barWidth={barWidth}>
      <InactiveProgressBar />
      <ActiveProgressBar style={{width: progressBarAnimation}} />
      {!!initValue && <ActiveProgressBar style={{width: initWidth}} />}
    </ProgressBarWrapper>
  );
};

export default memo(ProgressBar);

const ProgressBarWrapper = styled(View)<{barWidth: number}>`
  overflow: hidden;
  position: relative;
  width: ${({barWidth}) => (barWidth ? `${barWidth}px` : '100%')};
`;

const InactiveProgressBar = styled(View)`
  height: 5px;
  background-color: ${({theme}) => theme.colors.secondary};
  opacity: 0.3;
`;

const ActiveProgressBar = styled(Animated.View)`
  height: 5px;
  border-radius: 5px;
  position: absolute;
  background-color: ${({theme}) => theme.colors.secondary};
`;
