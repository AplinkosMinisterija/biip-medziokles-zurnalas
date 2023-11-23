import ExpandButton from '@root/components/ExpandButton';
import RadioButtonCard from '@root/components/RadioButtonCard';
import {HuntingType} from '@root/state/types';
import {useHeightAnimation} from '@root/utils/hooks';
import React, {useState} from 'react';
import {Animated, View} from 'react-native';
import styled from 'styled-components';

const HEIGHT = 200;

const HuntingTypePicker = () => {
  const [selectedType, setSelectedType] = useState<string>('regular');
  const [height, setHeight] = useState(0);
  const animation = useHeightAnimation({
    duration: 500,
    height,
  });
  return (
    <Container>
      <RadioButtonCard
        variant={RadioButtonCard.Variant.rounded}
        onPress={() => {
          setSelectedType('regular');
        }}
        label={'Medžioklė'}
        value={null}
        selected={selectedType === 'regular'}
      />
      <ButtonVertical
        label={'Nestandartiniai atvejai'}
        onPress={() => setHeight(HEIGHT)}
        expanded={height === HEIGHT}
      />
      <AnimatedMenu style={{height: animation}}>
        {(Object.values(HuntingType) as Array<HuntingType>)
          .filter(type => type !== HuntingType.varomoji)
          .map((type, idx) => (
            <RadioButtonCard
              key={idx}
              variant={RadioButtonCard.Variant.rounded}
              onPress={() => {
                setSelectedType(type);
              }}
              label={type}
              value={null}
              selected={type === selectedType}
            />
          ))}
      </AnimatedMenu>
    </Container>
  );
};

const Container = styled(View)`
  margin-horizontal: 16px;
`;

const AnimatedMenu = styled(Animated.View)`
  overflow: hidden;
`;

const ButtonVertical = styled(ExpandButton)`
  padding: 0;
  padding-left: 8px;
  align-items: flex-start;
  margin-top: 30px;
  height: 40px;
  justify-content: center;
`;

export default HuntingTypePicker;
