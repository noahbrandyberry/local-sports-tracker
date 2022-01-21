import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectLocationData = ({ location }: RootState) => location;

export const selectCurrentLocation = createSelector(
  selectLocationData,
  (locationData) => locationData.currentLocation,
);
