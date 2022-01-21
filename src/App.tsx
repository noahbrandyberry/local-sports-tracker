import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SelectSchool from 'schools/scenes/SelectSchool';
import SchoolsList from 'schools/scenes/SchoolsList';
import SchoolDetail from 'schools/scenes/SchoolDetail';
import { fetchLocation } from 'services/location/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootStackParamList from './RootStackParams';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLocation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SelectSchool" component={SelectSchool} />
        <Stack.Screen name="SchoolsList" component={SchoolsList} />
        <Stack.Screen name="SchoolDetail" component={SchoolDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
