import {useNavigation} from '@react-navigation/native';
import {appActions} from '@root/state/app/actions';
import {getGuestInvitationPhoto} from '@root/state/app/appSelectors';
import React from 'react';
import {Image, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import HeaderBack from '../../components/HeaderBack';
import {strings} from '../../strings';

const ImagePreview = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const image: string | null = useSelector(getGuestInvitationPhoto);

  const handleDelete = () => {
    if (image) {
      dispatch(appActions.setGuestInvitationPhoto(null));
    }
    navigation.goBack();
  };

  return (
    <Container>
      <HeaderBack
        title={strings.guestInvitationTitle}
        onGoBack={navigation.goBack}
      />
      {!!image && (
        <Img
          source={{
            uri: image,
          }}
        />
      )}
      <FooterContainer>
        <CleanButton
          variant={Button.Variant.Transparent}
          text={strings.common.back}
          onPress={navigation.goBack}
        />
        <CreateButton
          variant={Button.Variant.Danger}
          text={strings.common.delete}
          onPress={handleDelete}
        />
      </FooterContainer>
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

const Img = styled(Image)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.primaryUltraLight};
`;

const FooterContainer = styled(View)`
  flex-direction: row;
  padding: ${({theme}) => `16px 16px ${theme.footer}px 16px`};
  background-color: white;
  position: absolute;
  bottom: 0;
`;

const CleanButton = styled(Button)`
  padding: 0 8px 0 0;
  width: 50%;
`;

const CreateButton = styled(Button)`
  padding: 0 0 0 8px;
  width: 50%;
`;

export default ImagePreview;
