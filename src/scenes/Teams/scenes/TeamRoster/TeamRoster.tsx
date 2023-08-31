import React from 'react';
import { Text, InvalidDataError, LoadingScreen } from 'components';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectSchoolTeamsLoading } from 'store/selectors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import RootStackParamList from 'src/RootStackParams';

type TeamRostereNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TeamDetail'
>;

type TeamRosterRouteProp = RouteProp<TeamsNavigatorParams, 'TeamRoster'>;

const TeamRoster = ({
  route,
  navigation,
}: {
  route: TeamRosterRouteProp;
  navigation: TeamRostereNavigationProp;
}) => {
  const { teamId } = route.params;
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || ''));
  const loading = useSelector(selectSchoolTeamsLoading);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!team || !school) {
    return <InvalidDataError />;
  }
  const backgroundColor = school.primary_color;
  const color = getColorByBackground(school.primary_color);

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
            <Text style={styles.subHeader}>Roster</Text>
            {team.players.length > 0 ? (
              <View style={styles.rosterContainer}>
                {team.players.map((player) => (
                  <View style={styles.playerContainer} key={player.id}>
                    <TouchableOpacity
                      style={[styles.player, { backgroundColor }]}
                      onPress={() =>
                        navigation.navigate('PlayerDetail', {
                          schoolId: school.id,
                          teamId,
                          playerId: player.id,
                        })
                      }>
                      <View style={styles.spacer} />

                      <View style={styles.jerseyContainer}>
                        <FontAwesomeIcon
                          icon={['fas', 'tshirt']}
                          color={color}
                          size={72}
                        />
                        <Text
                          style={[
                            styles.playerNumber,
                            { color: backgroundColor },
                          ]}>
                          {player.jersey}
                        </Text>
                      </View>

                      <View style={styles.spacer} />

                      <Text style={[styles.playerName, { color }]}>
                        {player.first_name} {player.last_name}
                      </Text>

                      <View style={styles.spacer} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text>No results found.</Text>
            )}
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
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  subHeader: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
  rosterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  playerContainer: {
    width: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    aspectRatio: 1,
  },
  player: {
    alignItems: 'center',
    padding: 10,
    aspectRatio: 1,
    flex: 1,
    margin: 10,
  },
  playerYear: {
    fontSize: 14,
    textAlign: 'center',
  },
  playerName: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  jerseyContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNumber: {
    position: 'absolute',
    fontSize: 24,
    lineHeight: 32,
  },
  spacer: {
    flex: 1,
  },
});

export default TeamRoster;
