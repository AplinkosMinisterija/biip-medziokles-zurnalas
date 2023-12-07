import {api} from '@apis/api';
import {routes} from '@containers/Router';
import {goBack, navigate, pop} from '@utils/navigation';
import {AxiosError} from 'axios';
import {call, delay, put, takeLatest} from 'redux-saga/effects';
import {strings} from '../../strings';
import {appActions} from '../app/actions';
import {dataActions} from '../data/actions';
import {handleFetchMainData} from '../data/saga';
import {offlineActions} from '../offline/actions';
import {syncActions} from '../sync/actions';
import {
  Action,
  GlobalErrorSuccessAlertType,
  HuntingMemberData,
  HuntingStatus,
  UserStatus,
} from '../types';
import {huntingActions, huntingConstants} from './actions';

function* handleCreateHunting({
  payload: {huntingData},
  options: {isEditing},
}: Action) {
  try {
    yield put(syncActions.setOnSync.newHunting(true));
    const {type, date, notes, huntingArea, id} = huntingData;
    if (isEditing) {
      yield call(api.updateHunting, {
        data: {type, startDate: date, notes, huntingArea},
        id,
      });
      yield delay(300);
      yield call(handleFetchMainData);
      yield call(pop, 2);
    } else {
      const {id: huntingId} = yield call(api.createHunting, {
        type,
        startDate: date,
        notes,
        huntingArea,
      });
      yield delay(300);
      yield call(handleFetchMainData);
      yield call(goBack);
      yield call(navigate, routes.huntingInner, {huntingId});
    }
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.newHunting(false));
  }
}

function* handleInviteHuntingMember({payload, options}: Action): any {
  try {
    if (payload.huntingId) {
      yield put(syncActions.setOnSync.huntingMember(true));
      const response = yield call(api.inviteHuntingMember, payload);
      yield delay(300);
      yield put(dataActions.getMainData());
      yield put(appActions.setGuestInvitationPhoto(null));
      yield call(goBack);
      if (options?.onFinish) {
        yield call(options.onFinish, response);
      }
    }
  } catch (e) {
    const error = e as AxiosError;
    const message =
      error.response?.status === 400
        ? 'Bilieto numeris nerastas'
        : 'Nepavyko pridėti svečią';
    yield call(navigate, routes.huntingDialog, {
      title: 'Klaida pridedant svečią',
      message,
    });
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.huntingMember(false));
  }
}

function* handleInviteHuntingMemberWithSignature({payload}: Action): any {
  try {
    if (payload.signature) {
      yield put(syncActions.setOnSync.huntingMember(true));
      const huntingMember: HuntingMemberData = yield call(
        api.inviteHuntingMember,
        payload,
      );
      yield put(
        huntingActions.updateHuntingMember({
          memberId: huntingMember.id,
          data: {
            status: UserStatus.Accepted,
            signature: payload.signature,
          },
        }),
      );
      yield delay(300);
      yield put(dataActions.getMainData());
      yield put(appActions.setGuestInvitationPhoto(null));
    }
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.huntingMember(false));
  }
}

function* handleUpdateHunterLocation({payload, options}: Action) {
  try {
    yield put(syncActions.setOnSync.hunterLocation(true));
    yield call(api.updateHunterLocation, payload);
    yield delay(300);
    yield call(handleFetchMainData);
    if (options?.onFinish) {
      yield call(options.onFinish);
    }
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.hunterLocation(false));
  }
}

function* handleUpdateHuntingStatus({payload}: Action) {
  try {
    yield put(syncActions.setOnSync.updateStatus(true));
    if (payload.status === HuntingStatus.Ready) {
      yield call(api.startHuntingRegistration, payload.id);
    } else if (payload.status === HuntingStatus.Started) {
      yield call(api.startHunting, payload.id);
    } else if (payload.status === HuntingStatus.Ended) {
      yield call(api.endHunting, payload.id);
    }
    yield put(dataActions.getMainData());
    yield delay(100);
    const messageText =
      payload.status === HuntingStatus.Ready
        ? strings.huntingRegistrationStarted
        : payload.status === HuntingStatus.Started
        ? strings.huntingStarted
        : strings.huntingEnded;

    yield put(
      appActions.setMessage({
        message: messageText,
        type: GlobalErrorSuccessAlertType.Success,
      }),
    );
    if (payload.status === HuntingStatus.Ended) {
      yield call(navigate, routes.events);
    } else if (payload.status === HuntingStatus.Started) {
      yield call(navigate, routes.hunting, {
        huntingId: payload.id,
      });
    }
  } catch (e) {
    const error = e as AxiosError;
    const message =
      error.response?.status === 400
        ? 'Šiuo metu dalyvaujate kitoje medžioklėje.'
        : 'Ivyko klaida';
    yield call(navigate, routes.huntingDialog, {
      title: 'Nepavyko atlikti veiksmo',
      message,
    });
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.updateStatus(false));
  }
}

function* handleChangeHuntingManager({
  payload: {huntingId, managerId, signature},
}: Action) {
  try {
    yield put(syncActions.setOnSync.huntingMember(true));
    yield call(api.updateHunting, {
      data: {manager: managerId, signature},
      id: huntingId,
    });
    yield delay(300);
    yield call(handleFetchMainData);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.huntingMember(false));
  }
}

function* handleRemoveHuntingMember({payload: {memberId}}: Action) {
  try {
    yield put(syncActions.setOnSync.huntingMember(true));
    yield call(api.removeHuntingMember, {member: memberId});
    yield delay(300);
    yield call(handleFetchMainData);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.huntingMember(false));
  }
}

function* handleRegisterLoot({payload, options}: Action) {
  try {
    yield put(syncActions.setOnSync.loot(true));
    yield call(api.registerLoot, {data: payload});
    yield delay(300);
    yield handleFetchMainData();
    yield put(offlineActions.removeOfflineLoot(payload));
  } catch (e) {
    yield put(appActions.handleError(e, payload));
  } finally {
    if (options?.onFinish) {
      yield call(options.onFinish);
    }
    yield put(syncActions.setOnSync.loot(false));
  }
}

function* handleUpdateLoot({payload}: Action) {
  try {
    yield put(syncActions.setOnSync.loot(true));
    yield call(api.updateLoot, {data: payload});
    yield delay(300);
    yield call(handleFetchMainData);
    yield call(goBack);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.loot(false));
    yield put(
      appActions.setMessage({
        type: GlobalErrorSuccessAlertType.Success,
        message: 'Laimikis atnaujintas sėkmingai',
      }),
    );
  }
}

function* handleUpdateHuntingMember({payload, options}: Action) {
  try {
    yield put(syncActions.setOnSync.huntingMember(true));
    yield call(api.updateHuntingMember, payload);
    yield delay(300);
    yield call(handleFetchMainData);
    if (options?.onFinish) {
      yield call(options.onFinish);
    }
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.huntingMember(false));
  }
}

function* handleAcceptHuntingMember({payload, options}: Action) {
  try {
    yield put(syncActions.setOnSync.huntingMember(true));
    yield call(api.acceptHuntingMember, payload);
    yield delay(300);
    yield call(handleFetchMainData);
    if (options?.onFinish) {
      yield call(options.onFinish);
    }
  } catch (e) {
    const error = e as AxiosError;
    yield put(appActions.handleError(e));
    if (error.response?.status === 400) {
      if (payload?.signature) {
        // pasirasiai pas vadova
        yield call(navigate, routes.huntingDialog, {
          title: 'Negalite tvirtinti dalyvavimo',
          message: 'Medžiotojas dalyvauja kitoje medžioklėje.',
        });
      } else {
        // pats tvirtina dalyvavima
        yield call(navigate, routes.huntingDialog, {
          title: 'Negalite dalyvauti medžioklėje',
          message: 'Šiuo metu dalyvaujate kitoje medžioklėje.',
        });
      }
    }
  } finally {
    yield put(syncActions.setOnSync.huntingMember(false));
  }
}

function* handleDeleteHunting(action: Action) {
  try {
    yield call(api.deleteHunting, action.payload);
    yield put(dataActions.getMainData());
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
  }
}

export function* HuntingSaga() {
  yield takeLatest(huntingConstants.CREATE_HUNTING, handleCreateHunting);
  yield takeLatest(
    huntingConstants.INVITE_HUNTING_MEMBER,
    handleInviteHuntingMember,
  );
  yield takeLatest(
    huntingConstants.INVITE_HUNTING_MEMBER_WITH_SIGNATURE,
    handleInviteHuntingMemberWithSignature,
  );
  yield takeLatest(
    huntingConstants.UPDATE_HUNTING_STATUS,
    handleUpdateHuntingStatus,
  );
  yield takeLatest(
    huntingConstants.CHANGE_HUNTING_MANAGER,
    handleChangeHuntingManager,
  );
  yield takeLatest(
    huntingConstants.REMOVE_HUNTING_MEMBER,
    handleRemoveHuntingMember,
  );
  yield takeLatest(huntingConstants.REGISTER_LOOT, handleRegisterLoot);
  yield takeLatest(huntingConstants.UPDATE_LOOT, handleUpdateLoot);
  yield takeLatest(
    huntingConstants.UPDATE_HUNTING_MEMBER,
    handleUpdateHuntingMember,
  );
  yield takeLatest(
    huntingConstants.ACCEPT_HUNTING_MEMBER,
    handleAcceptHuntingMember,
  );
  yield takeLatest(huntingConstants.DELETE_HUNTING, handleDeleteHunting);
  yield takeLatest(
    huntingConstants.UPDATE_HUNTER_LOCATION,
    handleUpdateHunterLocation,
  );
}
