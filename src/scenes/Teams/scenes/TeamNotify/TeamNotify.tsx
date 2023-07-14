import React, { useEffect, useState } from 'react';
import { Text, InvalidDataError, LoadingScreen, Button } from 'components';
import { Linking, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import {
  selectDeviceSubscriptionBySchoolId,
  selectDeviceSubscriptionByTeamId,
  selectDeviceToken,
} from 'services/deviceToken/selectors';
import { saveDeviceToken } from 'services/deviceToken/actions';
import { selectSchoolTeamsLoading } from 'store/selectors';
import qs from 'qs';
import config from 'src/config/config';

type TeamNotifyProps = NativeStackScreenProps<
  TeamsNavigatorParams,
  'TeamNotify'
>;

const TeamDonate = ({ route }: TeamNotifyProps) => {
  const { teamId } = route.params;
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const loading = useSelector(selectSchoolTeamsLoading);

  const deviceToken = useSelector(selectDeviceToken);
  const teamSubscription = useSelector(
    selectDeviceSubscriptionByTeamId(teamId),
  );
  const schoolSubscription = useSelector(
    selectDeviceSubscriptionBySchoolId(school?.id ?? 0),
  );
  const [deviceSubscribed, setDeviceSubscribed] = useState(
    !!teamSubscription || !!schoolSubscription,
  );

  useEffect(() => {
    setDeviceSubscribed(!!teamSubscription || !!schoolSubscription);
  }, [schoolSubscription, teamSubscription]);

  const dispatch = useDispatch();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!team || !school) {
    return <InvalidDataError />;
  }

  const subscribeToCalendar = async () => {
    Linking.openURL(
      `${config.baseUrl}/schools/${
        school.id
      }/upcoming_events.ics?${qs.stringify(
        {
          team_id: team.id,
        },
        { arrayFormat: 'brackets' },
      )}`,
    );
  };

  const onChangeDeviceSubscription = (flag: boolean) => {
    setDeviceSubscribed(flag);

    if (deviceToken) {
      if (flag) {
        dispatch(
          saveDeviceToken({
            device_token: deviceToken,
            device_subscriptions_attributes: [
              { subscribable_type: 'Team', subscribable_id: teamId },
            ],
          }),
        );
      } else {
        if (teamSubscription) {
          dispatch(
            saveDeviceToken({
              device_token: deviceToken,
              device_subscriptions_attributes: [
                { id: teamSubscription, _destroy: true },
              ],
            }),
          );
        }
      }
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
        <Text style={styles.header} numberOfLines={1}>
          {team.name}
        </Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.well}>
            <Text style={styles.subHeader}>Notifications</Text>
            <View style={styles.notificationsRow}>
              <Text style={styles.notificationRowText}>
                Subscribe to Push Notifications
              </Text>
              <Switch
                onValueChange={onChangeDeviceSubscription}
                style={styles.boxShadow}
                trackColor={{
                  true: school.primary_color,
                  false: school.primary_color,
                }}
                disabled={!!schoolSubscription}
                thumbColor={getColorByBackground(school.primary_color)}
                value={deviceSubscribed}
              />
            </View>
          </View>
          <View style={styles.well}>
            <Text style={styles.subHeader}>Calendar</Text>

            <Button
              onPress={subscribeToCalendar}
              textStyle={{
                color: getColorByBackground(school.primary_color),
              }}
              style={{
                backgroundColor: school.primary_color,
                marginTop: 12,
              }}>
              Subscribe to Team Calendar
            </Button>
          </View>
        </ScrollView>
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
    flex: 1,
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
    paddingHorizontal: 20,
  },
  subHeader: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
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
});

export default TeamDonate;
