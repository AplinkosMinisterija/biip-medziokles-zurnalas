import React, {useRef} from 'react';
import {View} from 'react-native';
import {hasNotch} from '../utils/layout';
import {FastList} from './FastList';

export const ScrollPicker = ({
  data,
  defaultIndex,
  fixedHeight,
  highlightStyle,
  itemHeight,
  onChange,
  renderRow,
  wrapperHeight,
  wrapperStyle,
}) => {
  let wrapHeight = wrapperHeight;
  const sView = useRef(null);

  if (fixedHeight) {
    wrapHeight = wrapperHeight;
  } else if (data.length * itemHeight < wrapperHeight) {
    if (data.length <= 12 || data.length * itemHeight === itemHeight) {
      wrapHeight = wrapperHeight;
    } else {
      wrapHeight = data.length * itemHeight;
    }
  }

  const h = (wrapHeight - itemHeight) / 2;

  const onPress = (section, row) => {
    sView?.current?.scrollView?.current?.scrollTo({
      x: 0,
      y: row * itemHeight,
    });
  };

  const onLayout = () => {
    setTimeout(
      () =>
        sView?.current?.scrollView?.current?.scrollTo({
          x: 0,
          y: defaultIndex * itemHeight,
          animated: false,
        }),
      0,
    );
  };

  const onScrollHandler = e => {
    let currentPos = 0;

    if (e?.nativeEvent?.contentOffset?.y) {
      currentPos = Math.ceil(e.nativeEvent.contentOffset.y / itemHeight);
    }

    if (!currentPos || currentPos < 0) {
      currentPos = 0;
    }

    if (currentPos > data.length - 1) {
      currentPos = data.length - 1;
    }

    onChange(data[currentPos].value);
  };

  return (
    <View style={[{height: wrapHeight}, wrapperStyle]}>
      <View
        style={[
          {
            marginTop: 1,
            top: (wrapHeight - itemHeight) / 2,
            height: itemHeight,
          },
          highlightStyle,
        ]}
      />
      <FastList
        ref={sView}
        bounces={false}
        accessible={false}
        showsVerticalScrollIndicator={false}
        headerHeight={h - itemHeight}
        footerHeight={h - itemHeight}
        renderHeader={() => <View />}
        renderFooter={() => <View />}
        sections={[data.length]}
        insetTop={16}
        insetBottom={hasNotch ? 36 : 16}
        sectionHeight={0}
        scrollEventThrottle={16}
        snapToAlignment="start"
        rowHeight={itemHeight}
        decelerationRate="fast"
        onLayout={onLayout}
        snapToInterval={itemHeight}
        onScrollEnd={onScrollHandler}
        renderRow={(section, row) => renderRow(section, row, onPress)}
      />
    </View>
  );
};

ScrollPicker.defaultProps = {
  data: [],
  fixedHeight: false,
  highlightStyle: {
    position: 'absolute',
    width: '100%',
  },
  itemHeight: 30,
  onChange: () => ({}),
  wrapperStyle: {
    flex: 1,
    overflow: 'hidden',
  },
};
