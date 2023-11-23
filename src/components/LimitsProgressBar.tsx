import React, {memo} from 'react';
import {Animated, View} from 'react-native';
import styled from 'styled-components';
import {useWidthAnimation} from '../utils/hooks';

type LimitsProgressBarProps = {
  barWidth: number;
  value: number;
  maxValue: number;
  secondValue?: number;
};

const LimitsProgressBar = ({
  barWidth,
  value,
  maxValue,
  secondValue,
}: LimitsProgressBarProps) => {
  const progressBarAnimation = useWidthAnimation({
    duration: 0,
    percent: maxValue ? (value * 100) / maxValue : 0,
    width: barWidth,
  });
  const secondProgressBarAnimation = useWidthAnimation({
    duration: 0,
    percent: secondValue && maxValue ? (secondValue * 100) / maxValue : 0,
    width: barWidth,
  });
  return (
    <ProgressBarWrapper barWidth={barWidth}>
      <InactiveProgressBar />
      {!!secondValue && (
        <ActiveSecondProgressBar style={{width: secondProgressBarAnimation}} />
      )}
      <ActiveProgressBar style={{width: progressBarAnimation}} />
    </ProgressBarWrapper>
  );
};

export default memo(LimitsProgressBar);

const ProgressBarWrapper = styled(View)<{barWidth: number}>`
  overflow: hidden;
  position: relative;
  width: ${({barWidth}) => (barWidth ? `${barWidth}px` : '100%')};
`;

const InactiveProgressBar = styled(View)`
  height: 6px;
  border-radius: 6px;
  background-color: ${({theme}) => theme.colors.primaryLight};
`;

const ActiveProgressBar = styled(Animated.View)`
  height: 6px;
  border-radius: 6px;
  position: absolute;
  background-color: ${({theme}) => theme.colors.primaryDark};
  z-index: 9999;
`;

const ActiveSecondProgressBar = styled(Animated.View)`
  height: 6px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  background-color: #ccd4d6;
`;
