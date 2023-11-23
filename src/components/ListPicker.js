import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {hasNotch, isIOS} from '../utils/layout';
import {ScrollPicker} from './ScrollPicker';
import Text from './Text';

export const ListPicker = ({
  data,
  lineSuffix,
  theme,
  height,
  title,
  titleSize,
  onChange,
  initialIndex,
  defaultValue,
  style,
}) => {
  const itemHeight = 48;
  let centerIdx = initialIndex ? initialIndex : Math.floor(data.length / 2);
  centerIdx = data.findIndex(s => s.value === defaultValue);
  const getInitialValue = () => data[centerIdx]?.value;

  useEffect(() => {
    const initialValue = getInitialValue();
    onChange(initialValue);
  }, []);

  const themedStyles = styles(theme);

  const renderItem = (section, row, jumpTo) => (
    <TouchableOpacity
      onPress={() => {
        jumpTo(section, row);
        onChange(data[row]?.value);
      }}
      style={[themedStyles.itemContainer, style]}
    >
      <Text.M theme={theme} size="l" style={themedStyles.itemText}>
        {data[row]?.label}
        {lineSuffix}
      </Text.M>
    </TouchableOpacity>
  );

  return (
    <>
      {title && (
        <Text.M
          theme={theme}
          size={titleSize}
          weight="bold"
          style={themedStyles.title}
        >
          {title}
        </Text.M>
      )}
      <View style={{height, width: '100%'}}>
        <ScrollPicker
          defaultIndex={centerIdx}
          onChange={onChange}
          data={data}
          rotationEnabled={false}
          itemHeight={itemHeight}
          wrapperHeight={height}
          renderRow={renderItem}
          highlightStyle={{
            marginTop: 0.5,
            borderTopWidth: 1,
            borderTopColor: theme.colors.text,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.text,
            height: itemHeight,
          }}
          wrapperStyle={themedStyles.wrapper}
        />
      </View>
    </>
  );
};

ListPicker.defaultProps = {
  data: [],
  defaultValue: null,
  height: 430,
  initialIndex: null,
  lineSuffix: '',
  onChange: () => ({}),
  theme: null,
  title: null,
  titleSize: 'xl',
};

const styles = theme =>
  StyleSheet.create({
    gradient: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 9,
    },
    itemContainer: {
      alignItems: 'center',
      height: 48,
      justifyContent: 'flex-start',
      width: '100%',
    },
    itemText: {
      color: theme.colors.text,
      textAlign: 'center',
    },
    separator: {
      backgroundColor: theme.colors.text,
      height: 1,
      left: 0,
      position: 'absolute',
      right: 0,
    },
    title: {
      color: theme.colors.text,
      lineHeight: 32,
      marginBottom: 30,
      marginHorizontal: 16,
      textAlign: 'center',
    },
    wrapper: {
      backgroundColor: 'transparent',
      paddingBottom: isIOS && hasNotch ? 0 : 16,
    },
  });

export default ListPicker;
