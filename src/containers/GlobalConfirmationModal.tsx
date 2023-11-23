import {appActions} from '@root/state/app/actions';
import {getConfirmationModalData} from '@root/state/app/appSelectors';
import {usePrevious} from '@utils/hooks';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../components/Button';
import CloseButton from '../components/CloseButton';
import Text from '../components/Text';
import {JSXNode} from '../types';

export type PanRef = {
  openPan: () => void;
  closePan: () => void;
  setPanEnabled: (enabled: boolean) => void;
};

const GlobalConfirmationModal = (): JSXNode => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const data = useSelector(getConfirmationModalData);

  const {
    visible: visibleProp = false,
    title = 'title',
    subtitle = 'subtitle',
    onPrimaryPress,
    additionalData,
    loadingSelector = () => false,
    primaryButton,
    secondaryButton,
  } = data;

  const loadingPrimaryButton: boolean = useSelector(state =>
    loadingSelector(state),
  );

  useEffect(() => {
    setVisible(visibleProp);
  }, [visibleProp]);

  const prevLoading = usePrevious(loadingPrimaryButton);
  useEffect(() => {
    if (prevLoading && !loadingPrimaryButton) {
      setVisible(false);
      setTimeout(() => {
        onCloseModal();
      }, 600);
    }
  }, [prevLoading, loadingPrimaryButton]);

  const onCloseModal = () => {
    dispatch(appActions.closeConfirmationModal());
  };

  return visible ? (
    <Container>
      <Overlay>
        <Content>
          <StyledCloseButton
            onPress={!loadingPrimaryButton ? () => onCloseModal() : () => {}}
          />

          <Title weight={Text.Weight.bold}>{title}</Title>

          {additionalData && (
            <AdditionalData weight={Text.Weight.medium}>
              {additionalData}
            </AdditionalData>
          )}

          {subtitle && <Subtitle>{subtitle}</Subtitle>}

          {primaryButton && (
            <Button
              variant={Button.Variant.PrimaryDark}
              text={primaryButton}
              loading={Boolean(loadingPrimaryButton)}
              onPress={() => {
                onPrimaryPress?.();
                if (!loadingPrimaryButton) onCloseModal();
              }}
            />
          )}
          {secondaryButton && (
            <SecondaryButton
              variant={Button.Variant.PrimaryLight}
              text={secondaryButton}
              onPress={onCloseModal}
              disabled={Boolean(loadingPrimaryButton)}
            />
          )}
        </Content>
      </Overlay>
    </Container>
  ) : null;
};

const Container = styled(View)`
  flex: 1;
  z-index: 99999;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Overlay = styled(View)<any>`
  background-color: ${({theme}) => theme.colors.overlay};
  flex: 1;
  justify-content: center;
`;

const Content = styled(View)`
  background-color: white;
  border-radius: 16px;
  margin-right: 16px;
  margin-left: 16px;
  ${({theme}) => theme.shadow.medium};
  padding: 16px;
`;

const StyledCloseButton = styled(CloseButton)`
  margin-left: auto;
  padding-top: 24px;
  padding-bottom: 24px;
`;

const SecondaryButton = styled(Button)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Subtitle = styled(Text.S)`
  margin-bottom: 16px;
  text-align: center;
`;

const AdditionalData = styled(Text.M)`
  margin-bottom: 16px;
  text-align: center;
`;

const Title = styled(Text.M)`
  margin-bottom: 16px;
  text-align: center;
`;

export default GlobalConfirmationModal;
