import {appActions} from '@root/state/app/actions';
import {getMessage} from '@root/state/app/appSelectors';
import {GlobalErrorSuccessAlertType} from '@root/state/types';
import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Text from '../components/Text';
import {JSXNode} from '../types';

const GlobalErrorSuccessAlert = (): JSXNode => {
  const dispatch = useDispatch();

  const hideTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);

  const hideMessage = () =>
    dispatch(appActions.setMessage({type: null, message: null}));

  const message = useSelector(getMessage);

  const isError = message?.type === GlobalErrorSuccessAlertType.Error;
  const text = message?.message;

  const animatedCardSlide = React.useRef(new Animated.Value(0)).current;

  const translateY = animatedCardSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, -5],
  });

  useEffect(() => {
    if (!text) return;
    setAnim(1);
    hideTimeout.current = setTimeout(() => setAnim(0), isError ? 6000 : 4000);
  }, [text, isError]);

  useEffect(
    () => () => {
      if (hideTimeout.current) return clearTimeout(hideTimeout.current);
    },
    [],
  );

  const setAnim = (value: number) => {
    Animated.spring(animatedCardSlide, {
      toValue: value,
      useNativeDriver: true,
    }).start(() => {
      value < 1 && hideMessage();
    });
  };

  return text ? (
    <Content isError={isError} style={{transform: [{translateY}]}}>
      <Closable onPress={() => setAnim(0)}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={isError ? '#ED5565' : '#36B572'}
        />
        <Message variant={Text.Variant.light} weight={Text.Weight.medium}>
          {text}
        </Message>
      </Closable>
    </Content>
  ) : null;
};

const Message = styled(Text.S)`
  line-height: 21px;
`;

const Closable = styled(Pressable)`
  flex: 1;
  padding: ${({theme}) => theme.header + 10}px 16px 18px 16px;
`;

const Content = styled(Animated.View)<{isError: boolean}>`
  flex: 1;
  z-index: 999;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  flex-direction: row;
  background-color: ${({theme, isError}) =>
    isError ? theme.colors.error : theme.colors.success};
`;

export default GlobalErrorSuccessAlert;
