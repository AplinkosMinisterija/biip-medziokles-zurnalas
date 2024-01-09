import {useNavigation} from '@react-navigation/native';
import {ExtendedHuntingMemberData} from '@root/state/data/dataSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {
  GeoFeature,
  GeoMapFeatureCollection,
  HuntingMemberGeoData,
  State,
} from '@root/state/types';
import {formatPhoneNumber} from '@utils/format';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import PhoneIcon from '../../components/svg/Phone';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {theme} from '../../theme';

interface HuntingMapProps {
  url: string;
  memberData?: ExtendedHuntingMemberData | null;
  extraFooter?: number;
  editMode?: boolean;
  closePrevView?: boolean;
  initialLocation?: unknown;
  points?: HuntingMemberGeoData[];
}

const HuntingMap = ({
  url,
  extraFooter = 0,
  editMode = false,
  memberData,
  closePrevView,
  points,
}: HuntingMapProps) => {
  const isConnected = useSelector((state: State) => state.network.isConnected);

  const webViewRef = useRef<WebView>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const [isReloaded, setIsReloaded] = useState(true);

  const [currentGeoPointData, setCurrentGeoPointData] =
    useState<GeoMapFeatureCollection | null>(null);
  const [selectedGeoPointMemberData, setSelectedGeoPointMemberData] =
    useState<GeoFeature | null>(null);

  const loading = useSelector(getOnSync.hunterLocation);

  useEffect(() => {
    if (webViewRef.current && points && points.length > 0) {
      webViewRef.current.postMessage(
        JSON.stringify({
          points,
        }),
      );
    }
  }, [points, webViewRef]);
  console.tron.log(url);
  return url ? (
    <Container>
      <WebView
        androidLayerType={'hardware'}
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
        cacheMode={isConnected ? 'LOAD_DEFAULT' : 'LOAD_CACHE_ONLY'}
        originWhitelist={['https://*']}
        startInLoadingState={true}
        onMessage={async e => {
          try {
            let response = JSON.parse(e.nativeEvent.data);
            if (editMode) {
              const currentPoint: GeoMapFeatureCollection = JSON.parse(
                response?.mapIframeMsg?.data,
              );
              setCurrentGeoPointData(currentPoint);
            } else {
              const selected: GeoFeature = response?.mapIframeMsg?.selected;
              if (selected && selected.geometry.type === 'Point') {
                setSelectedGeoPointMemberData(selected);
              } else {
                setSelectedGeoPointMemberData(null);
              }
            }
          } catch (error) {}
        }}
        source={{
          uri: url,
        }}
        onLoadEnd={() => {
          if (!isReloaded) {
            (webViewRef.current as any)?.reload();
            setIsReloaded(true);
          }
        }}
      />
      {(!!selectedGeoPointMemberData || memberData) && (
        <PopUp extraFooter={extraFooter}>
          {selectedGeoPointMemberData && (
            <Text.M
              weight={Text.Weight.bold}
            >{`${selectedGeoPointMemberData.properties?.fullName}`}</Text.M>
          )}
          {memberData && (
            <Text.M
              weight={Text.Weight.bold}
            >{`${memberData?.user?.firstName} ${memberData?.user?.lastName}`}</Text.M>
          )}
          {editMode && memberData && (
            <ButtonWrapper>
              <BottomButton
                variant={Button.Variant.PrimaryLight}
                text={strings.common.cancel}
                onPress={() =>
                  closePrevView ? navigation.pop(2) : navigation.goBack()
                }
                disabled={loading}
              />
              <BottomButton
                variant={Button.Variant.PrimaryDark}
                loading={loading}
                disabled={loading || !isConnected}
                text={strings.common.save}
                onPress={() => {
                  dispatch(
                    huntingActions.updateHunterLocation(
                      {
                        memberId: memberData.id,
                        geom: currentGeoPointData,
                      },
                      {
                        onFinish: () =>
                          closePrevView
                            ? navigation.pop(2)
                            : navigation.goBack(),
                      },
                    ),
                  );
                }}
              />
            </ButtonWrapper>
          )}
          {!editMode && selectedGeoPointMemberData && (
            <StyledButton
              text={formatPhoneNumber(
                selectedGeoPointMemberData.properties?.phone,
              )}
              onPress={() =>
                Linking.openURL(
                  `tel:${selectedGeoPointMemberData.properties?.phone}`,
                )
              }
              leftIcon={<PhoneIcon />}
            />
          )}
        </PopUp>
      )}
    </Container>
  ) : (
    <LoaderContainer>
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </LoaderContainer>
  );
};

const LoaderContainer = styled(View)`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Container = styled(View)`
  height: 100%;
`;

const BottomButton = styled(Button)`
  width: 50%;
  margin: 0 10px;
`;

const ButtonWrapper = styled(View)`
  flex-direction: row;
  padding: 18px 12px 0px 12px;
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

const StyledButton = styled(Button)`
  margin-top: 18px;
  width: 100%;
`;

export default HuntingMap;
