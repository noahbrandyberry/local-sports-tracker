import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import TeamHome from 'teams/scenes/TeamHome';
import TeamSchedule from 'teams/scenes/TeamSchedule';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { selectTeamById } from './services/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { selectSchoolById } from 'schools/services/selectors';
import {
  fetchEvents,
  resetEvents,
} from './scenes/TeamSchedule/services/actions';
import TeamRoster from 'teams/scenes/TeamRoster';
import TeamMedia from 'teams/scenes/TeamMedia';
import TeamDonate from 'teams/scenes/TeamDonate';
import { fetchPosts, resetPosts } from './scenes/TeamHome/services/actions';
import { getColorByBackground } from 'src/utils/getColorByBackground';

const Tab = createBottomTabNavigator<TeamsNavigatorParams>();
type TeamProps = NativeStackScreenProps<RootStackParamList, 'TeamDetail'>;

const TeamsNavigator = ({ route }: TeamProps) => {
  const { teamId } = route.params;
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const schoolColor = school ? school.primary_color : 'black';
  const schoolTextColor = getColorByBackground(schoolColor);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetEvents());
    dispatch(resetPosts());
    dispatch(fetchEvents({ teamId, schoolId: school?.id || 0 }));
    dispatch(fetchPosts({ teamId, schoolId: school?.id || 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  return (
    <Tab.Navigator
      initialRouteName="TeamHome"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: schoolTextColor,
        },
        tabBarActiveTintColor: schoolColor,
        tabBarActiveBackgroundColor: schoolColor,
        tabBarInactiveBackgroundColor: '#B9B9B9',
        tabBarItemStyle: {
          backgroundColor: schoolTextColor,
        },
      }}>
      <Tab.Screen
        name="TeamSchedule"
        component={TeamSchedule}
        initialParams={{ teamId }}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon="calendar-alt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TeamRoster"
        component={TeamRoster}
        initialParams={{ teamId }}
        options={{
          tabBarLabel: 'Roster',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon="user-friends" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TeamHome"
        component={TeamHome}
        initialParams={{ teamId }}
        options={{
          tabBarItemStyle: {
            borderRadius: 30,
            width: 60,
            flex: undefined,
            aspectRatio: 1,
            marginTop: -5,
            marginHorizontal: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 3,
          },
          tabBarIcon: ({ size }) => (
            <FontAwesomeIcon
              icon="school"
              color={schoolTextColor}
              size={size}
              style={{ marginBottom: 2 }}
            />
          ),
          tabBarLabel: () => <View />,
        }}
      />
      <Tab.Screen
        name="TeamMedia"
        component={TeamMedia}
        initialParams={{ teamId }}
        options={{
          tabBarLabel: 'Media',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon="camera-retro" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TeamDonate"
        component={TeamDonate}
        initialParams={{ teamId }}
        options={{
          tabBarLabel: 'Donate',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon="donate" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TeamsNavigator;
