import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Button from '@root/components/Button';
import EmptyState from '@root/components/EmptyState';
import HeaderBack from '@root/components/HeaderBack';
import CheckIcon from '@root/components/svg/Check';
import EditIcon from '@root/components/svg/Edit';
import {localFileActions} from '@root/state/localFiles/actions';
import {getLocalFiles} from '@root/state/localFiles/localFilesSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {LocalFile} from '@root/state/types';
import {theme} from '@root/theme';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, ListRenderItem} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {RootStackParamList, routes} from '../Router';
import QRListFile from './QRListFile';

type QRScanResultRouteProp = RouteProp<RootStackParamList, routes.qrScanResult>;

interface Props {
  route: QRScanResultRouteProp;
}

//TODO pull to refresh; better loading logic;

const QRScanResultScreen: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const localFiles: LocalFile[] = useSelector(getLocalFiles);
  const isLocalFilesLoading = useSelector(getOnSync.localFiles);

  const [inEditMode, setInEditMode] = useState(false);

  useEffect(() => {
    dispatch(localFileActions.readLocalFiles());
  }, []);

  const renderHeaderIcon = useCallback(() => {
    if (localFiles.length === 0) return null;
    if (inEditMode) {
      return <CheckIcon color={theme.colors.primaryDark} />;
    } else {
      return <EditIcon color={theme.colors.primaryDark} />;
    }
  }, [inEditMode, localFiles]);

  const renderListItem: ListRenderItem<LocalFile> = useCallback(
    ({item, index}) => (
      <QRListFile
        key={index}
        editMode={inEditMode}
        title={item.title}
        fileName={item.name}
        filePath={item.path}
        onPress={() => {
          FileViewer.open(item.path).catch();
        }}
        onDeletePress={() => {
          dispatch(localFileActions.removeLocalFile(item.path));
        }}
      />
    ),
    [inEditMode, dispatch],
  );

  const renderEmptyList = useCallback(() => {
    if (isLocalFilesLoading) {
      return (
        <ActivityIndicator size={'large'} color={theme.colors.primaryDark} />
      );
    } else {
      return <EmptyState title={'Skenuotų dokumentų nėra'} />;
    }
  }, [isLocalFilesLoading]);

  return (
    <>
      <HeaderBack
        renderRightItem={renderHeaderIcon}
        onRightItemPress={() => setInEditMode(prev => !prev)}
        title={'Medžioklės lapų skaitytuvas'}
      />
      <FlatList
        ListEmptyComponent={renderEmptyList}
        ListHeaderComponent={
          <SecondaryButton
            variant={Button.Variant.Secondary}
            text={'Skenuoti QR kodą'}
            onPress={() => {
              navigation.navigate(routes.qrCodeReader);
            }}
          />
        }
        data={localFiles}
        renderItem={renderListItem}
        contentContainerStyle={{
          paddingBottom: 15,
        }}
      />
    </>
  );
};

const SecondaryButton = styled(Button)`
  margin: 25px 16px 35px 16px;
`;

export default QRScanResultScreen;
