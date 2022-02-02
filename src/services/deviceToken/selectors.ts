import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectDeviceTokenData = ({ deviceToken }: RootState) =>
  deviceToken;

export const selectDevice = createSelector(
  selectDeviceTokenData,
  (deviceTokenData) => deviceTokenData.deviceToken,
);

export const selectDeviceToken = createSelector(
  selectDeviceTokenData,
  (deviceTokenData) => deviceTokenData.deviceToken?.device_token,
);

export const selectDeviceTokenLoading = createSelector(
  selectDeviceTokenData,
  (deviceTokenData) => deviceTokenData.loading,
);

export const selectDeviceTokenError = createSelector(
  selectDeviceTokenData,
  (deviceTokenData) => deviceTokenData.error,
);

export const selectDeviceSubscriptionBySchoolId = (id: number) =>
  createSelector(
    selectDevice,
    (deviceToken) =>
      deviceToken?.device_subscriptions.find(
        (subscription) =>
          subscription.subscribable_type === 'School' &&
          subscription.subscribable_id === id,
      )?.id,
  );

export const selectDeviceSubscriptionByTeamId = (id: number) =>
  createSelector(
    selectDevice,
    (deviceToken) =>
      deviceToken?.device_subscriptions.find(
        (subscription) =>
          subscription.subscribable_type === 'Team' &&
          subscription.subscribable_id === id,
      )?.id,
  );
