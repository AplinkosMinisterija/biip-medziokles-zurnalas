import {useNavigation} from '@react-navigation/core';
import {getAppUpdateInfo} from '@root/state/app/appSelectors';
import {State} from '@root/state/types';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import React from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../Button';
import HeaderHamburger from '../HeaderHamburger';
import {Expanded} from '../layout';

interface HuntingTabViewHeaderProps {
  handleEndHunting: () => void;
  loading: boolean;
  isHuntingAdmin: boolean;
}

const HuntingTabViewHeader = ({
  handleEndHunting,
  loading,
  isHuntingAdmin,
}: HuntingTabViewHeaderProps) => {
  const navigation = useNavigation<any>();
  const isConnected = useSelector((state: State) => state.network.isConnected);
  const appUpdateInfo = useSelector(getAppUpdateInfo);
  const showBadge = !!appUpdateInfo && appUpdateInfo.needsUpdate;
  const handleMenuClick = () => {
    navigation?.toggleDrawer();
  };

  return (
    <Container>
      <Content>
        <MenuButton>
          <StyledHeaderHamburger
            showBadge={showBadge}
            color={theme.colors.white}
            onPress={handleMenuClick}
          />
        </MenuButton>
        <RightContainer>
          {isHuntingAdmin && (
            <StyledButton
              variant={Button.Variant.Secondary}
              text={strings.endHunting}
              onPress={handleEndHunting}
              loading={loading}
              disabled={!isConnected}
            />
          )}
        </RightContainer>
      </Content>
    </Container>
  );
};

const Container = styled(SafeAreaView)``;

const MenuButton = styled(Expanded)`
  justify-content: center;
`;

const Content = styled(View)`
  min-height: 56px;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const RightContainer = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-right: 16px;
`;

const StyledHeaderHamburger = styled(HeaderHamburger)`
  justify-content: center;
  padding-left: 16px;
  flex: 1;
`;

const StyledButton = styled(Button)`
  flex: 1;
`;

export default HuntingTabViewHeader;
