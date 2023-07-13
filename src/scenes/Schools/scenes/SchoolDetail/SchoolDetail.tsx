import React, { useEffect, useState } from 'react';
import { Text, MenuBar, InvalidDataError, Button } from 'components';
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  ActivityIndicator,
  Switch,
  ScrollView,
  Alert,
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
import { formatAddress } from 'src/utils/formattedAddress';
import FastImage from 'react-native-fast-image';
import uniqBy from 'lodash/uniqBy';
import { Season } from 'teams/models/season';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import {
  selectDeviceSubscriptionBySchoolId,
  selectDeviceToken,
  selectTeamDeviceSubscriptions,
} from 'services/deviceToken/selectors';
import { saveDeviceToken } from 'services/deviceToken/actions';

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

  const deviceToken = useSelector(selectDeviceToken);
  const schoolSubscription = useSelector(
    selectDeviceSubscriptionBySchoolId(schoolId),
  );
  const [deviceSubscribed, setDeviceSubscribed] = useState(
    !!schoolSubscription,
  );

  const teamsLoading = useSelector(selectTeamsLoading);
  const teams = useSelector(selectTeams);
  const seasons = useSelector(selectSeasons);
  const school = useSelector(selectSchoolById(schoolId));
  const selectedTeams = teams.filter(
    (team) => team.season.id === selectedSeason?.id,
  );

  const subscribedTeamDevices = useSelector(selectTeamDeviceSubscriptions);
  const subscribedTeams = teams.filter((team) =>
    subscribedTeamDevices.find(
      (deviceSubscription) => deviceSubscription.subscribable_id === team.id,
    ),
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
    setDeviceSubscribed(!!schoolSubscription);
  }, [schoolSubscription]);

  useEffect(() => {
    if (!school) navigation.replace('SelectSchool');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school]);

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

  const onChangeDeviceSubscription = (flag: boolean) => {
    setDeviceSubscribed(flag);

    if (deviceToken) {
      if (flag) {
        dispatch(
          saveDeviceToken({
            device_token: deviceToken,
            device_subscriptions_attributes: [
              { subscribable_type: 'School', subscribable_id: schoolId },
            ],
          }),
        );
      } else {
        if (schoolSubscription) {
          dispatch(
            saveDeviceToken({
              device_token: deviceToken,
              device_subscriptions_attributes: [
                { id: schoolSubscription, _destroy: true },
              ],
            }),
          );
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: school.primary_color, flex: 1 }}
      edges={['top', 'left', 'right']}>
      <MenuBar
        backgroundColor={school.primary_color}
        color={getColorByBackground(school.primary_color)}
        navigation={navigation}
        title={`Go ${school.mascot}!`}
      />
      <ScrollView
        style={styles.container}
        contentInset={{ bottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={teamsLoading} onRefresh={getTeams} />
        }>
        <View style={styles.well}>
          <View style={styles.infoContainer}>
            <View style={styles.locationContainer}>
              {school.location ? (
                <Text style={styles.subHeader}>{school.location.name}</Text>
              ) : null}
              {school.location ? (
                <Text>{formatAddress(school.location, '\n')}</Text>
              ) : null}
              {school.phone ? (
                <Text onPress={() => Linking.openURL(`tel:${school.phone}`)}>
                  Phone: {school.phone}
                </Text>
              ) : null}
              {school.email ? (
                <Text
                  numberOfLines={1}
                  onPress={() => Linking.openURL(`mailto:${school.email}`)}>
                  Email: {school.email}
                </Text>
              ) : null}
            </View>

            <FastImage
              source={{ uri: school.logo_url }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={[styles.well, styles.notificationsContainer]}>
          <Text style={styles.subHeader}>Notifications</Text>
          <View style={styles.notificationsRow}>
            <Text style={styles.notificationRowText}>
              Subscribe to Push Notifications
            </Text>
            <Switch
              onValueChange={(value) => {
                if (value) {
                  Alert.alert(
                    `Subscribe to push notifications for all events?`,
                    'If you only want to receive push notifications for a single team, you can do so under Team > Notify',
                    [
                      {
                        text: 'No',
                        style: 'destructive',
                      },
                      {
                        text: 'Yes',
                        style: 'default',
                        onPress: () => onChangeDeviceSubscription(value),
                      },
                    ],
                  );
                } else {
                  onChangeDeviceSubscription(value);
                }
              }}
              style={styles.boxShadow}
              trackColor={{
                true: school.primary_color,
                false: school.primary_color,
              }}
              thumbColor={getColorByBackground(school.primary_color)}
              value={deviceSubscribed}
            />
          </View>
          {deviceSubscribed || subscribedTeams.length === 0 ? null : (
            <Text>
              <Text style={styles.alreadySubscribed}>
                Teams Subscribed:{'\n'}
              </Text>
              {subscribedTeams.map((team) => team.name).join('\n')}
            </Text>
          )}
        </View>

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
                              backgroundColor:
                                season.id === selectedSeason?.id
                                  ? school.secondary_color
                                  : school.primary_color,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.seasonText,
                              {
                                color:
                                  season.id === selectedSeason?.id
                                    ? getColorByBackground(
                                        school.secondary_color,
                                      )
                                    : getColorByBackground(
                                        school.primary_color,
                                      ),
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
  notificationsContainer: {
    padding: 20,
  },
  notificationsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationRowText: {
    fontWeight: 'bold',
  },
  alreadySubscribed: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default SchoolDetail;
