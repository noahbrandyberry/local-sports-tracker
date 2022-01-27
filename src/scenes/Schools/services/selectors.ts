import { createSelector } from 'reselect';
import { selectCurrentLocation } from 'services/location/selectors';
import { RootState } from 'store/model';
import getDistance from 'geolib/es/getDistance';
import convertDistance from 'geolib/es/convertDistance';

export const selectSchoolsData = ({ schools }: RootState) => schools;

export const selectSchools = createSelector(
  selectSchoolsData,
  (schoolsData) => schoolsData.schools,
);

export const selectSchoolsLoading = createSelector(
  selectSchoolsData,
  (schoolsData) => schoolsData.loading,
);

export const selectDefaultSchool = createSelector(
  selectSchoolsData,
  (schoolsData) =>
    schoolsData.schools.find(
      (school) => school.id === schoolsData.defaultSchool,
    ),
);

export const selectValidSchools = createSelector(selectSchools, (schools) =>
  schools.filter((school) => school.visible),
);

export const selectSchoolsWithDistance = createSelector(
  selectValidSchools,
  selectCurrentLocation,
  (schools, currentLocation) =>
    currentLocation
      ? schools.map((school) => ({
          ...school,
          distance: school.location
            ? convertDistance(
                getDistance(currentLocation, school.location),
                'mi',
              )
            : null,
        }))
      : schools,
);

export const selectNearestSchools = createSelector(
  selectSchoolsWithDistance,
  (schools) =>
    [...schools].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)),
);

export const selectSchoolById = (id: number) =>
  createSelector(selectSchools, (schools) =>
    schools.find((school) => school.id === id),
  );
