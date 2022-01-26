import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectDeviceTokenData = ({ deviceToken }: RootState) =>
  deviceToken;

export const selectCurrentDeviceToken = createSelector(
  selectDeviceTokenData,
  (deviceTokenData) => deviceTokenData.deviceToken,
);

export const selectCurrentDeviceTokenLoading = createSelector(
  selectDeviceTokenData,
  (deviceTokenData) => deviceTokenData.loading,
);

export const selectCurrentDeviceTokenError = createSelector(
  selectDeviceTokenData,
  (deviceTokenData) => deviceTokenData.error,
);
