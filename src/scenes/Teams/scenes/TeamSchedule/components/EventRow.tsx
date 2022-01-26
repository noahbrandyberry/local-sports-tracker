import { Event, Team } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { School } from 'schools/models';
import { useSelector } from 'react-redux';
import { selectSchoolById } from '../../../../Schools/services/selectors';
import { DefaultTheme } from '@react-navigation/native';
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import { selectPostByEventId } from '../../TeamHome/services/selectors';
import { ordinalize } from 'src/utils/ordinalize';

interface EventRowProps {
  team: Team;
  event: Event;
  school: School;
  onPress: CallableFunction;
}

const EventRow = ({ team, event, school, onPress }: EventRowProps) => {
  let status = '';
  if (event.canceled) {
    status = 'Canceled';
  } else if (event.postponed) {
    status = 'Postponed';
  } else if (event.scrimmage) {
    status = 'Scrimmage';
  } else if (event.conference) {
    status = 'Conference';
  }

  const multipleOpponents = event.opponents.length > 1;
  const opponent = event.opponents[0];
  const opponentSchool = useSelector(selectSchoolById(opponent?.school_id));
  const post = useSelector(selectPostByEventId(event.id));
  const eventLengthHours = 2;
  const isPast = event.start.clone().add(eventLengthHours, 'hours').isBefore();
  const pastStyles = isPast
    ? { backgroundColor: DefaultTheme.colors.background }
    : {};
  const currentStyles = event.start.isBetween(
    moment().subtract(eventLengthHours, 'hours'),
    moment().add(eventLengthHours, 'hours'),
  )
    ? { backgroundColor: 'lightyellow' }
    : {};

  const teamResult = event.team_results.find(
    (result) => result.team_id === team.id,
  );

  return (
    <TouchableOpacity
      style={[styles.rowContainer, pastStyles, currentStyles]}
      onPress={() => onPress(event.id)}
      disabled={isPast && !post}>
      <View style={styles.nameContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {event.name}
        </Text>
        <Text style={{ color: school.primary_color }}>{status}</Text>
      </View>
      <View style={styles.dateTimeLocationContainer}>
        <Text style={styles.dateTimeLocationText}>
          {event.start.calendar(null, {
            lastDay: '[Yesterday]',
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            lastWeek: '[Last] dddd',
            nextWeek: 'dddd',
            sameElse: 'L',
          })}{' '}
          • {event.tba ? 'Time TBA' : event.start.format('LT')}
        </Text>
      </View>
      <View style={styles.dateTimeLocationContainer}>
        <Text style={styles.dateTimeLocationText} numberOfLines={1}>
          <Text style={styles.homeAwayText}>
            {event.home ? 'Home' : 'Away'}
          </Text>{' '}
          - {event.location.name}
        </Text>
      </View>
      {opponent ? (
        <Text style={styles.opponentsText}>
          {multipleOpponents
            ? `${event.opponents.length} Opponents`
            : `${opponentSchool ? opponentSchool.name : opponent.name}`}
        </Text>
      ) : null}
      {event.result ? (
        <Text style={styles.resultsText}>
          {capitalize(event.result_status)}:{' '}
          <Text style={styles.scoreText}>
            {event.home ? event.result.home : event.result.away} -{' '}
            {event.home ? event.result.away : event.result.home}
          </Text>
        </Text>
      ) : teamResult ? (
        <Text style={styles.resultsText}>
          {ordinalize(teamResult.place)} Place
          <Text style={styles.scoreText}> - {teamResult.points} Points</Text>
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
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
    marginBottom: 12,
    padding: 15,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    flex: 1,
  },
  dateTimeLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeLocationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
    flex: 1,
  },
  icon: {
    marginRight: 6,
  },
  homeAwayText: {
    fontWeight: '600',
  },
  opponentsText: {
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: 6,
  },
  resultsText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  scoreText: {
    fontWeight: '400',
  },
});

export default EventRow;