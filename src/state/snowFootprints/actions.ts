export const footprintActionType = {
  CREATE_OBSERVATION: 'footprint_CREATE_OBSERVATION',
};

export const footprintActions = {
  createFootprintObservation: (observation: {
    footprintTrack: number;
    eventTime: string;
    huntingArea: string;
  }) => ({
    type: footprintActionType.CREATE_OBSERVATION,
    payload: observation,
  }),
};
