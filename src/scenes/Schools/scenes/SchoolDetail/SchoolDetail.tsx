import React, { useEffect, useState } from 'react';
import { Text, MenuBar, InvalidDataError, Button } from 'components';
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectSchoolById } from 'schools/services/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTeams, resetTeams } from 'teams/services/actions';
import {
  selectCurrentSeason,
  selectTeams,
  selectSeasons,
  selectTeamsLoading,
} from 'teams/services/selectors';
import SportCell from './components/SportCell';
import uniqBy from 'lodash/uniqBy';
import { Season } from 'teams/models/season';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import { useBookmarkedTeams } from 'src/hooks/useBookmarkedTeams';
import { useQuery } from 'src/hooks/useQuery';
import { Event } from 'teams/models';
import capitalize from 'lodash/capitalize';
import { SportIcons } from 'src/enums/sportIcons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Carousel from 'react-native-snap-carousel';
import { transformEvents } from 'teams/scenes/TeamSchedule/services/transform';
import { fetchEvents } from 'teams/scenes/TeamSchedule/services/actions';

type SchoolDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'SchoolDetail'
>;

const SchoolDetail = ({ route, navigation }: SchoolDetailProps) => {
  const { schoolId } = route.params;
  const dispatch = useDispatch();

  const getTeams = () => {
    dispatch(fetchTeams({ schoolId }));
  };

  const storeDefaultSchool = async () => {
    try {
      const defaultSchool = await AsyncStorage.getItem('@defaultSchool');

      if (!defaultSchool)
        await AsyncStorage.setItem('@defaultSchool', schoolId.toString());
    } catch (error) {
      // Error saving data
    }
  };

  useEffect(() => {
    dispatch(resetTeams());
    getTeams();
    storeDefaultSchool();
    setSelectedSeason(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const currentSeason = useSelector(selectCurrentSeason);
  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(
    undefined,
  );

  const teamsLoading = useSelector(selectTeamsLoading);
  const teams = useSelector(selectTeams);
  const seasons = useSelector(selectSeasons);
  const school = useSelector(selectSchoolById(schoolId));
  const { bookmarkedTeams } = useBookmarkedTeams(schoolId);
  const bookmarkedTeamIds = bookmarkedTeams.map((team) => team.id);

  const recentEvents = useQuery<Event[]>({
    url: `schools/${schoolId}/recent_results.json`,
    params: { team_id: bookmarkedTeamIds },
    transform: transformEvents,
    queryKey: [schoolId, 'recent_results', bookmarkedTeamIds],
    enabled: bookmarkedTeamIds.length > 0,
  });
  const showRecentEvents = !recentEvents.isLoading && recentEvents.data?.length;

  const selectedTeams = teams.filter(
    (team) => team.season.id === selectedSeason?.id,
  );

  const sports = uniqBy(
    selectedTeams.map((team) => team.sport),
    'name',
  );

  useEffect(() => {
    if (!selectedSeason) setSelectedSeason(currentSeason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeason]);

  useEffect(() => {
    if (!school) navigation.replace('SelectSchool');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school]);

  const onSelectTeam = (teamId: string) => {
    navigation.navigate('TeamDetail', { teamId, schoolId });
  };

  if (!school) {
    return <InvalidDataError />;
  }

  const seasonName = selectedSeason ? selectedSeason.name : school.name;

  const onSelectSport = (sportId: number) => {
    navigation.navigate('SportDetail', { sportId, schoolId });
  };

  const goToUpcomingEvents = () => {
    navigation.navigate('UpcomingEvents', { schoolId });
  };

  let title = school.name.replace(' High School', '');
  if (title.length < 20) {
    title += ` ${school.mascot}`;
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: school.primary_color, flex: 1 }}
      edges={['top', 'left', 'right']}>
      <MenuBar
        backgroundColor={school.primary_color}
        color={getColorByBackground(school.primary_color)}
        navigation={navigation}
        title={title}
        imageUrl={school.logo_url}
      />
      <ScrollView
        style={styles.container}
        contentInset={{ bottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={teamsLoading} onRefresh={getTeams} />
        }>
        {bookmarkedTeams.length > 0 ? (
          <View style={[styles.well]}>
            {bookmarkedTeams.map((team, index) => {
              const name: keyof typeof SportIcons | undefined =
                team?.sport.name;
              const icon =
                team?.sport.name && team?.sport.name in SportIcons && name
                  ? SportIcons[name]
                  : null;
              return (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => onSelectTeam(team.id)}
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 20,
                      borderColor: 'lightgray',
                    },
                    index === 0
                      ? {}
                      : {
                          borderTopWidth: 1,
                        },
                  ]}>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 15,
                    }}>
                    {team.name}
                  </Text>
                  {icon ? <FontAwesomeIcon icon={icon} size={18} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {bookmarkedTeams.length > 0 ? (
          <Button
            onPress={goToUpcomingEvents}
            textStyle={{
              color: getColorByBackground(school.primary_color),
            }}
            style={{
              backgroundColor: school.primary_color,
              marginBottom: 24,
            }}>
            View Schedule
          </Button>
        ) : (
          <Text style={styles.header}>Select a Sport Below</Text>
        )}

        <View style={styles.sportsContainer}>
          <View style={styles.well}>
            {teamsLoading && sports.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} />
              </View>
            ) : (
              <View style={styles.sportsPadding}>
                {sports.length > 0 ? (
                  <View>
                    <View style={styles.sportsHeaderContainer}>
                      {seasons.map((season) => (
                        <TouchableOpacity
                          key={season.id}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          onPress={() => setSelectedSeason(season)}
                          style={[
                            styles.seasonButton,
                            {
                              borderWidth: 1,
                              borderColor: school.primary_color,
                              backgroundColor:
                                season.id === selectedSeason?.id
                                  ? school.primary_color
                                  : getColorByBackground(school.primary_color),
                            },
                          ]}>
                          <Text
                            style={[
                              styles.seasonText,
                              {
                                color:
                                  season.id === selectedSeason?.id
                                    ? getColorByBackground(school.primary_color)
                                    : school.primary_color,
                              },
                            ]}>
                            {season.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.sportsContentContainer}>
                      {sports.map((sport) => (
                        <SportCell
                          key={sport.id.toString()}
                          sport={sport}
                          backgroundColor={school.primary_color}
                          onPress={onSelectSport}
                        />
                      ))}
                    </View>
                  </View>
                ) : (
                  <Text style={styles.noSportsFound}>
                    No {seasonName} sports found.
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      {showRecentEvents ? (
        <SafeAreaView
          edges={['bottom']}
          style={styles.recentEventsBarContainer}>
          <View style={styles.recentEventsBar}>
            {recentEvents.data && (
              <Carousel
                sliderWidth={Dimensions.get('screen').width}
                itemWidth={Dimensions.get('screen').width}
                windowSize={21}
                data={recentEvents.data}
                autoplay
                loop
                renderItem={({
                  item: {
                    selected_team_id,
                    result,
                    result_status,
                    opponent_name,
                    id,
                    home,
                    start,
                  },
                }) => {
                  const team = teams.find((t) => t.id === selected_team_id);
                  const name: keyof typeof SportIcons | undefined =
                    team?.sport.name;
                  const icon =
                    team?.sport.name && team?.sport.name in SportIcons && name
                      ? SportIcons[name]
                      : null;

                  if (!team || !result) {
                    return null;
                  }

                  return (
                    <View style={styles.recentEvent} key={id}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate({
                            name: 'TeamDetail',
                            params: {
                              teamId: team.id,
                              schoolId,
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
                      <TouchableOpacity
                        style={styles.result}
                        onPress={() => {
                          const teamId = selected_team_id;
                          dispatch(fetchEvents({ teamId, schoolId }));
                          navigation.navigate('EventDetail', {
                            teamId,
                            eventId: id,
                            schoolId,
                          });
                        }}>
                        <Text style={styles.winText}>
                          <Text style={styles.boldText}>
                            {capitalize(result_status)}
                          </Text>{' '}
                          {home ? 'vs ' : 'at '}
                          {opponent_name} ({home ? result.home : result.away} -{' '}
                          {home ? result.away : result.home})
                        </Text>
                        <Text style={styles.dayText}>
                          {start.calendar(null, {
                            lastDay: '[Yesterday]',
                            sameDay: '[Today]',
                            nextDay: '[Tomorrow]',
                            lastWeek: 'dddd',
                            sameElse: 'L',
                          })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
    position: 'relative',
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  locationContainer: {
    flex: 1,
  },
  noSportsFound: {
    paddingTop: 22,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    minHeight: 50,
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  subHeader: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
  sportsContainer: {
    flex: 1,
  },
  sportsContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  sportsPadding: {
    paddingBottom: 10,
    minHeight: 60,
  },
  sportsHeaderContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seasonButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  seasonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 12,
  },
  bookmarkedContainer: {
    padding: 20,
  },
  alreadySubscribed: {
    fontSize: 15,
    fontWeight: '500',
  },
  socialRow: {
    marginTop: 20,
    flexDirection: 'row',
    marginHorizontal: -10,
  },
  socialIconContainer: {
    paddingHorizontal: 8,
  },
  recentEventsBarContainer: {
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      height: 0,
      width: -3,
    },
    elevation: 10,
  },
  recentEventsBar: {
    flexDirection: 'row',
  },
  recentEvent: {
    width: '100%',
  },
  winText: {},
  boldText: {
    fontWeight: 'bold',
  },
  result: {
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    paddingLeft: 15,
    fontWeight: '500',
  },
});

export default SchoolDetail;
