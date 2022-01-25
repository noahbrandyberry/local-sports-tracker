import { Event } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { School } from 'schools/models';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useSelector } from 'react-redux';
import { selectSchoolById } from '../../../../Schools/services/selectors';

interface EventRowProps {
  event: Event;
  school: School;
  onPress: CallableFunction;
}

const EventRow = ({ event, school, onPress }: EventRowProps) => {
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

  return (
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={() => onPress(event.id)}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{event.name}</Text>
        <Text style={{ color: school.primary_color }}>{status}</Text>
      </View>
      <View style={styles.dateTimeLocationContainer}>
        <FontAwesomeIcon
          icon="hourglass-start"
          color="#333333"
          style={styles.icon}
          size={14}
        />
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
        <FontAwesomeIcon
          icon="map-marked"
          color="#333333"
          style={styles.icon}
          size={14}
        />
        <Text style={styles.dateTimeLocationText}>
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
            : `${opponentSchool?.name}`}
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
  },
  dateTimeLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeLocationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
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
});

export default EventRow;
