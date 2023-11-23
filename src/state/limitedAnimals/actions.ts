export const limitActionType = {
  REQUEST: 'limit_REQUEST',
};

export interface LimitRequestBody {
  huntingArea: string;
  requests: {
    limitedAnimal: string;
    amount: string;
  }[];
}

export const limitActions = {
  requestLimits: (payload: LimitRequestBody) => ({
    type: limitActionType.REQUEST,
    payload,
  }),
};
