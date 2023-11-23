import {useEffect, useRef, useState} from 'react';
import {Animated, Keyboard} from 'react-native';

export const useWidthAnimation = ({
  duration,
  percent,
  width,
}: {
  duration: number;
  percent: number;
  width: number;
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: width * (percent / 100),
      duration,
      useNativeDriver: false,
    }).start();
  }, [duration, percent, width]);

  return animation;
};

export const useHeightAnimation = ({
  duration,
  height,
}: {
  duration: number;
  height: number;
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: height,
      duration,
      useNativeDriver: false,
    }).start();
  }, [duration, height]);

  return animation;
};

export const useDebounce = (value: any, delay: number, disabled: boolean) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (disabled) {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current as T;
}

export const useKeyboard = () => {
  const [visible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return visible;
};
