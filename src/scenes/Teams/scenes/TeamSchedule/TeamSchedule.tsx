import React from 'react';
import { Text, InvalidDataError } from 'components';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectEvents } from './services/selectors';
import EventRow from './components/EventRow';

type TeamScheduleProps = NativeStackScreenProps<
  TeamsNavigatorParams,
  'TeamSchedule'
>;

const TeamSchedule = ({ route, navigation }: TeamScheduleProps) => {
  const { teamId } = route.params;
  const dispatch = useDispatch();
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const events = useSelector(selectEvents);

  if (!team || !school) {
    return <InvalidDataError />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.modalDragBar} />
        <Text style={styles.header}>{team.name}</Text>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          style={styles.scrollContainer}
          data={events}
          renderItem={({ item, index }) => (
            <EventRow
              event={item}
              index={index}
              onPress={(id: number) => console.log(id)}
            />
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
    flex: 1,
  },
  well: {
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 24,
    padding: 20,
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
