import Geolocation from '@react-native-community/geolocation';
import Button from '@root/components/Button';
import {Expanded, Padding} from '@root/components/layout';
import Text from '@root/components/Text';
import {GeoCoordinate, GeoMapFeatureCollection} from '@root/state/types';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import WebView from 'react-native-webview';
import styled from 'styled-components';

interface Props {
  url: string;
  onBack: () => void;
  onPress: (coords: GeoMapFeatureCollection) => void;
  isLastStep: boolean;
}

const GeoMap: React.FC<Props> = ({url, onBack, onPress, isLastStep}) => {
  const webViewRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [initialLocation, setInitialLocation] = useState<GeoCoordinate | null>(
    null,
  );
  const [currentLocation, setCurrentLocation] =
    useState<GeoMapFeatureCollection | null>(null);

  useEffect(() => {
    (async () => {
      Geolocation.getCurrentPosition(
        info => {
          const coords = {
            long: info.coords.longitude,
            lat: info.coords.latitude,
          };
          setInitialLocation(coords);
          // setCurrentLocation(coords);
          setHasPermission(true);
        },
        _error => {},
      );
    })();
  }, []);

  if (!hasPermission || !initialLocation)
    return (
      <GeolocationInvalidView>
        <Padding bottomPadding={20}>
          <Text.M>Progamėlė neturi prieigos prie Geolokacijos</Text.M>
        </Padding>
        <Button
          variant={Button.Variant.Transparent}
          text={'Atidaryti nustatymus'}
          onPress={() => {
            Linking.openSettings();
          }}
        />
      </GeolocationInvalidView>
    );

  return (
    <View>
      <WebView
        androidLayerType={'hardware'}
        nestedScrollEnabled
        containerStyle={{
          flex: 0,
          height: '110%',
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
          const response = JSON.parse(e.nativeEvent.data);
          const data: GeoMapFeatureCollection = JSON.parse(
            response?.mapIframeMsg?.data,
          );
          setCurrentLocation(data);
        }}
        source={{
          uri: `${url}&zoom=${JSON.stringify({
            x: initialLocation.lat,
            y: initialLocation.long,
          })}
          `,
        }}
      />
      <PopUp extraFooter={90}>
        <ButtonWrapper>
          <BottomButton
            variant={Button.Variant.Transparent}
            text={strings.common.back}
            onPress={onBack}
          />
          <BottomButton
            disabled={!currentLocation}
            variant={Button.Variant.PrimaryDark}
            text={isLastStep ? strings.common.save : strings.common.continue}
            onPress={() => {
              onPress(currentLocation);
            }}
          />
        </ButtonWrapper>
      </PopUp>
    </View>
  );
};

const GeolocationInvalidView = styled(Expanded)`
  justify-content: center;
  padding: 30px;
`;

const LoaderContainer = styled(View)`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const PopUp = styled(View)<{extraFooter: number}>`
  position: absolute;
  padding: 16px 24px;
  background-color: white;
  width: 90%;
  right: 16px;
  left: 16px;
  bottom: ${({theme, extraFooter}) => `${theme.footer + extraFooter}px`};
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

export default GeoMap;
