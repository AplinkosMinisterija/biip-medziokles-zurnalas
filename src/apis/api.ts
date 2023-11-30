import {LimitRequestBody} from '@root/state/limitedAnimals/actions';
import {
  DataState,
  EventCategory,
  GuestInvitation,
  LootRegistrationData,
  LootUpdateData,
  Role,
} from '@state/types';
import axios, {AxiosRequestHeaders, AxiosResponse} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {config} from '../config';

export interface LoginResponse {
  token: string;
  refreshToken?: string;
}

export interface AuthResponse {
  tisket: string;
  host: string;
  url: string;
}

export interface HuntingEventsProps {
  scope: EventCategory;
  my?: boolean;
  sort?: string;
  huntingAreaId: string | null;
  page?: number;
  pageSize?: number;
}

class ApiClass {
  private readonly baseUrl: string;

  private headers: AxiosRequestHeaders;

  constructor() {
    this.baseUrl = config.BASE_URL;
    this.headers = {
      'content-type': 'application/json',
    };
  }

  resetToken = async () => {
    this.headers.Authorization = '';
  };

  setAccessToken = (jwt: string) => {
    this.headers.Authorization = 'Bearer ' + jwt;
  };

  getAccessToken = async () => {
    if (!this.headers.Authorization) {
      const value = await EncryptedStorage.getItem('user_data');
      const jwt = value ? JSON.parse(value)?.token : null;

      if (jwt) {
        this.setAccessToken(jwt);
      }
      return jwt;
    } else {
      return this.headers.Authorization;
    }
  };

  get = async <T>(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<AxiosResponse<T>> => {
    const url = this.baseUrl + endpoint;
    await this.getAccessToken();
    return axios.get(url, {headers: this.headers, params});
  };

  delete = async <T>(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<AxiosResponse<T>> => {
    const url = this.baseUrl + endpoint;
    await this.getAccessToken();
    return axios.delete(url, {headers: this.headers, params});
  };

  post = async <T, B>(endpoint: string, data: B): Promise<AxiosResponse<T>> => {
    const url = this.baseUrl + endpoint;
    await this.getAccessToken();
    return axios.post(url, data, {headers: this.headers});
  };

  patch = async <T, B>(
    endpoint: string,
    data: B,
  ): Promise<AxiosResponse<T>> => {
    const url = this.baseUrl + endpoint;
    await this.getAccessToken();
    return axios.patch(url, data, {headers: this.headers});
  };

  auth = async (): Promise<AuthResponse> => {
    const response: AxiosResponse = await this.post('/auth/evartai/sign', {});
    return response.data;
  };

  authLogin = async (ticket: string): Promise<AuthResponse> => {
    const response: AxiosResponse = await this.post('/auth/evartai/login', {
      ticket,
    });
    return response.data;
  };

  login = async (params: {
    username: string;
    password: string;
  }): Promise<LoginResponse> => {
    const response: AxiosResponse = await this.post('/auth/login', {
      email: params.username,
      password: params.password,
    });
    return response.data;
  };

  refreshAccessToken = async (
    reftreshToken: string,
  ): Promise<LoginResponse> => {
    const response: AxiosResponse = await this.post('/auth/refresh', {
      token: reftreshToken,
    });
    return response.data;
  };

  updateUser = async ({
    userId,
    data,
  }: {
    userId: string;
    data: any;
  }): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.patch(
      `/api/users/${userId}`,
      data,
    );
    return response.data;
  };

  updateTenantUser = async ({
    tenantUserId,
    data,
    permissions,
  }: {
    tenantUserId: string;
    data: {role: Role; huntingAreas: string[]};
    permissions: any;
  }): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.patch(
      `/api/tenantUsers/${tenantUserId}`,
      {...data, permissions},
    );
    return response.data;
  };

  removeTenantUser = async (tenantUserId: string) => {
    const response = await api.delete(`/api/tenantUsers/${tenantUserId}`);
    return response.data;
  };

  updateNotificationToken = async ({
    os,
    token,
  }: {
    os: string | null;
    token: string | null;
  }): Promise<any> => {
    const updateData =
      os === 'ios' ? {iosToken: token} : {firebaseToken: token};
    const response: AxiosResponse = await this.patch(
      `/api/auth/me`,
      updateData,
    );
    return response.data;
  };

  createHunting = async (params: {
    type: string;
    startDate: string;
    notes?: string;
    huntingArea?: string;
  }): Promise<any> => {
    const response: AxiosResponse = await this.post('/api/huntings', params);
    return response.data;
  };

  updateHunting = async ({id, data}: {id: string; data: any}): Promise<any> => {
    const response: AxiosResponse = await this.patch(
      `/api/huntings/${id}`,
      data,
    );
    return response.data;
  };

  startHuntingRegistration = async (id: string): Promise<any> => {
    const response: AxiosResponse = await this.post(
      `/api/huntings/${id}/startRegistration`,
      {},
    );
    return response.data;
  };

  startHunting = async (id: string): Promise<any> => {
    const response: AxiosResponse = await this.post(
      `/api/huntings/${id}/start`,
      {},
    );
    return response.data;
  };

  endHunting = async (id: string): Promise<any> => {
    const response: AxiosResponse = await this.post(
      `/api/huntings/${id}/end`,
      {},
    );
    return response.data;
  };

  deleteHunting = async ({
    huntingId,
  }: {
    huntingId: string;
  }): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.delete(
      `/api/huntings/${huntingId}`,
    );
    return response.data;
  };

  registerLoot = async ({data}: {data: LootRegistrationData}): Promise<any> => {
    const response: AxiosResponse = await this.post('/api/loots', data);
    return response.data;
  };

  updateLoot = async ({data}: {data: LootUpdateData}): Promise<any> => {
    const response: AxiosResponse = await this.patch(
      `/api/loots/${data.id}`,
      data,
    );
    return response.data;
  };

  updateHunterLocation = async ({
    memberId,
    location,
  }: {
    memberId: string;
    location: Array<string>;
  }): Promise<any> => {
    const response: AxiosResponse = await this.patch(
      `/api/huntingMembers/${memberId}`,
      {location},
    );
    return response.data;
  };

  getHuntingMapMembers = async (huntingId: string): Promise<any> => {
    const response: AxiosResponse = await this.get(
      `/api/huntings/${huntingId}/mapMembers`,
    );
    return response.data;
  };

  getGeoPoints = async (huntingId: string): Promise<any> => {
    const response: AxiosResponse = await this.get(
      `/api/huntings/${huntingId}/geoPoints`,
    );
    return response.data;
  };

  removeHuntingMember = async ({member}: {member: string}): Promise<any> => {
    const response: AxiosResponse = await this.delete(
      `/api/huntingMembers/${member}`,
    );
    return response.data;
  };

  updateHuntingMember = async ({
    memberId,
    data,
  }: {
    memberId: string;
    data: any;
  }): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.patch(
      `/api/huntingMembers/${memberId}`,
      data,
    );
    return response.data;
  };

  getMainData = async (): Promise<any> => {
    const response: AxiosResponse = await this.get('/api/state/user');
    return response;
  };

  getPatchData = async (dadState: string): Promise<any> => {
    const response: AxiosResponse = await this.get(
      `/api/state/user?dadPatch=true&dadState=${dadState || ''}`,
    );
    return response;
  };

  inviteHuntingMember = async ({
    user,
    huntingId,
  }: {
    user: string | GuestInvitation;
    huntingId: string;
  }): Promise<DataState> => {
    const response: AxiosResponse = await this.post(`/api/huntingMembers`, {
      user,
      hunting: huntingId,
    });
    return response.data;
  };

  inviteTenantUser = async (params: {
    firstName: string;
    lastName: string;
    ticketNumber: string;
    personalCode: string;
    role: Role;
    huntingAreas: string[];
    tenant: string;
    permissions: {
      huntingManager: boolean;
    };
  }): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.post(
      `/api/tenantUsers/invite`,
      params,
    );
    return response.data;
  };

  requestLimits = async (params: LimitRequestBody): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.post(
      `/api/limitsRequests/request`,
      params,
    );
    return response.data;
  };

  agreeToTermsOfService = async (
    termsId: string | number,
  ): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.post(
      `/api/termsOfService/agree`,
      {
        id: termsId,
      },
    );
    return response.data;
  };

  createFootprintObservation = async (params: {
    footprintTrack: number;
    eventTime: string;
  }): Promise<any> => {
    const response: AxiosResponse = await this.post(
      '/api/footprintObservations',
      params,
    );
    return response.data;
  };

  getHuntingEvents = async ({
    scope,
    huntingAreaId,
    my = false,
    sort = 'status',
    page = 1,
    pageSize = 200,
  }: HuntingEventsProps): Promise<any> => {
    const huntingArea = huntingAreaId ? `"huntingArea":${huntingAreaId}` : '';
    const query = huntingArea ? `&query={${huntingArea}}` : '';
    const response: AxiosResponse = await this.get(
      `/api/huntings/?scope=${scope}${
        my || !huntingAreaId ? ',my' : ''
      }${query}&page=${page}&pageSize=${pageSize}&populate=tenant,huntingArea,manager,managerUser&sort=${sort}`,
    );
    return response;
  };
  getHunting = async (id: string | number): Promise<any> => {
    const response: AxiosResponse = await this.get(
      `/api/hunting/${id}/?populate=tenant,huntingArea,manager,managerUser,lootsCount`,
    );
    return response;
  };
}

export const api = new ApiClass();
