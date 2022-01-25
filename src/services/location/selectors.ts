import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectLocationData = ({ location }: RootState) => location;

export const selectCurrentLocation = createSelector(
  selectLocationData,
  (locationData) => locationData.currentLocation,
);

export const selectCurrentLocationLoading = createSelector(
  selectLocationData,
  (locationData) => locationData.loading,
);

export const selectCurrentLocationError = createSelector(
  selectLocationData,
  (locationData) => locationData.error,
);
