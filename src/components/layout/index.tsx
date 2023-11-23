import {View} from 'react-native';
import styled from 'styled-components';
import {Axes, PaddingInsets} from './types';

export const setPadding = (props: PaddingInsets): string => {
  let top = 0;
  let left = 0;
  let bottom = 0;
  let right = 0;

  left = props.horizontal ?? props.leftPadding ?? 0;
  right = props.horizontal ?? props.rightPadding ?? 0;
  top = props.vertical ?? props.topPadding ?? 0;
  bottom = props.vertical ?? props.bottomPadding ?? 0;
  return `${top}px ${right}px ${bottom}px ${left}px`;
};

export const Padding = styled(View)<PaddingInsets>`
  padding: ${(props: PaddingInsets) => setPadding(props)};
`;

export const Center = styled(Padding)`
  justify-content: center;
  align-items: center;
`;

export const Row = styled(Padding)<Axes>`
  flex-direction: row;
  justify-content: ${({mainAxis = 'flex-start'}) => mainAxis};
  align-items: ${({crossAxis = 'stretch'}) => crossAxis};
`;

export const Column = styled(Padding)<Axes>`
  flex-direction: column;
  justify-content: ${({mainAxis = 'flex-start'}) => mainAxis};
  align-items: ${({crossAxis = 'stretch'}) => crossAxis};
`;

export const Expanded = styled(Padding)<{
  flex?: number;
}>`
  flex: ${({flex = 1}) => flex};
`;
