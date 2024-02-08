import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CustomTabBar from '@root/components/CustomTabBar';
import {getAppHomeScreenMode} from '@root/state/app/appSelectors';
import {selectLoginStatus} from '@root/state/auth/authSelectors';
import {
  ExtendedHuntingData,
  ExtendedHuntingMemberData,
  ExtendedLootData,
} from '@root/state/data/dataSelectors';
import {
  AnimalData,
  AppHomeScreenMode,
  SeasonData,
  State,
  StatEventData,
  UserData,
} from '@root/state/types';
import {navigationRef} from '@utils/navigation';
import {default as React} from 'react';
import {useSelector} from 'react-redux';
import SideBar from '../components/SideBar';
import AdditionalLootInformation from './AdditionalLootInformation';
import AnimalDataScreens from './AnimalData';
import Events from './Events';
import GlobalConfirmationModal from './GlobalConfirmationModal';
import GlobalErrorSuccessAlert from './GlobalErrorSuccessAlert';
import HunterInvitation from './HunterInvitation';
import Hunting from './Hunting';
import AddLootCommentary from './Hunting/AddLootCommentary';
import LootInfoPanel from './Hunting/LootInfoPanel';
import HuntingAreaMap from './HuntingAreaMap';
import HuntingAreaSwitch from './HuntingAreaSwitch';
import HuntingMemberConfirmationPanel from './HuntingMemberConfirmationPanel';
import HuntingMemberLoot from './HuntingMemberLoot';
import HuntingMemberPanel from './HuntingMemberPanel';
import Limits from './Limits';
import LimitsRequest from './LimitsRequest';
import Login from './Login';
import LoginFailed from './LoginFailed';
import LootRegistration from './LootRegistration';
import NewHunting from './NewHunting';
import QRCode from './QRCode';
import SelectHunterLocation from './SelectHunterLocation';
import Settings from './Settings';
import SignatureModal from './SignatureModal';
import SnowFootprints from './SnowFootprints';
import TermsOfService from './TermsOfService';

export enum routes {
  main = 'main',
  tabs = 'tabNavigation',
  intro = 'intro',
  login = 'login',
  loginFailed = 'loginFailed',
  events = 'events',
  hunting = 'hunting',
  settings = 'settings',
  newHunting = 'newHunting',
  huntingInner = 'huntingInner',
  hunterInvitation = 'hunterInvitation',
  inviteGuest = 'inviteGuest',
  inviteUser = 'inviteUser',
  imagePreview = 'imagePreview',
  huntingMemberPanel = 'huntingMemberPanel',
  huntingMemberConfirmationPanel = 'huntingMemberConfirmationPanel',
  huntingMore = 'huntingMore',
  huntingDialog = 'huntingDialog',
  addLootCommentary = 'addLootCommentary',
  activeHuntsDialog = 'activeHuntsDialog',
  lootRegistration = 'lootRegistration',
  additionalLootInformation = 'additionalLootInformation',
  lootInfo = 'lootInfo',
  profile = 'profile',
  myProfile = 'myProfile',
  organization = 'organization',
  members = 'members',
  limits = 'limits',
  newMember = 'newMember',
  huntingMemberLoot = 'huntingMemberLoot',
  huntingAreaSwitch = 'huntingAreaSwitch',
  globalErrorSuccessAlert = 'globalErrorSuccessAlert',
  limitsRequest = 'limitsRequest',
  animalStatistics = 'animalStatistics',
  animalPeriodFilter = 'animalPeriodFilter',
  huntingAreaMap = 'huntingAreaMap',
  selectHunterLocation = 'selectHunterLocation',
  usersHuntingList = 'usersHuntingList',
  qrCodeDisplay = 'qrCodeDisplay',
  qrCodeReader = 'qrCodeReader',
  qrScanResult = 'qrScanResult',
  signatureModal = 'signatureModal',
  termsOfService = 'termsOfService',
  footPrintObservationList = 'footPrintObservationList',
  footPrintWizard = 'footPrintWizard',
  footPrintObservation = 'footPrintObservation',
  footPrintRecordWizard = 'footPrintRecordWizard',
  startObservationModal = 'startObservationModal',
}

export type TabsParamList = {
  [routes.events]: undefined;
  [routes.hunting]: {
    tab?: string;
    huntingId: string;
  };
  [routes.limits]: undefined;
};

// TODO add types for every route.
// See UsersHuntingList.tsx as an example
export type RootStackParamList = {
  [routes.main]: undefined;
  [routes.tabs]: NavigatorScreenParams<TabsParamList>;
  [routes.intro]: undefined;
  [routes.login]: undefined;
  [routes.loginFailed]: undefined;
  [routes.settings]: undefined;
  [routes.newHunting]: undefined;
  [routes.huntingInner]: {
    huntingId: string;
    tab?: string;
  };
  [routes.hunterInvitation]: undefined;
  [routes.inviteGuest]: undefined;
  [routes.inviteUser]: undefined;
  [routes.imagePreview]: undefined;
  [routes.huntingMemberPanel]: {
    member: ExtendedHuntingMemberData;
    huntingData: ExtendedHuntingData;
    myMember: ExtendedHuntingMemberData;
  };
  [routes.huntingMemberConfirmationPanel]: {
    huntingId: string;
    confirmWithNextStep: boolean;
    nextStep?: () => void;
  };
  [routes.huntingMore]: {
    huntingId: string;
  };
  [routes.huntingDialog]: {
    title?: string;
    message?: string;
  };
  [routes.activeHuntsDialog]: {
    activeHunts: ExtendedHuntingData[];
  };
  [routes.lootRegistration]: {
    huntingMemberId: string;
    huntingAreaMPVId: string | number;
  };
  [routes.additionalLootInformation]: {
    loot: ExtendedLootData;
  };
  [routes.lootInfo]: {
    loot: ExtendedLootData;
  };
  [routes.profile]: {
    userId: string;
    tenantId: string;
  };
  [routes.myProfile]: undefined;
  [routes.organization]: undefined;
  [routes.members]: undefined;
  [routes.newMember]: undefined;
  [routes.huntingMemberLoot]: undefined;
  [routes.addLootCommentary]: {
    loot: ExtendedLootData;
  };
  [routes.huntingAreaSwitch]: undefined;
  [routes.globalErrorSuccessAlert]: undefined;
  [routes.limitsRequest]: undefined;
  [routes.animalStatistics]: {
    limitedAnimalId: string;
    selectedSeason: SeasonData;
    filteredPeriod?: {start: string; end: string};
  };
  [routes.animalPeriodFilter]: undefined;
  [routes.huntingAreaMap]: undefined;
  [routes.selectHunterLocation]: undefined;
  [routes.usersHuntingList]: {
    animal: AnimalData;
    user: UserData;
    huntings: StatEventData[];
  };
  [routes.qrCodeDisplay]: {
    huntingMemberId: string;
  };
  [routes.qrCodeReader]: undefined;
  [routes.qrScanResult]: undefined;
  [routes.signatureModal]: {
    signer: UserData;
    onSign: (signature: string) => void;
    syncSelector?: (state: State) => boolean;
  };
  [routes.termsOfService]: undefined;
  [routes.footPrintObservationList]: undefined;
  [routes.footPrintWizard]: {
    huntingAreaId: string;
    mpvId: string;
  };
  [routes.footPrintObservation]: {
    observationId: string | number;
  };
  [routes.footPrintRecordWizard]: undefined;
  [routes.startObservationModal]: undefined;
};

const Router = () => {
  const {loggedIn} = useSelector(selectLoginStatus);
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const Drawer = createDrawerNavigator();
  const Tabs = createBottomTabNavigator();
  const homeScreenMode = useSelector(getAppHomeScreenMode);
  const initialRoute =
    homeScreenMode === AppHomeScreenMode.HUNTING
      ? routes.tabs
      : routes.footPrintObservationList;
  const TabNavigation = () => (
    <Tabs.Navigator
      detachInactiveScreens={false}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name={routes.events}
        key={routes.events}
        component={Events}
        options={{headerShown: false}}
      />
      <Tabs.Screen
        name={routes.hunting}
        key={routes.hunting}
        component={Hunting.TabView}
        options={{headerShown: false}}
      />
      <Tabs.Screen
        name={routes.limits}
        key={routes.limits}
        component={Limits}
        options={{headerShown: false}}
      />
    </Tabs.Navigator>
  );

  const DrawerNavigation = () => (
    <Drawer.Navigator
      initialRouteName={initialRoute}
      drawerContent={SideBar}
      detachInactiveScreens={false}
    >
      <Drawer.Screen
        name={routes.tabs}
        key={routes.tabs}
        component={TabNavigation}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name={routes.footPrintObservationList}
        key={routes.footPrintObservationList}
        component={SnowFootprints.ObservationListScreen}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        // detachInactiveScreens={false}
        // detachPreviousScreen={false}
        screenOptions={{
          // detachPreviousScreen: false,
          headerShown: false,
        }}
      >
        {loggedIn ? (
          <>
            <Stack.Screen
              name={routes.main}
              component={DrawerNavigation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={routes.additionalLootInformation}
              component={AdditionalLootInformation}
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.lootInfo}
              component={LootInfoPanel}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.lootRegistration}
              component={LootRegistration}
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name={routes.huntingMemberLoot}
              component={HuntingMemberLoot}
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.newHunting}
              component={NewHunting}
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.huntingInner}
              component={Hunting.InnerView}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={routes.hunterInvitation}
              component={HunterInvitation.SelectionModal}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.huntingMemberPanel}
              component={HuntingMemberPanel}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.addLootCommentary}
              component={AddLootCommentary}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.huntingMemberConfirmationPanel}
              component={HuntingMemberConfirmationPanel}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.inviteGuest}
              component={HunterInvitation.Guest}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.imagePreview}
              component={HunterInvitation.ImagePreview}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.inviteUser}
              component={HunterInvitation.User}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.huntingMore}
              component={Hunting.MoreView}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.huntingDialog}
              component={Hunting.Dialog}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.activeHuntsDialog}
              component={Hunting.ActiveHuntsDialog}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'none',
              }}
            />
            <Stack.Screen
              name={routes.myProfile}
              component={Settings.MyProfile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.profile}
              component={Settings.Profile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.organization}
              component={Settings.Organization}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.members}
              component={Settings.Members}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.newMember}
              component={Settings.NewMember}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.huntingAreaMap}
              component={HuntingAreaMap}
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.selectHunterLocation}
              component={SelectHunterLocation}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name={routes.huntingAreaSwitch}
              component={HuntingAreaSwitch}
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.limitsRequest}
              component={LimitsRequest}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.animalStatistics}
              component={AnimalDataScreens.AnimalStatistics}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.animalPeriodFilter}
              component={AnimalDataScreens.PeriodFilter}
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.usersHuntingList}
              component={AnimalDataScreens.UsersHuntingList}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.signatureModal}
              component={SignatureModal}
              options={{
                presentation: 'transparentModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.qrCodeDisplay}
              component={QRCode.QRCodeDisplayScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.termsOfService}
              component={TermsOfService}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.footPrintWizard}
              component={SnowFootprints.ObservationWizardScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.footPrintObservation}
              component={SnowFootprints.ObservationScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={routes.footPrintRecordWizard}
              component={SnowFootprints.RecordWizardScreen}
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name={routes.startObservationModal}
              component={SnowFootprints.StartObservationModal}
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={routes.login}
              key={routes.login}
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={routes.loginFailed}
              key={routes.loginFailed}
              component={LoginFailed}
              options={{headerShown: false}}
            />
          </>
        )}
        <Stack.Screen
          name={routes.qrCodeReader}
          component={QRCode.QRCodeReaderScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routes.qrScanResult}
          component={QRCode.QRScanResultScreen}
        />
      </Stack.Navigator>
      <GlobalErrorSuccessAlert />
      <GlobalConfirmationModal />
    </NavigationContainer>
  );
};

export default Router;
