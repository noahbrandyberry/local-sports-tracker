import React, { useEffect, useRef } from 'react';
import { Text, InvalidDataError, LoadingScreen } from 'components';
import {
  StyleSheet,
  View,
  FlatList,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectEvents, selectEventsLoading } from './services/selectors';
import EventRow from './components/EventRow';
import RootStackParamList from 'src/RootStackParams';
import { Event } from 'teams/models';
import { selectPosts } from '../TeamHome/services/selectors';
import { selectSchoolTeamsLoading } from 'store/selectors';
import config from 'src/config/config';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
  const { teamId, schoolId } = route.params;
  const loading = useSelector(selectSchoolTeamsLoading);
  const scheduleLoading = useSelector(selectEventsLoading);
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const events = useSelector(selectEvents);
  const posts = useSelector(selectPosts);

  const listRef = useRef<FlatList>(null);

  const subscribeToCalendar = async () => {
    Linking.openURL(
      `${config.baseUrl}/schools/${
        team?.school_id
      }/upcoming_events.ics?${qs.stringify(
        {
          team_id: teamId,
        },
        { arrayFormat: 'brackets' },
      )}`,
    );
  };

  useEffect(() => {
    if (events.length > 0) {
      const index = events.findIndex(
        (event) => !event.start.clone().add(2, 'hours').isBefore(),
      );

      if (index >= 0) {
        listRef.current?.scrollToIndex({
          index: index,
          animated: true,
          viewOffset: -16,
        });
      }
    }
  }, [events]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!team || !school) {
    return <InvalidDataError />;
  }

  const onSelectEvent = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    if (event?.start.clone().add(2, 'hours').isBefore()) {
      const post = posts.find((p) => p.event_id === eventId);
      if (post) {
        return navigation.navigate('PostDetail', {
          postId: post.id,
          teamId: team.id,
        });
      }
    }

    navigation.navigate('EventDetail', {
      teamId,
      eventId,
      schoolId,
    });
  };

  const calculateItemLayout = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[] | undefined | null,
    index: number,
  ) => {
    const displayedEvents = data as Event[];
    const heights = displayedEvents.map((event) => {
      let height = 104;
      if (event.opponents[0]) {
        height += 24;
      }
      if (
        event.result ||
        event.team_results.find((result) => result.team_id === team.id)
      ) {
        height += 22;
      }

      return height;
    });

    const offset = heights
      .slice(0, index)
      .reduce((partial_sum, a) => partial_sum + a, 0);
    return {
      length: heights[index],
      offset: offset,
      index,
    };
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.modalDragBar} />
        <View style={styles.headerContainer}>
          <Text style={styles.header} numberOfLines={1}>
            {team.name}
          </Text>
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
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          style={styles.scrollContainer}
          data={events}
          ref={listRef}
          ListEmptyComponent={
            scheduleLoading ? <View /> : <Text>No events found.</Text>
          }
          getItemLayout={calculateItemLayout}
          renderItem={({ item }) => (
            <EventRow event={item} onPress={onSelectEvent} />
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
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  subHeader: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
});

export default TeamSchedule;
