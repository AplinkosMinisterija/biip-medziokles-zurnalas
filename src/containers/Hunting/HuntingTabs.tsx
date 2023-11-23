import WarningTriangleIcon from '@root/components/svg/WarningTriangle';
import {theme} from '@root/theme';
import {ExtendedHuntingData} from '@state/data/dataSelectors';
import {getWidth} from '@utils/layout';
import {values} from 'lodash';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {strings} from '../../strings';
import Text from './../../components/Text';

export enum Selection {
  Members = 'members',
  Loot = 'loot',
  Map = 'map',
}

interface HuntinTabsProps {
  selectedTab: string;
  onOpenTab: (val: Selection) => void;
  huntingData: ExtendedHuntingData;
}

const HuntingTabs = ({
  selectedTab = Selection.Loot,
  onOpenTab,
  huntingData,
}: HuntinTabsProps) => {
  const smallDevice = getWidth() < 380;

  return (
    <Container>
      <Left>
        {values(Selection).map(tab => (
          <Tab
            key={tab}
            active={selectedTab === tab}
            smallDevice={smallDevice}
            onPress={() => {
              onOpenTab(tab);
            }}
          >
            <Label active={selectedTab === tab}>
              {strings.huntingTabs[tab]}
            </Label>
            {huntingData.violation && tab === Selection.Loot && (
              <StyledWarningIcon color={theme.colors.secondary} size={20} />
            )}
          </Tab>
        ))}
      </Left>

      {/* {!!huntingData?.notes && (
        <Note
          onPress={() =>
            navigation.navigate(routes.huntingMore, {
              note: huntingData?.notes,
              huntingId: huntingData?.id,
            })
          }
        >
          <InfoIcon />
        </Note>
      )} */}
    </Container>
  );
};

const Container = styled(View)`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.primaryDark};
  padding: 8px 20px 0 16px;
  justify-content: space-between;
`;

const Left = styled(View)`
  flex-direction: row;
`;

const Tab = styled(TouchableOpacity)<{active?: boolean; smallDevice: boolean}>`
  flex-direction: row;
  padding: ${({smallDevice}) => (smallDevice ? '8px 18px' : '8px 24px')};
  background-color: ${({theme, active}) =>
    active ? theme.colors.almostWhite : theme.colors.primaryDark};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

const Label = styled(Text.M)<{active?: boolean}>`
  color: ${({theme, active}) =>
    active ? theme.colors.primaryDark : theme.colors.white};
`;

const StyledWarningIcon = styled(WarningTriangleIcon)`
  margin-left: 7px;
`;

export default HuntingTabs;
