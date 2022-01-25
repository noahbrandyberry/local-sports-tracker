import React from 'react';
import { Text, InvalidDataError } from 'components';
import { StyleSheet, View, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectEvents } from './services/selectors';
import EventRow from './components/EventRow';
import RootStackParamList from 'src/RootStackParams';

type TeamScheduleNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TeamDetail'
>;

type TeamScheduleRouteProp = RouteProp<TeamsNavigatorParams, 'TeamSchedule'>;

const TeamSchedule = ({
  route,
  navigation,
}: {
  route: TeamScheduleRouteProp;
  navigation: TeamScheduleNavigationProp;
}) => {
  const { teamId } = route.params;
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const events = useSelector(selectEvents);

  if (!team || !school) {
    return <InvalidDataError />;
  }

  const onSelectEvent = (eventId: number) => {
    navigation.navigate('EventDetail', {
      teamId,
      eventId,
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.modalDragBar} />
        <Text style={styles.header}>{team.name}</Text>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          style={styles.scrollContainer}
          data={events}
          contentInset={{ bottom: 32 }}
          renderItem={({ item }) => (
            <EventRow event={item} school={school} onPress={onSelectEvent} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
  },
  modalDragBar: {
    marginBottom: 20,
    alignSelf: 'center',
    width: 36,
    backgroundColor: 'gray',
    height: 5,
    borderRadius: 3,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subHeader: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
});

export default TeamSchedule;
