import React, { useEffect } from 'react';
import { Text, InvalidDataError, Button, LoadingScreen } from 'components';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import MapView, { Marker } from 'react-native-maps';
import {
  selectEventById,
  selectEventsLoading,
} from '../TeamSchedule/services/selectors';
import { formatAddress } from 'src/utils/formattedAddress';
import openMap from 'react-native-open-maps';
import OpponentRow from './components/OpponentRow';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import { selectDataLoading } from 'store/selectors';
import isEmpty from 'lodash/isEmpty';

type EventDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'EventDetail'
>;

const EventDetail = ({ route, navigation }: EventDetailProps) => {
  const { teamId, eventId, openDirections } = route.params;

  const loading = useSelector(selectDataLoading);
  const eventsLoading = useSelector(selectEventsLoading);
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || ''));
  const event = useSelector(selectEventById(eventId));
  const opponent = event?.opponents[0];
  const opponentSchool = useSelector(
    selectSchoolById(opponent?.school_id ?? ''),
  );

  useEffect(() => {
    if (!eventsLoading && event && team && school && openDirections) {
      getDirections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsLoading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!event || !team || !school) {
    return <InvalidDataError />;
  }

  const isPast = event.start.clone().add(2, 'hours').isBefore();

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

  const name = event.name
    ? event.name
    : opponentSchool
    ? opponentSchool.name
    : opponent
    ? opponent.name
    : event.opponent_name;

  const opponentName = opponent
    ? opponentSchool
      ? opponentSchool.name
      : opponent.name
    : event.opponent_name;

  interface CalendarSuccessAction {
    action: string;
    calendarItemIdentifier?: string;
    eventIdentifier?: string;
  }

  const addToCalendar = () => {
    const eventConfig = {
      title: `${team.name} - ${name}`,
      startDate: event.start.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      endDate: event.start
        .clone()
        .add(2, 'hours')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      location: event.location
        ? formatAddress(event.location)
        : event.location_name,
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo: CalendarSuccessAction) => {
        console.log(
          'We need to improve the calendar management functionality at some point',
          eventInfo,
        );
      })
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  const getDirections = () => {
    openMap({
      latitude: Number(event.location.latitude),
      longitude: Number(event.location.longitude),
      query: event.location.name,
      end: formatAddress(event.location),
    });
  };

  const onSelectSchool = (schoolId: string) => {
    navigation.navigate('SchoolDetail', { schoolId });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentInset={{ bottom: 32 }}>
        <View style={styles.modalDragBar} />

        <Text style={styles.header}>
          {name}
          {status ? ` - ${status}` : ''}
        </Text>

        <View style={styles.well}>
          <Text style={styles.subHeader}>Start Time</Text>
          <Text style={styles.startTime} selectable>
            {event.start.calendar(null, {
              lastDay: '[Yesterday]',
              sameDay: '[Today]',
              nextDay: '[Tomorrow]',
              lastWeek: '[Last] dddd',
              nextWeek: 'dddd',
              sameElse: 'L',
            })}{' '}
            • {event.tba ? 'Time TBA' : event.start.format('LT')}
          </Text>

          {isPast ? null : (
            <Button
              onPress={addToCalendar}
              textStyle={{ color: getColorByBackground(school.primary_color) }}
              style={{
                backgroundColor: school.primary_color,
                marginTop: 12,
              }}>
              Add to Calendar
            </Button>
          )}
        </View>

        {event.opponents.length > 0 || opponentName ? (
          <View style={styles.well}>
            <Text style={styles.subHeader}>Opponents</Text>
            <View style={styles.opponentsContainer}>
              {event.opponents.length > 0 ? (
                event.opponents.map((o, index) => (
                  <OpponentRow
                    key={o.id.toString()}
                    index={index}
                    opponent={o}
                    onPress={onSelectSchool}
                  />
                ))
              ) : (
                <OpponentRow
                  index={0}
                  opponentName={opponentName}
                  onPress={onSelectSchool}
                />
              )}
            </View>
          </View>
        ) : null}

        {event.location ? (
          <View style={[styles.well, styles.mapContainer]}>
            <View style={styles.locationContainer}>
              <Text style={styles.subHeader}>Location</Text>
              <Text>{event.home ? 'Home' : 'Away'} Game</Text>
              <Text selectable style={styles.addressText}>
                {event.location.name}
                {isEmpty(event.location)
                  ? `\n${formatAddress(event.location, '\n')}`
                  : ''}
              </Text>

              {isPast ? null : (
                <Button
                  onPress={getDirections}
                  textStyle={{
                    color: getColorByBackground(school.primary_color),
                  }}
                  style={{ backgroundColor: school.primary_color }}>
                  Get Directions
                </Button>
              )}
            </View>
            {event.location.latitude || event.location.longitude ? (
              <View style={styles.map}>
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: Number(event.location.latitude),
                    longitude: Number(event.location.longitude),
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: Number(event.location.latitude),
                      longitude: Number(event.location.longitude),
                    }}
                    title={event.location.name}
                    description={formatAddress(event.location)}
                  />
                </MapView>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[styles.well, styles.mapContainer]}>
            <View style={styles.locationContainer}>
              <Text style={styles.subHeader}>Location</Text>
              {event.location_name ? (
                <Text>{event.location_name}</Text>
              ) : (
                <Text>No Location Found</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
    padding: 20,
  },
  modalDragBar: {
    marginBottom: 20,
    alignSelf: 'center',
    width: 36,
    backgroundColor: 'gray',
    height: 5,
    borderRadius: 3,
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
  startTime: {
    alignSelf: 'flex-start',
  },
  opponentsContainer: {
    marginTop: 0,
    margin: -20,
  },
  locationContainer: {
    padding: 20,
    paddingBottom: 15,
  },
  addressText: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  mapContainer: {
    padding: 0,
  },
  map: {
    flex: 1,
    height: 175,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
  },
});

export default EventDetail;
