import { Event, Team } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, View } from 'react-native';
import { selectSchoolById } from 'schools/services/selectors';
import { useSelector } from 'react-redux';

interface ResultProps {
  event?: Event;
  team?: Team;
}

export const Result = ({ event, team }: ResultProps) => {
  const school = useSelector(selectSchoolById(team?.school_id ?? 0));
  const opponentSchool = useSelector(
    selectSchoolById(event?.opponents[0]?.school_id ?? 0),
  );

  if (!event || !event.result || !team || !event.opponents[0]) return null;
  const opponent = event.opponents[0];
  const homeSchool = event.home ? school : opponentSchool;
  const awaySchool = event.home ? opponentSchool : school;
  const homeTeam = event.home ? team : opponent;
  const awayTeam = event.home ? opponent : team;

  return (
    <View style={styles.container}>
      <Text style={styles.team}>
        Home ({homeSchool ? homeSchool.name : homeTeam.name}) -{' '}
        <Text style={styles.score}>{event.result.home}</Text>
      </Text>
      <Text style={styles.versus}>vs</Text>
      <Text style={styles.team}>
        Away ({awaySchool ? awaySchool.name : awayTeam.name}) -{' '}
        <Text style={styles.score}>{event.result.away}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
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
    padding: 15,
  },
  team: {
    fontSize: 16,
    lineHeight: 20,
  },
  score: {
    fontWeight: '500',
    fontSize: 18,
  },
  versus: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
  },
});
