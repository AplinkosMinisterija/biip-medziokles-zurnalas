import {AuthResponse} from '@apis/api';
import {CheckVersionResponse} from 'react-native-check-version';
import {ExtendedHuntingMemberData} from './data/dataSelectors';

export enum CompassDirection {
  N = 'N',
  NE = 'NE',
  E = 'E',
  SE = 'SE',
  S = 'S',
  SW = 'SW',
  W = 'W',
  NW = 'NW',
}

export enum AppHomeScreenMode {
  HUNTING = 'HUNT_EVENTS',
  SNOW_FOOTPRINT = 'SNOW_FOOTPRINT',
}

export enum EventCategory {
  today = 'today',
  future = 'future',
  past = 'past',
}

export enum HuntingType {
  selinamoji = 'SELINAMOJI',
  varomoji = 'VAROMOJI',
  tykojamoji = 'TYKOJAMOJI',
}

export enum LootCaseType {
  standard = 'STANDARD',
  car_accident = 'CAR_ACCIDENT',
  sick_or_hurt = 'SICK_OR_HURT',
}

export enum WolfHuntingType {
  varomoji = 'VAROMOJI',
  tykojamoji = 'TYKOJAMOJI',
  veliavelemis = 'SU_VELIAVELEMIS',
}

export enum Role {
  owner = 'OWNER',
  userAdmin = 'USER_ADMIN',
  hunter = 'HUNTER',
  farmer = 'FARMER',
}

export enum AnimalFormTypes {
  Wolf = 'WOLF',
  Horned = 'HORNED',
  Extended = 'EXTENDED',
  Simple = 'SIMPLE',
  Other = 'OTHER',
}

export enum LimitType {
  perHuntingArea = 'PER_HUNTING_AREA',
  notLimited = 'NOT_LIMITED',
  global = 'GLOBAL',
}

export enum HuntingStatus {
  Created = 'CREATED',
  Ready = 'READY',
  Started = 'STARTED',
  Ended = 'ENDED',
}

export enum UserStatus {
  Invited = 'INVITED',
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
}

export enum GlobalErrorSuccessAlertType {
  Error = 'Error',
  Success = 'SUCCESS',
}

export enum QRCodeDataType {
  hunting = 'HUNTING',
}

export enum AnimalCategory {
  Male = 'MALE',
  Female = 'FEMALE',
  Junior = 'JUNIOR',
}

export enum AnimalAge {
  Adult = 'ADULT',
  TwoYear = 'TWO_YEAR',
  OneYear = 'ONE_YEAR',
}

export const QRMiniAnimalAge = {
  [AnimalAge.Adult]: 0,
  [AnimalAge.TwoYear]: 1,
  [AnimalAge.OneYear]: 2,
};

// minified AnimalCategory enum
export const QRMiniAnimalCategory = {
  [AnimalCategory.Male]: 0,
  [AnimalCategory.Female]: 1,
  [AnimalCategory.Junior]: 2,
};

export interface QRMiniLootData {
  n: string; // name
  a: number; // amount
  t: number; // registeredAt
  c?: string; // category
  g?: string; // age
  h?: {
    l: number; // left
    r: number; // right
  }; // horns
}

export interface QRMiniUserLootData {
  h: string; // hunter
  d: QRMiniLootData[]; // loot data
}

export interface QRMiniHuntingData {
  t: string; // tenant
  a: string; // huntingArea
  m: string; // huntingManager
  h: string; // hunter
  s: number; // startDate
  e?: number; // endDate
  l?: QRMiniUserLootData[]; // loots
}
export interface QRMinifiedData {
  d: QRMiniHuntingData; //data
  //metadata
  m: {
    d: QRCodeDataType; //dataType
    t: number; //timestamp when QR code was generated
  };
}

export interface LocalFile {
  title: string;
  timestamp: number;
  name: string;
  path: string;
}

export enum NATIONALITY {
  local = 'LOCAL',
  foreigner = 'FOREIGNER',
}

export interface TenantData {
  id: string;
  name: string;
  deletedAt?: string;
  email?: string;
  phone?: string;
}

export interface TenantUserData {
  id: string;
  user: string;
  tenant: string;
  role: Role;
  huntingAreas: Array<string>;
  permissions: {
    huntingManager: boolean;
    footprintObservation?: boolean;
    emergencyContact?: boolean;
  };
}

export interface HuntingData {
  id: string;
  startDate: string;
  endDate: string | null;
  type: HuntingType;
  status: HuntingStatus;
  manager: string;
  huntingArea: string;
  tenant: string;
  notes: string | null;
  createdBy: null;
  violation: boolean;
}

export interface GuestInvitation {
  nationality: string;
  ticketNumber: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  email?: string;
}

export interface HuntingAreaData {
  id: string;
  name: string;
  tenant: string;
  createdAt: string;
  updatedAt: string;
  mpvId: string;
}

export interface HuntingMemberData {
  id: string;
  hunting: string;
  user: string;
  status: UserStatus;
  document: string | null;
  isGuest: boolean;
  createdBy: string | null;
  createdAt: string;
  deletedAt: string | null;
  leftAt: string | null;
}

export interface SeasonData {
  id: string;
  startDate: string;
  endDate: string;
}

// TODO possible improvement. Make it more reusable
// Make AnimalAttributes extendable and unique for every possible form type
export interface AnimalComment {
  text: string;
  createdAt: Date;
}
export interface AnimalAttributes {
  lootCase?: LootCaseType;
  comments?: AnimalComment[];
  age?: AnimalAge;
  category?: AnimalCategory;
  horns?: {
    left: number;
    right: number;
  };
  other?: {
    name: string;
  };
  // Wolf attributes:
  coordinates?: GeoCoordinate;
  hasDefects?: boolean;
  hasScabies?: boolean;
  appearanceNotes?: string;
  isPackMember?: boolean;
  packData?: {
    adults: number;
    juniors: number;
    amount: number;
  };
  wolfHuntingType?: WolfHuntingType;
}
export interface AnimalData {
  id: string;
  name: string;
  icon: string;
  iconUrl: string;
  formType: AnimalFormTypes;
  limitType: LimitType;
  attributes?: AnimalAttributes;
}

export enum LootRegistrationMethod {
  MOBILE,
  IVR,
  ADMIN,
}

export enum Violation {
  LIMIT = 'LIMIT',
  PERIOD = 'PERIOD',
  OTHER_ANIMAL = 'OTHER_ANIMAL',
  CAR_ACCIDENT = 'CAR_ACCIDENT',
  SICK_OR_HURT = 'SICK_OR_HURT',
}

export interface LootData {
  id: string;
  huntingMember: string;
  animal: string;
  amount: number;
  attributes: AnimalAttributes;
  createdAt: string;
  createdBy: string;
  registeredAt: string;
  app: LootRegistrationMethod;
  violations: Array<Violation> | null;
  violation: boolean;
}

export interface AnimalLoot extends AnimalData {
  total: number;
  loots?: LootData[];
  limit?: number;
  pendingAmount?: string;
}

export interface LimitedAnimalData {
  id: string;
  season: string;
  animal: string;
  categories: AnimalCategory[];
  type: LimitType | null;
}

export interface ExtendedLimitedAnimalData
  extends Omit<LimitedAnimalData, 'season' | 'animal'> {
  season: SeasonData;
  animal: AnimalData;
  stats?: {
    limit?: number;
    loots?: number;
    pending?: number;
  };
}

export interface TermsOfService {
  id: string;
  content: string;
  createdAt: string;
}

export interface DataState {
  users: {
    $entities: {
      [key: string]: UserData;
    };
    me: string;
  };
  loots: {
    $entities: {
      [key: string]: LootData;
    };
    my: Array<string>;
    byHunting: {
      [key: string]: Array<string>;
    };
    byHuntingArea: {
      [key: string]: Array<string>;
    };
    bySeason: {
      [key: string]: Array<string>;
    };
    byAnimal: {
      [key: string]: Array<string>;
    };
    byLimitedAnimal: {
      [key: string]: Array<string>;
    };
  };
  tenants: {
    $entities: {
      [key: string]: TenantData;
    };
  };
  tenantUsers: {
    $entities: {
      [key: string]: TenantUserData;
    };
    my: Array<string>;
    byHuntingArea: {
      [key: string]: Array<string>;
    };
  };
  huntingAreas: {
    $entities: {
      [key: string]: HuntingAreaData;
    };
    byTenant: {
      [key: string]: Array<string>;
    };
  };
  huntings: {
    $entities: {
      [key: string]: HuntingData;
    };
    my: Array<string>;
    byHuntingArea: {
      [key: string]: Array<string>;
    };
    byUser: {
      [key: string]: Array<string>;
    };
  };
  huntingMembers: {
    $entities: {
      [key: string]: HuntingMemberData;
    };
    byHunting: {
      [key: string]: Array<string>;
    };
  };
  animals: {
    $entities: {
      [key: string]: AnimalData;
    };
    all: Array<string>;
  };
  seasons: {
    $entities: {
      [key: string]: SeasonData;
    };
    all: Array<string>;
    currentSeason: number;
  };
  limits: {
    byHuntingArea: {
      [key: string]: {
        [key: string]: {
          [key: string]: number;
        };
      };
    };
  };
  limitsRequests: {
    $entities: {
      [key: string]: any;
    };
    pendingByHuntingArea: {
      [key: string]: PendingLimitRequest;
    };
  };
  limitedAnimals: {
    $entities: {
      [key: string]: LimitedAnimalData;
    };
    bySeason: {
      [key: string]: {
        limited: Array<string>;
        unlimited: Array<string>;
      };
    };
    statsByHuntingArea: {
      //todo: coul be separated from limitedAnimals
      [key: string]: {
        [key: string]: {
          limit?: number;
          loots?: number;
          pending?: number;
        };
      };
    };
    myStats: {
      [key: string]: {
        limit?: number;
        loots?: number;
        pending?: number;
      };
    };
  };
  termsOfService: {
    $entities: {
      [key: string]: TermsOfService;
    };
    latest: string;
  };
  footprintTracks: {
    $entities: {
      [key: string]: FootprintTrack;
    };
    byHuntingArea: {
      [key: string]: Array<string>;
    };
  };
  footprintObservations: {
    $entities: {
      [key: string]: FootprintObservation;
    };
    byHuntingArea: {
      [key: string]: Array<string>;
    };
  };
  footprintRecords: {
    $entities: {
      [key: string]: FootprintRecord;
    };
    byFootprintObservation: {
      [key: string]: Array<string>;
    };
  };
  dadState: string | null;
}

export interface AuthState {
  loggedIn: boolean;
  eVartaiData: AuthResponse | null;
}

export interface OfflineState {
  offlineData: any;
  offlineLoot: LootData[];
}

export interface GlobalErrorMessageState {
  type: GlobalErrorSuccessAlertType | null;
  message: string | null;
}

export interface ConfirmationModalState {
  visible: boolean;
  title?: string | null;
  subtitle?: string | null;
  primaryButton?: string | null;
  secondaryButton?: string | null;
  onPrimaryPress: () => void;
  loadingSelector?: (val: boolean) => void;
  additionalData?: string | null;
}

export interface SyncState {
  [key: string]: boolean;
}

export interface AppState {
  selectedAppHomeScreenMode: AppHomeScreenMode;
  selectedHuntingArea: string | null;
  guestInvitationPhoto: string | null;
  message: GlobalErrorMessageState;
  deviceToken: string | null;
  confirmationModal: ConfirmationModalState;
  notificationPermissionAsked: boolean;
  isConnected: boolean;
  appUpdateInfo: CheckVersionResponse | null;
  showMyHuntingEventsOnly: boolean;
}

export interface State {
  app: AppState;
  auth: AuthState;
  data: DataState;
  offline: OfflineState;
  network: any;
  sync: any;
  files: LocalFile[];
}

export interface Action {
  type: string;
  payload?: any;
  options?: any;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  deletedAt: string | null;
  ticketNumber?: string;
  phone?: string;
  agreedTermsOfService: string | null;
}

export interface LootRegistrationData {
  huntingMember: string;
  animal: string | null;
  amount: number;
  attributes?: AnimalAttributes;
  registeredAt: Date;
}

export type LootUpdateData = LootRegistrationData & {
  id: string;
};

export interface LootWithUserAndHuntingData {
  lootData: LootData;
  huntingMemberData: HuntingMemberData;
  userData: UserData;
  huntingData: HuntingData;
}

export interface StatEventData extends HuntingData {
  lootCount: number;
  tenantData: TenantData;
  managerData: ExtendedHuntingMemberData;
  huntingAreaData: HuntingAreaData;
}

export interface UserWithLootsAndHuntingData {
  userData: UserData;
  loots: LootData[];
  lootCount: number;
  huntings: StatEventData[];
}

export interface HuntingWithLootsData {
  hunting: StatEventData;
  loots: LootData[];
}

export enum PendingLimitRequestStatus {
  NEW,
}
export interface PendingLimitRequest {
  id: string;
  season: string;
  huntingArea: string;
  tenant: string;
  status: PendingLimitRequestStatus;
  requests: {
    amount: number;
    animal: string;
    amountAdded: number;
  }[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface GeoCoordinate {
  lat: number;
  long: number;
}

export type MemberGuestInvitation = {
  nationality: NATIONALITY;
  firstName: string;
  lastName: string;
  ticketNumber: string;
  personalCode: string;
  email: string;
};

// --- Footprints ---

export enum FootprintFormType {
  SIMPLE = 'SIMPLE',
  EXTENDED = 'EXTENDED',
}

export enum FootprintObservationStatus {
  PLANNED,
  STARTED,
  ENDED,
}

export interface FootprintTrack {
  id: number;
  huntingArea: number;
}
export interface FootprintObservation {
  id: number;
  footprintTrack: number;
  status: FootprintObservationStatus;
  eventTime: string;
  startedAt?: string;
  endedAt?: string;
  airTemperature?: number;
  snowedHoursAgo?: number;
  snowThickness?: number;
  recordsCount: number;
  createdBy: string;
}

export interface ExtendedFootprintObservation
  extends Omit<FootprintObservation, 'createdBy'> {
  createdBy: UserData;
}

export interface FootprintRecord {
  id: number;
  animal: number;
  footprintObservation: string;
  type: FootprintFormType;
  count: number;
  direction?: CompassDirection;
  photos?: Array<string>;
  comment?: string;
  location?: number[];
}

export interface GeoMapSelectedPoint {
  type: string;
  features: GeoFeature[];
}

export interface GeoFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties?: any;
}

export interface HuntingMemberGeoData {
  x: number;
  y: number;
  type?: 'current' | 'other';
  huntingMemberId: number;
  phone: string;
  fullName: string;
}
