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
import { StatusBar } from 'react-native';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
library.add(fas);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLocation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <Stack.Group>
          <Stack.Screen name="SelectSchool" component={SelectSchool} />
          <Stack.Screen name="SchoolsList" component={SchoolsList} />
          <Stack.Screen name="SchoolDetail" component={SchoolDetail} />
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
