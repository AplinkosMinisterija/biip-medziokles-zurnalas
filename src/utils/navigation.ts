import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

export const navigationRef: any = createNavigationContainerRef();

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef?.current?.goBack();
  }
}

export const navigate = (name: string, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const pop = (numberOfScreens?: number) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(numberOfScreens || 1));
  }
};

export const push = (name: string, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
};
