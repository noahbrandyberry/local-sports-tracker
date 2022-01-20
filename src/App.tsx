import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import Schools from './scenes/Schools/Schools';
import { fetchLocation } from './services/location/actions';

const App = () => {
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    dispatch(fetchLocation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Schools />
    </SafeAreaView>
  );
};

export default App;
