import React from 'react';
import { Text, InvalidDataError, Button, LoadingScreen } from 'components';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import {
  DefaultTheme,
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectPosts } from './services/selectors';
import PostRow from './components';
import RootStackParamList from 'src/RootStackParams';
import ImageModal from 'react-native-image-modal';
import RenderHtml from 'react-native-render-html';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { selectSchoolTeamsLoading } from 'store/selectors';
import { selectEvents } from '../TeamSchedule/services/selectors';
import EventRow from '../TeamSchedule/components/EventRow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TutorialStep } from 'src/components/TutorialStep';
import { useBookmarkedTeams } from 'src/hooks/useBookmarkedTeams';

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
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const { teamId } = route.params;
  const team = useSelector(selectTeamById(teamId));
  const schoolId = team?.school_id || '';
  const school = useSelector(selectSchoolById(schoolId));
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectSchoolTeamsLoading);
  const events = useSelector(selectEvents);
  const { bookmarkedTeams, storeBookmark } = useBookmarkedTeams(schoolId);
  const bookmarked = bookmarkedTeams.find(
    (bookmarkedTeam) => bookmarkedTeam.id === teamId,
  );

  const upcomingEvents = events.filter(
    (event) => !event.start.clone().add(2, 'hours').isBefore(),
  );

  const { width } = useWindowDimensions();
  const contentWidth = width - 40;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!team || !school) {
    return <InvalidDataError />;
  }

  const onSelectPost = (postId: string) => {
    navigate('PostDetail', { postId, teamId: team.id });
  };

  const goToSchedule = () => {
    navigation.navigate('TeamSchedule', { teamId, schoolId: school.id });
  };

  const onSelectEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event?.start.clone().add(2, 'hours').isBefore()) {
      const post = posts.find((p) => p.event_id === eventId);
      if (post) {
        return navigate('PostDetail', {
          postId: post.id,
          teamId: team.id,
        });
      }
    }

    navigate('EventDetail', {
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
        <View style={styles.headerContainer}>
          <Text style={styles.header} numberOfLines={1}>
            {team.name}
          </Text>
          <View style={styles.divider}>
            <TouchableOpacity
              onPress={() => storeBookmark(teamId, !bookmarked)}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
              <FontAwesomeIcon
                icon={[bookmarked ? 'fas' : 'far', 'bookmark']}
                color={school.primary_color}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollContainer}
            contentInset={{ bottom: 20 }}>
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

            {team.record ? (
              <Text style={{ marginBottom: 16 }}>
                Overall Record:{' '}
                {`${team.record.win} - ${team.record.loss}${
                  team.record.tie ? ` - ${team.record.tie}` : ''
                }`}
              </Text>
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
            ) : (
              <Text style={styles.center}>No Upcoming Events</Text>
            )}
          </ScrollView>
        </View>
      </View>
      <TutorialStep
        name="Bookmark"
        text="You can bookmark the teams you want to follow. They will show up on your home screen and you will receive relevant notifications."
        position={{ right: 10, top: 140 }}
      />
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
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
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
    marginBottom: 20,
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
  center: {
    textAlign: 'center',
  },
});

export default TeamHome;
