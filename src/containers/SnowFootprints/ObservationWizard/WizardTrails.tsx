import Button from '@root/components/Button';
import Text, {Weight} from '@root/components/Text';
import WarningCard from '@root/components/WarningCard';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import {getWidth} from '@root/utils/layout';
import React, {useRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import WebView from 'react-native-webview';
import styled from 'styled-components';
import {TrailData} from './ObservationWizardScreen';

interface Props {
  mpvId: string;
  onBack: () => void;
  onNext: () => void;
  selectedTrial?: TrailData | null;
  setSelectedTrial: (trail: TrailData) => void;
}

const WizardTrails: React.FC<Props> = ({
  mpvId,
  onBack,
  onNext,
  selectedTrial,
  setSelectedTrial,
}) => {
  const webViewRef = useRef(null);
  return (
    <View>
      <WebView
        androidLayerType={'hardware'}
        nestedScrollEnabled
        containerStyle={{
          flex: 0,
          height: '100%',
          width: '100%',
        }}
        ref={webViewRef}
        renderLoading={() => (
          <LoaderContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoaderContainer>
        )}
        originWhitelist={['https://*']}
        startInLoadingState={true}
        onMessage={async e => {
          let response = JSON.parse(e.nativeEvent.data);
          const msg: TrailData = response?.mapIframeMsg?.click[0];
          setSelectedTrial(msg);
        }}
        source={{
          uri: `https://maps.biip.lt/hunting/tracks?mpv_id=${mpvId}`,
        }}
      />
      <AbsoluteWrapper>
        {selectedTrial ? (
          <InfoPanel>
            <Text.L>
              {'Savivalda: '}
              <Text.L weight={Weight.bold}>{selectedTrial.savivalda}</Text.L>
            </Text.L>
            <Text.L>
              {'Teritorija: '}
              <Text.L weight={Weight.bold}>{selectedTrial.teritorija}</Text.L>
            </Text.L>
            <Text.L>
              {'Maršrutas: #'}
              <Text.L weight={Weight.bold}>{selectedTrial.marsrutoNr}</Text.L>
            </Text.L>
            <Text.L>
              {'Ilgis (km): '}
              <Text.L weight={Weight.bold}>{selectedTrial.ilgisKm}</Text.L>
            </Text.L>
          </InfoPanel>
        ) : (
          <StyledWarningCard text={'Pasirinkite maršrutą'} />
        )}
      </AbsoluteWrapper>
      <PopUp extraFooter={100}>
        <ButtonWrapper>
          <BottomButton
            variant={Button.Variant.Transparent}
            text={strings.common.back}
            onPress={onBack}
          />
          <BottomButton
            variant={Button.Variant.PrimaryDark}
            text={strings.common.save}
            disabled={!selectedTrial}
            onPress={onNext}
          />
        </ButtonWrapper>
      </PopUp>
    </View>
  );
};

const LoaderContainer = styled(View)`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const AbsoluteWrapper = styled(View)`
  position: absolute;
  width: ${getWidth() - 32}px;
  top: 16px;
  left: 16px;
`;

const InfoPanel = styled(View)`
  padding: 16px;
  background-color: #ffffffe6;
`;

const StyledWarningCard = styled(WarningCard)`
  background-color: white;
`;

const PopUp = styled(View)<{extraFooter?: number}>`
  position: absolute;
  padding: 16px 24px;
  background-color: white;
  width: 90%;
  right: 16px;
  left: 16px;
  bottom: ${({theme, extraFooter = 90}) => `${theme.footer + extraFooter}px`};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  ${({theme}) => theme.shadow.light}
`;

const BottomButton = styled(Button)`
  width: 50%;
  margin: 0 10px;
`;

const ButtonWrapper = styled(View)`
  flex-direction: row;
  padding: 0px 12px 0px 12px;
`;

export default WizardTrails;
