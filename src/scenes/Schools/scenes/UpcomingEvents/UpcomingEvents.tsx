import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Linking, StatusBar, StyleSheet, View } from 'react-native';
import { Button, LoadingScreen, Text } from 'components';
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
import { Level } from '../../../Teams/enums/level';
import { typedKeys } from 'src/utils/typedKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gender } from 'teams/enums/gender';
import config from 'src/config/config';
import qs from 'qs';

type UpcomingEventsProps = NativeStackScreenProps<
  RootStackParamList,
  'UpcomingEvents'
>;

const UpcomingEvents = ({ navigation, route }: UpcomingEventsProps) => {
  const { schoolId } = route.params;
  const dispatch = useDispatch();
  const eventsLoading = useSelector(selectUpcomingEventsLoading);
  const [filter, setFilter] = useState<string>();
  const [levels, setLevels] = useState<number[]>();
  const [genders, setGenders] = useState<number[]>();
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

  const toggleLevel = (id: number) => {
    let newLevels = levels ? [...levels] : [];
    if (newLevels.find((level) => level === id)) {
      newLevels = newLevels.filter((level) => level !== id);
    } else {
      newLevels.push(id);
    }

    setLevels(newLevels.length > 0 ? newLevels : undefined);
  };

  const toggleGender = (id: number) => {
    let newGenders = genders ? [...genders] : [];
    if (newGenders.find((gender) => gender === id)) {
      newGenders = newGenders.filter((gender) => gender !== id);
    } else {
      newGenders.push(id);
    }

    setGenders(newGenders.length > 0 ? newGenders : undefined);
  };

  if (!eventsLoading) {
    while (date < maxDate) {
      if (!groupedEvents[date.format(format)]) {
        groupedEvents[date.format(format)] = [];
      }
      date.add(1, 'day');
    }
  }

  const initialRequest = async () => {
    const filters = await AsyncStorage.getItem('@filters');
    const parsedFilters = filters ? JSON.parse(filters) : {};

    dispatch(
      fetchUpcomingEvents({
        schoolId,
        level_id: parsedFilters.levels,
        gender_id: parsedFilters.genders,
      }),
    );
    setLevels(parsedFilters.levels);
    setGenders(parsedFilters.genders);
  };

  useEffect(() => {
    initialRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = () => {
    dispatch(
      fetchUpcomingEvents({ schoolId, level_id: levels, gender_id: genders }),
    );
    AsyncStorage.setItem('@filters', JSON.stringify({ levels, genders }));
    setFilter(undefined);
  };

  const subscribeToCalendar = async () => {
    Linking.openURL(
      `${config.baseUrl}/schools/${schoolId}/upcoming_events.ics?${qs.stringify(
        {
          level_id: levels,
          gender_id: genders,
        },
        { arrayFormat: 'brackets' },
      )}`,
    );
  };

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

  if (!school) return <LoadingScreen />;

  const color = getColorByBackground(school.primary_color);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <View style={styles.modalDragBar} />
        <View style={styles.filtersLabelContainer}>
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={() => setFilter(filter === 'level' ? undefined : 'level')}
            style={[
              styles.filterLabel,
              { backgroundColor: school?.primary_color },
            ]}>
            <Text style={{ color }}>{levels ? 'Levels' : 'All Levels'}</Text>
            {levels ? (
              <View style={[styles.badge, { backgroundColor: color }]}>
                <Text
                  style={[styles.badgeText, { color: school?.primary_color }]}>
                  {levels.length}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setFilter(filter === 'gender' ? undefined : 'gender')
            }
            style={[
              styles.filterLabel,
              { backgroundColor: school?.primary_color },
            ]}>
            <Text style={{ color }}>{genders ? 'Genders' : 'All Genders'}</Text>
            {genders ? (
              <View style={[styles.badge, { backgroundColor: color }]}>
                <Text
                  style={[styles.badgeText, { color: school?.primary_color }]}>
                  {genders.length}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <View style={styles.divider}>
            <TouchableOpacity onPress={subscribeToCalendar}>
              <FontAwesomeIcon
                icon="calendar-plus"
                color={school.primary_color}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        {filter ? (
          <View style={styles.filterContainer}>
            {typedKeys(filter === 'level' ? Level : Gender).map((label) => (
              <TouchableOpacity
                key={filter === 'level' ? Level[label] : Gender[label]}
                style={styles.filter}
                onPress={() =>
                  filter === 'level'
                    ? toggleLevel(Number(Level[label]))
                    : toggleGender(Number(Gender[label]))
                }>
                <Text>{label}</Text>
                {(
                  filter === 'level'
                    ? levels?.find((l) => l === Number(Level[label]))
                    : genders?.find((g) => g === Number(Gender[label]))
                ) ? (
                  <FontAwesomeIcon icon="check" />
                ) : null}
              </TouchableOpacity>
            ))}
            <Button
              onPress={onFilter}
              style={{
                backgroundColor: school.primary_color,
                marginTop: 8,
              }}>
              Filter
            </Button>
          </View>
        ) : null}
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
  filtersLabelContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: 'white',
    fontSize: 12,
    marginHorizontal: 5,
    position: 'relative',
  },
  filterContainer: {
    padding: 20,
  },
  filter: {
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
    marginVertical: 5,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    fontSize: 12,
  },
  divider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default UpcomingEvents;
