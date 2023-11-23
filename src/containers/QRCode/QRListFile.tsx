import {Padding, Row} from '@root/components/layout';
import Delete from '@root/components/svg/Delete';
import PaperClipIcon from '@root/components/svg/PaperClip';
import Text from '@root/components/Text';
import {theme} from '@root/theme';
import React from 'react';
import {Pressable, View} from 'react-native';
import styled from 'styled-components';

interface Props {
  title: string;
  editMode?: boolean;
  fileName: string;
  filePath: string;
  onPress: (filePath: string) => void;
  onDeletePress: (filePath: string) => void;
}

const QRListFile: React.FC<Props> = ({
  title,
  editMode = false,
  fileName,
  filePath,
  onPress,
  onDeletePress,
}) => {
  return (
    <Card>
      <Content
        onPress={() => {
          if (!editMode) {
            onPress(filePath);
          }
        }}
      >
        <Text.M>{title}</Text.M>
        <Row topPadding={5} crossAxis="center">
          <Padding rightPadding={5}>
            <PaperClipIcon />
          </Padding>
          <Text.XS>{fileName}</Text.XS>
        </Row>
      </Content>
      {editMode && (
        <IconPressable onPress={() => onDeletePress(filePath)}>
          <DeleteIcon color={theme.colors.error} />
        </IconPressable>
      )}
    </Card>
  );
};

const Card = styled(View)`
  flex-direction: row;
  align-items: center;
  margin: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${() => theme.colors.primaryUltraLight};
  background-color: ${() => theme.colors.almostWhite};
`;

const Content = styled(Pressable)`
  flex: 1;
  flex-direction: column;
  padding: 12px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
`;

const DeleteIcon = styled(Delete)`
  padding: 0 12px;
  justify-content: center;
`;

const IconPressable = styled(Pressable)`
  justify-content: center;
`;

export default QRListFile;
