import CheckboxCard from '@root/components/CheckboxCard';
import {Padding} from '@root/components/layout';
import RadioButtonCard from '@root/components/RadioButtonCard';
import {LootCaseType} from '@root/state/types';
import {strings} from '@root/strings';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  selectedCase: LootCaseType;
  setSelectedCase: (value: LootCaseType) => void;
  isExtraCase: boolean;
  setExtraCase: (value: boolean) => void;
}

const ExtraCase: React.FC<Props> = ({
  style,
  selectedCase,
  setSelectedCase,
  isExtraCase,
  setExtraCase,
}) => {
  return (
    <View style={style}>
      <Padding horizontal={20}>
        <CheckboxCard
          selected={isExtraCase}
          label="Netipinis atvejis"
          onPress={() => {
            if (isExtraCase) {
              setSelectedCase(LootCaseType.standard);
            }
            setExtraCase(!isExtraCase);
          }}
        />
        <Padding topPadding={20} />
        {isExtraCase && (
          <>
            {(Object.values(LootCaseType) as Array<LootCaseType>)
              .filter(type => type !== LootCaseType.standard)
              .map((type, idx) => (
                <RadioButtonCard
                  key={idx}
                  variant={RadioButtonCard.Variant.rounded}
                  onPress={() => {
                    setSelectedCase(type);
                  }}
                  label={strings.lootCaseType[type]}
                  value={type}
                  selected={selectedCase === type}
                />
              ))}
          </>
        )}
      </Padding>
    </View>
  );
};

export default ExtraCase;
