import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Alert, StyleSheet, View } from 'react-native';
import { Text } from 'components';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DefaultTheme } from '@react-navigation/native';
import { fetchUpcomingEvents } from './services/actions';
import {
  selectUpcomingEvents,
  selectUpcomingEventsLoading,
} from './services/selectors';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { Event } from 'teams/models';
import EventRow from 'teams/scenes/TeamSchedule/components/EventRow';
import { fetchEvents } from 'teams/scenes/TeamSchedule/services/actions';
import { selectTeams } from 'teams/services/selectors';
import { selectSchoolById } from '../../services/selectors';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import { SportIcons } from 'src/enums/sportIcons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';

type UpcomingEventsProps = NativeStackScreenProps<
  RootStackParamList,
  'UpcomingEvents'
>;

const UpcomingEvents = ({ navigation, route }: UpcomingEventsProps) => {
  const { schoolId } = route.params;
  const dispatch = useDispatch();
  const eventsLoading = useSelector(selectUpcomingEventsLoading);
  const events = useSelector(selectUpcomingEvents);
  const teams = useSelector(selectTeams);
  const school = useSelector(selectSchoolById(schoolId));
  const calendarColor =
    school && getColorByBackground(school.primary_color) === 'white'
      ? school?.primary_color
      : 'black';

  const format = 'YYYY-MM-DD';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedEvents: any = groupBy(
    events.map((event) => ({
      ...event,
      day: event.start.format(format),
    })),
    (event) => event.start.format(format),
  );

  const minDate = moment().subtract(8, 'months');
  const maxDate = moment().add(8, 'months');
  const date = minDate.clone();

  if (!eventsLoading) {
    while (date < maxDate) {
      if (!groupedEvents[date.format(format)]) {
        groupedEvents[date.format(format)] = [];
      }
      date.add(1, 'day');
    }
  }

  useEffect(() => {
    dispatch(fetchUpcomingEvents({ schoolId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text style={styles.emptyDateText}>No games this day.</Text>
    </View>
  );

  const goToEventDetail = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      const teamId = event.selected_team_id;
      dispatch(fetchEvents({ teamId, schoolId: schoolId }));
      navigation.navigate('EventDetail', {
        teamId,
        eventId,
        schoolId,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.modalDragBar} />
        <Agenda
          items={groupedEvents}
          selected={moment().format(format)}
          renderItem={(event: unknown) => {
            const e = event as Event;
            const team = teams.find((t) => t.id === e.selected_team_id);
            const name: keyof typeof SportIcons | undefined = team?.sport.name;
            const icon =
              team?.sport.name && team?.sport.name in SportIcons && name
                ? SportIcons[name]
                : null;
            return (
              <View
                style={{
                  marginTop: 12,
                  marginBottom: -12,
                  marginRight: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                {team && school ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate({
                        name: 'TeamDetail',
                        params: {
                          teamId: team.id,
                          schoolId,
                          initialRouteName: 'TeamSchedule',
                        },
                      })
                    }
                    style={{
                      backgroundColor: school.primary_color,
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomColor: getColorByBackground(
                        school.primary_color,
                      ),
                      borderBottomWidth: 1,
                    }}>
                    <Text
                      style={{
                        color: getColorByBackground(school.primary_color),
                        fontWeight: 'bold',
                      }}>
                      {team.name}
                    </Text>
                    {icon ? (
                      <FontAwesomeIcon
                        icon={icon}
                        color={getColorByBackground(school.primary_color)}
                      />
                    ) : null}
                  </TouchableOpacity>
                ) : null}
                <EventRow
                  itemStyles={{
                    borderRadius: 0,
                    paddingTop: 8,
                    shadowColor: 'transparent',
                  }}
                  event={event as Event}
                  onPress={(id: number) => goToEventDetail(id)}
                  key={(event as Event).id}
                />
              </View>
            );
          }}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={(a: unknown, b: unknown) =>
            (a as Event).id !== (b as Event).id
          }
          pastScrollRange={8}
          futureScrollRange={8}
          showClosingKnob={true}
          minDate={minDate.format(format)}
          maxDate={maxDate.format(format)}
          renderKnob={() => <View style={styles.modalDragBar} />}
          contentContainerStyle={{ paddingTop: 20 }}
          theme={{
            calendarBackground: DefaultTheme.colors.background,
            textDisabledColor: 'darkgray',
            textColor: 'black',
            dotColor: calendarColor,
            selectedDayBackgroundColor: calendarColor,
            todayTextColor: calendarColor,
            agendaTodayColor: calendarColor,
          }}
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
    paddingVertical: 20,
  },
  modalDragBar: {
    marginBottom: 20,
    alignSelf: 'center',
    width: 36,
    backgroundColor: 'gray',
    height: 5,
    borderRadius: 3,
  },
  emptyDate: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  emptyDateText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 18,
  },
});

export default UpcomingEvents;
