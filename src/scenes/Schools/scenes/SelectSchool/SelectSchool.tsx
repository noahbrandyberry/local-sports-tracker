import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import RootStackParamList from 'src/RootStackParams';
import { SchoolStep } from './steps/SchoolStep';
import { SportStep } from './steps/SportStep';
import { TeamStep } from './steps/TeamStep';
import { useTailwind } from 'tailwind-rn';
import { useBookmarkedTeams } from 'src/hooks/useBookmarkedTeams';
import { uniq } from 'lodash';
import { SelectSchoolNavigatorParams } from './SelectSchoolParams';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

type SelectSchoolProps = NativeStackScreenProps<
  RootStackParamList,
  'SchoolDetail'
>;

const SelectSchoolNavigator =
  createNativeStackNavigator<SelectSchoolNavigatorParams>();

const SelectSchool = ({ navigation }: SelectSchoolProps) => {
  const tw = useTailwind();
  const { bookmarkedTeams } = useBookmarkedTeams();
  const bookmarkedSchoolIds = uniq(bookmarkedTeams.map((t) => t.school_id));

  return (
    <SafeAreaView style={tw('flex-1')}>
      <StatusBar barStyle="dark-content" />

      <SelectSchoolNavigator.Navigator
        screenOptions={({ navigation: { goBack } }) => ({
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => goBack()}>
                <FontAwesomeIcon icon="angle-left" size={20} />
              </TouchableOpacity>
            ) : (
              <View />
            ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon icon="times" size={20} />
            </TouchableOpacity>
          ),
        })}>
        <SelectSchoolNavigator.Screen
          name="School"
          component={SchoolStep}
          initialParams={{ bookmarked: bookmarkedSchoolIds }}
          options={{ title: 'Select School' }}
        />
        <SelectSchoolNavigator.Screen
          name="Sport"
          component={SportStep}
          options={{ title: 'Select Sport' }}
        />
        <SelectSchoolNavigator.Screen
          name="Team"
          component={TeamStep}
          options={{ title: 'Select Team' }}
        />
      </SelectSchoolNavigator.Navigator>
    </SafeAreaView>
  );
};
export default SelectSchool;
