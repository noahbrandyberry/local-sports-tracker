import { Location } from 'schools/models/location';

export const formatAddress = (location: Location, separator = ', ') =>
  `${location.address_1}${
    location.address_2 ? `${separator}${location.address_2}` : ''
  }${separator}${location.city}, ${location.state} ${location.zip}`;
