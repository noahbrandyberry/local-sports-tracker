import { createNavigationContainerRef } from '@react-navigation/native';
import RootStackParamList from 'src/RootStackParams';
import { CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

interface Route {
  name: keyof RootStackParamList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}

export function reset(routes: Route[]) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 1,
        routes: routes,
      }),
    );
  }
}
