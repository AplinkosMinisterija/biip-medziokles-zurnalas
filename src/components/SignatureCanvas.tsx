import {getHeight, getWidth} from '@utils/layout';
import {default as React, ReactNode, useRef, useState} from 'react';
import {View} from 'react-native';
import Signature from 'react-native-signature-canvas';
import styled from 'styled-components';
import {strings} from '../strings';
import {theme} from '../theme';
import Button from './Button';

const SignatureCanvas = ({
  onPress,
  loading = false,
  info,
}: {
  onPress: (val: string) => void;
  loading?: boolean;
  info: ReactNode;
}) => {
  const ref = useRef<any>(null);
  const signatureBoxHeight = getHeight() * 0.3;
  const signatureBoxWidth = getWidth() * 0.7;
  const [enableConfirm, setEnableConfirm] = useState(false);

  const handleOK = (signature: string) => {
    if (signature) {
      onPress(signature);
    }
  };

  const handleClear = () => {
    setEnableConfirm(false);
    ref.current?.clearSignature();
  };

  const handleConfirm = () => {
    ref.current?.readSignature();
  };
  // TODO use theme colors
  const style = `
  .m-signature-pad {
    height:${signatureBoxHeight}px;
    box-shadow: none;
    border-radius: 8px;
    border: 1px solid #D4DDDE;
  }
  .m-signature-pad--footer {display: none; margin: 0px; height: 0px}`;

  return (
    <Container>
      {info}
      <SignatureBox height={signatureBoxHeight}>
        <Signature
          ref={ref}
          onOK={handleOK}
          webStyle={style}
          onBegin={() => !enableConfirm && setEnableConfirm(true)}
          backgroundColor={theme.colors.almostWhite}
        />
      </SignatureBox>
      <FooterContainer>
        <ClearButton
          variant={Button.Variant.PrimaryLight}
          disabled={loading}
          text={strings.clear}
          onPress={handleClear}
        />
        <SignButton
          variant={Button.Variant.PrimaryDark}
          loading={loading}
          disabled={!enableConfirm || loading}
          text={strings.sign}
          onPress={handleConfirm}
        />
      </FooterContainer>
    </Container>
  );
};

const Container = styled(View)`
  position: relative;
  height: 100%;
`;

const SignatureBox = styled(View)<{height: number}>`
  width: 100%;
  height: ${({height}) => `${height}px`};
`;

const FooterContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 0 ${theme.footer + 12}px 0;
  margin-top: auto;
`;

const ClearButton = styled(Button)`
  width: 45%;
`;

const SignButton = styled(Button)`
  width: 45%;
`;

export default SignatureCanvas;
