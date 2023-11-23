import {useNavigation} from '@react-navigation/native';
import {getExtendedHuntingMember, getMe} from '@root/state/data/dataSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {State} from '@root/state/types';
import {formatPhoneNumber} from '@utils/format';
import {isEqual} from 'lodash';
import React, {useRef, useState} from 'react';
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
  memberId?: string;
  extraFooter?: number;
  editMode?: boolean;
  closePrevView?: boolean;
  initialLocation?: Array<string> | null | undefined;
}

const HuntingMap = ({
  url,
  extraFooter = 0,
  editMode = false,
  memberId,
  closePrevView,
  initialLocation,
}: HuntingMapProps) => {
  const isConnected = useSelector((state: State) => state.network.isConnected);

  const webViewRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const [isReloaded, setIsReloaded] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] =
    useState<Array<string> | null>(null);

  const member = useSelector(
    memberId
      ? getExtendedHuntingMember(memberId)
      : selectedLocation
      ? getExtendedHuntingMember(selectedLocation[0])
      : () => undefined,
  );

  const myUserId = useSelector(getMe);
  const userIsMe = member && myUserId === member?.user?.id;

  const loading = useSelector(getOnSync.hunterLocation);

  const hidePopUp = editMode && isEqual(initialLocation, currentLocation);

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
        originWhitelist={['https://*']}
        startInLoadingState={true}
        onMessage={async e => {
          let response = JSON.parse(e.nativeEvent.data);
          const currentLocation = response?.mapIframeMsg?.currentLocation;
          const selectedlocation = response?.mapIframeMsg?.mapFeature;
          if (currentLocation) {
            setCurrentLocation(currentLocation);
            setSelectedLocation(null);
          } else if (selectedlocation) {
            setCurrentLocation(null);
            setSelectedLocation(selectedlocation);
          } else {
            setCurrentLocation(null);
            setSelectedLocation(null);
          }
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
      {(currentLocation || selectedLocation) && (
        <PopUp extraFooter={extraFooter}>
          {member && (
            <Text.M
              weight={Text.Weight.bold}
            >{`${member?.user?.firstName} ${member?.user?.lastName}`}</Text.M>
          )}
          {editMode && memberId && currentLocation && !hidePopUp && (
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
                        memberId,
                        location: currentLocation,
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
          {!editMode && member?.user?.phone && !userIsMe && (
            <StyledButton
              text={formatPhoneNumber(member?.user?.phone)}
              onPress={() => Linking.openURL(`tel:${member?.user?.phone}`)}
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
