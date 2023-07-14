import React from 'react';
import { Text, InvalidDataError, Button, LoadingScreen } from 'components';
import {
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectPosts, selectPostsLoading } from './services/selectors';
import PostRow from './components';
import RootStackParamList from 'src/RootStackParams';
import { fetchPosts } from './services/actions';
import ImageModal from 'react-native-image-modal';
import RenderHtml from 'react-native-render-html';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { selectSchoolTeamsLoading } from 'store/selectors';
import config from 'src/config/config';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { selectEvents } from '../TeamSchedule/services/selectors';
import EventRow from '../TeamSchedule/components/EventRow';

type TeamDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TeamDetail'
>;

type TeamHomeNavigationProp = BottomTabNavigationProp<
  TeamsNavigatorParams,
  'TeamHome'
>;

type TeamHomeRouteProp = RouteProp<TeamsNavigatorParams, 'TeamHome'>;

const TeamHome = ({
  route,
  navigation,
}: {
  route: TeamHomeRouteProp;
  navigation: TeamHomeNavigationProp;
}) => {
  const { teamId } = route.params;
  const postsLoading = useSelector(selectPostsLoading);
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectSchoolTeamsLoading);
  const events = useSelector(selectEvents);
  const upcomingEvents = events.filter(
    (event) => !event.start.clone().add(2, 'hours').isBefore(),
  );

  const { width } = useWindowDimensions();
  const contentWidth = width - 40;

  const dispatch = useDispatch();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!team || !school) {
    return <InvalidDataError />;
  }

  const onSelectPost = (postId: string) => {
    const nav = navigation as unknown as TeamDetailNavigationProp;
    nav.navigate('PostDetail', { postId, teamId: team.id });
  };

  const goToSchedule = () => {
    navigation.navigate('TeamSchedule', { teamId, schoolId: school.id });
  };

  const refreshPosts = () => {
    dispatch(fetchPosts({ teamId, schoolId: school?.id || 0 }));
  };

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
      schoolId: school?.id,
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

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollContainer}
            contentInset={{ bottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={postsLoading}
                onRefresh={refreshPosts}
              />
            }>
            {team.record ? (
              <Text>
                Overall Record:{' '}
                {`${team.record.win} - ${team.record.loss}${
                  team.record.tie ? `- ${team.record.tie}` : ''
                }`}
              </Text>
            ) : null}

            {team.photo_url ? (
              <View style={styles.imageContainer}>
                <View style={styles.imageLoadingContainer}>
                  <Text style={styles.imageLoadingText}>Image Loading...</Text>
                </View>
                <ImageModal
                  style={styles.image}
                  resizeMode="contain"
                  source={{
                    uri: team.photo_url,
                  }}
                />
              </View>
            ) : null}

            {team.home_description ? (
              <View style={styles.htmlContainer}>
                <RenderHtml
                  contentWidth={contentWidth}
                  source={{ html: team.home_description }}
                />
              </View>
            ) : null}
            {posts.length > 0 ? (
              <>
                <Text style={[styles.subHeader, styles.newsSubHeader]}>
                  Latest News
                </Text>
                <PostRow post={posts[0]} onPress={onSelectPost} />
              </>
            ) : null}

            {upcomingEvents.length > 0 ? (
              <>
                <Text style={[styles.subHeader, styles.newsSubHeader]}>
                  Next Event
                </Text>
                <EventRow event={upcomingEvents[0]} onPress={onSelectEvent} />
                <Button
                  onPress={goToSchedule}
                  textStyle={{
                    color: getColorByBackground(school.primary_color),
                  }}
                  style={{
                    backgroundColor: school.primary_color,
                    marginTop: 12,
                  }}>
                  View Full Schedule
                </Button>
              </>
            ) : null}
          </ScrollView>
        </View>
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
  contentContainer: {
    padding: 20,
    flex: 1,
    paddingBottom: 0,
  },
  scrollContainer: {
    flex: 1,
    marginHorizontal: -20,
    paddingHorizontal: 20,
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
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  divider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  overviewLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  overviewLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: 'white',
    overflow: 'hidden',
    fontSize: 12,
  },
  imageContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    aspectRatio: 1.75,
    width: '100%',
  },
  imageLoadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLoadingText: {
    fontWeight: '500',
  },
  htmlContainer: {
    marginBottom: 12,
  },
  newsSubHeader: {
    marginBottom: 8,
  },
});

export default TeamHome;
