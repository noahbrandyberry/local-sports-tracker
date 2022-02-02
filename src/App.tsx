import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SelectSchool from 'schools/scenes/SelectSchool';
import SchoolsList from 'schools/scenes/SchoolsList';
import SchoolDetail from 'schools/scenes/SchoolDetail';
import SportDetail from 'schools/scenes/SportDetail';
import EventDetail from 'teams/scenes/EventDetail';
import PostDetail from 'teams/scenes/PostDetail';
import { fetchLocation } from 'services/location/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootStackParamList from './RootStackParams';
import TeamsNavigator from 'teams/TeamsNavigator';
import { EmitterSubscription, StatusBar } from 'react-native';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { saveDeviceToken } from './services/deviceToken/actions';
import {
  Notification,
  NotificationCompletion,
  Notifications,
  Registered,
  RegistrationError,
  NotificationBackgroundFetchResult,
} from 'react-native-notifications';
import { fetchSchools } from 'schools/services/actions';
import { NotificationActionResponse } from 'react-native-notifications/lib/dist/interfaces/NotificationActionResponse';
import * as RootNavigation from './RootNavigation';
import { upcomingEventCategory } from './notifications/categories';

const Stack = createNativeStackNavigator<RootStackParamList>();

library.add(fas);
library.add(fab);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const events: EmitterSubscription[] = [];
    dispatch(fetchLocation());
    dispatch(fetchSchools());

    Notifications.registerRemoteNotifications();

    Notifications.setCategories([upcomingEventCategory]);
    Notifications.ios.setBadgeCount(0);

    Notifications.getInitialNotification()
      .then((notification) => {
        if (notification) notificationOpened(notification, () => {}, undefined);
      })
      .catch();

    events.push(
      Notifications.events().registerRemoteNotificationsRegistered(
        (event: Registered) => {
          dispatch(saveDeviceToken({ device_token: event.deviceToken }));
        },
      ),
    );

    events.push(
      Notifications.events().registerNotificationReceivedForeground(
        (
          notification: Notification,
          completion: (response: NotificationCompletion) => void,
        ) => {
          completion({ alert: true, sound: true, badge: false });
        },
      ),
    );

    events.push(
      Notifications.events().registerNotificationOpened(notificationOpened),
    );

    events.push(
      Notifications.events().registerNotificationReceivedBackground(
        (
          notification: Notification,
          completion: (response: NotificationBackgroundFetchResult) => void,
        ) => {
          completion(NotificationBackgroundFetchResult.NEW_DATA);
        },
      ),
    );

    return () => {
      events.forEach((event) => event.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificationOpened = (
    notification: Notification,
    completion: () => void,
    action: NotificationActionResponse | undefined,
  ) => {
    const eventId = notification.payload.event_id;
    const schoolId = notification.payload.school_id;
    const teamId = notification.payload.team_id;
    if (eventId && schoolId && teamId) {
      RootNavigation.reset([
        {
          name: 'SchoolDetail',
          params: {
            schoolId,
          },
        },
        {
          name: 'TeamDetail',
          params: {
            teamId,
            schoolId,
            initialRouteName: 'TeamSchedule',
          },
        },
        {
          name: 'EventDetail',
          params: {
            teamId,
            eventId,
            schoolId,
            openDirections: action?.identifier === 'GET_DIRECTIONS',
          },
        },
      ]);
    }
    completion();
  };

  return (
    <NavigationContainer ref={RootNavigation.navigationRef}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <Stack.Group>
          <Stack.Screen
            name="SelectSchool"
            component={SelectSchool}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen name="SchoolsList" component={SchoolsList} />
          <Stack.Screen
            name="SchoolDetail"
            component={SchoolDetail}
            options={{ animation: 'none' }}
          />
          <Stack.Screen name="SportDetail" component={SportDetail} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="TeamDetail" component={TeamsNavigator} />
          <Stack.Screen name="EventDetail" component={EventDetail} />
          <Stack.Screen name="PostDetail" component={PostDetail} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
