import {
  NotificationCategory,
  NotificationAction,
} from 'react-native-notifications';

const directionsAction = new NotificationAction(
  'GET_DIRECTIONS',
  'foreground',
  'Get Directions',
  true,
);

export const upcomingEventCategory = new NotificationCategory(
  'UPCOMING_EVENT',
  [directionsAction],
);
