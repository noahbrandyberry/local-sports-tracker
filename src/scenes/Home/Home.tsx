import { DefaultTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, TextField } from 'components';
import { flatMap, orderBy } from 'lodash';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookmarkedTeams } from 'src/hooks/useBookmarkedTeams';
import { useQuery } from 'src/hooks/useQuery';
import RootStackParamList from 'src/RootStackParams';
import { Event } from 'teams/models';
import { transformEvents } from 'teams/scenes/TeamSchedule/services/transform';
import { TeamCard } from './TeamCard';
import { useTailwind } from 'tailwind-rn';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { selectSchools } from 'schools/services/selectors';
import { getIntermediateColor } from 'src/utils/getIntermediateColor';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import { fetchTeams } from 'teams/services/actions';

type SchoolDetailProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const Home = ({ navigation }: SchoolDetailProps) => {
  const [searchText, setSearchText] = useState('');
  const { bookmarkedTeams, bookmarksLoading } = useBookmarkedTeams();
  const tw = useTailwind();
  const dispatch = useDispatch();
  const bookmarkedTeamIds = bookmarkedTeams.map((team) => team.id);
  const allSchools = useSelector(selectSchools);
  const schoolColors = bookmarkedTeams
    .map((t) => allSchools.find((s) => s.id === t.school_id)?.primary_color)
    .filter((c): c is string => !!c);
  const backgroundColor = getIntermediateColor(...schoolColors);
  const color = getColorByBackground(backgroundColor);

  const { data: recentEvents } = useQuery<Event[]>({
    url: `recent_results.json`,
    params: { team_id: bookmarkedTeamIds },
    transform: transformEvents,
    queryKey: ['recent_results', bookmarkedTeamIds],
    enabled: bookmarkedTeamIds.length > 0,
  });

  const { data: liveGames } = useQuery<Event[]>({
    url: `live_games.json`,
    params: { team_id: bookmarkedTeamIds },
    transform: transformEvents,
    queryKey: ['live_games', bookmarkedTeamIds],
    enabled: bookmarkedTeamIds.length > 0,
  });

  const allPlayers = flatMap(bookmarkedTeams, (team) =>
    team.players.map((player) => ({
      ...player,
      team_id: team.id,
      school_id: team.school_id,
    })),
  );

  const filteredPlayers = allPlayers.filter(
    (p) =>
      p.jersey === searchText ||
      p.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const teams = orderBy(
    bookmarkedTeams.map((t) => ({
      ...t,
      game:
        liveGames?.find((e) => t.id === e.selected_team_id) ??
        recentEvents?.find((e) => t.id === e.selected_team_id),
    })),
    ({ game }) => game?.start,
    'desc',
  );

  const goToUpcomingEvents = () => {
    navigation.navigate('UpcomingEvents');
  };

  if (bookmarksLoading) {
    return (
      <View style={tw('flex-1 justify-center items-center')}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw('flex-1')} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={tw('flex-1')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
        {teams.length === 0 ? (
          <View style={tw('p-5 items-center flex-1 justify-around')}>
            <FastImage
              source={require('../../../assets/images/Logo.png')}
              style={tw('h-48 w-48 rounded-lg')}
            />

            <View>
              <Text style={tw('text-center mb-4 text-xl font-bold')}>
                Welcome to School Sports Tracker
              </Text>
              <Text style={tw('text-center text-lg')}>
                Click the button below to select the teams you would like to
                follow!
              </Text>
            </View>

            <Button
              onPress={() => navigation.navigate('SelectSchool')}
              style={tw('w-full flex-row justify-center')}>
              Get Started
            </Button>
          </View>
        ) : (
          <ScrollView
            style={tw('flex-1')}
            contentContainerStyle={[
              { backgroundColor: DefaultTheme.colors.background },
              tw('p-5'),
            ]}>
            <View style={tw('flex-row items-center justify-center')}>
              <FastImage
                source={require('../../../assets/images/Logo.png')}
                style={tw('h-8 w-8 rounded mr-3')}
              />

              <Text style={tw('text-center text-xl font-bold')}>
                School Sports Tracker
              </Text>
            </View>
            <View style={tw('bg-white rounded shadow my-4')}>
              <View
                style={[
                  { backgroundColor },
                  tw('flex-row items-center px-4 py-3 rounded-t'),
                ]}>
                <Text style={[tw('text-xl font-bold flex-1'), { color }]}>
                  Bookmarked Teams
                </Text>

                <Button
                  onPress={() => navigation.navigate('SelectSchool')}
                  style={tw('px-2 py-1.5')}
                  textStyle={tw('text-xs font-bold uppercase')}
                  rightAccessory={
                    <FontAwesomeIcon
                      icon="plus"
                      color="white"
                      size={10}
                      style={tw('ml-2')}
                    />
                  }>
                  Add Team
                </Button>
              </View>
              {teams.map((team, index) => (
                <TeamCard
                  team={team}
                  style={
                    index === teams.length - 1 ? tw('border-b-0') : undefined
                  }
                  key={team.id}
                />
              ))}
            </View>

            <Button
              onPress={goToUpcomingEvents}
              style={[tw('justify-center mb-4'), { backgroundColor }]}
              textStyle={[tw('font-bold'), { color }]}>
              View Full Schedule
            </Button>

            <TextField
              icon="search"
              placeholder="Search for players (by name or jersey)"
              onChangeText={setSearchText}
              value={searchText}
              blurOnSubmit
              onSubmitEditing={() => {
                const player = filteredPlayers[0];
                if (player) {
                  navigation.navigate('PlayerDetail', {
                    schoolId: player.school_id,
                    teamId: player.team_id,
                    playerId: player.id,
                  });
                }
              }}
            />

            {searchText ? (
              <View style={tw('bg-white rounded shadow my-4')}>
                {filteredPlayers.map((player, index) => {
                  const school = allSchools.find(
                    (s) => s.id === player.school_id,
                  );
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(fetchTeams({ schoolId: player.school_id }));

                        navigation.navigate('PlayerDetail', {
                          playerId: player.id,
                          schoolId: player.school_id,
                          teamId: player.team_id,
                        });
                      }}
                      key={player.id}
                      style={[
                        index === 0 && tw('bg-gray-100'),
                        tw(
                          'flex-row items-center py-2 px-3 border-b border-b-gray-300',
                        ),
                      ]}>
                      <View
                        style={tw('relative items-center justify-center mr-2')}>
                        <FontAwesomeIcon
                          icon={['fas', 'tshirt']}
                          color={school?.primary_color}
                          size={42}
                        />
                        <Text
                          style={[tw('absolute font-bold text-sm'), { color }]}>
                          {player.jersey}
                        </Text>
                      </View>

                      <View style={tw('flex-1')}>
                        <Text style={tw('font-medium')}>
                          {player.first_name} {player.last_name}
                        </Text>
                        <Text style={tw('text-gray-600')}>
                          {player.grad_year}
                        </Text>
                      </View>

                      {school && (
                        <FastImage
                          source={{ uri: school?.logo_url }}
                          style={tw('w-6 h-6 mr-2')}
                          resizeMode="contain"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
