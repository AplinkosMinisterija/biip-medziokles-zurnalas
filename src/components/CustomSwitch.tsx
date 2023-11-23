import {theme} from '@root/theme';
import React, {useMemo} from 'react';
import {Platform, Switch} from 'react-native';

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<Props> = ({value, onChange}) => {
  const thumbColor = useMemo(() => {
    if (Platform.OS === 'ios') {
      return theme.colors.white;
    } else {
      if (value) {
        return theme.colors.primary;
      } else {
        return theme.colors.white;
      }
    }
  }, [value]);
  const trackColor = useMemo(() => {
    if (Platform.OS === 'ios') {
      return theme.colors.primary;
    } else {
      return theme.colors.primaryUltraLight;
    }
  }, []);

  return (
    <Switch
      trackColor={{
        false: trackColor,
        true: trackColor,
      }}
      thumbColor={thumbColor}
      value={value}
      onValueChange={onChange}
    />
  );
};

export default CustomSwitch;
