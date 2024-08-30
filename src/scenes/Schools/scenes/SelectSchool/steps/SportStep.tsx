import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'components';
import uniqBy from 'lodash/uniqBy';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import SportCell from 'schools/scenes/SchoolDetail/components/SportCell';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import { useTailwind } from 'tailwind-rn';
import { Season } from 'teams/models';
import {
  selectCurrentSeason,
  selectSeasons,
  selectTeams,
  selectTeamsLoading,
} from 'teams/services/selectors';
import { SelectSchoolNavigatorParams } from '../SelectSchoolParams';
import { RouteProp } from '@react-navigation/native';

type SportNavigationProp = NativeStackNavigationProp<
  SelectSchoolNavigatorParams,
  'Sport'
>;

type SportRouteProp = RouteProp<SelectSchoolNavigatorParams, 'Sport'>;

export const SportStep: React.FC<{
  route: SportRouteProp;
  navigation: SportNavigationProp;
}> = ({ route, navigation }) => {
  const { school } = route.params;
  const tw = useTailwind();
  const teams = useSelector(selectTeams);
  const teamsLoading = useSelector(selectTeamsLoading);
  const seasons = useSelector(selectSeasons);

  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(
    undefined,
  );
  const currentSeason = useSelector(selectCurrentSeason);
  const seasonName = selectedSeason ? selectedSeason.name : school.name;

  useEffect(() => {
    if (!selectedSeason) setSelectedSeason(currentSeason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeason]);

  const selectedTeams = teams.filter(
    (team) => team.season.id === selectedSeason?.id,
  );

  const sports = uniqBy(
    selectedTeams.map((team) => team.sport),
    'name',
  );

  const onSelectSport = (id: number) => {
    const sport = sports.find((s) => s.id === id);
    if (sport) {
      navigation.navigate('Team', { school, sport });
    }
  };

  return (
    <View style={tw('flex-1')}>
      <View style={tw('flex-1 px-2.5 py-5')}>
        {teamsLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <>
            {sports.length > 0 ? (
              <View style={tw('flex-1')}>
                {seasons.length > 1 && (
                  <View style={tw('flex-row px-2.5 justify-between')}>
                    {seasons.map((season) => (
                      <TouchableOpacity
                        key={season.id}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() => setSelectedSeason(season)}
                        style={[
                          tw('px-2 py-1 rounded'),
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
                )}
                <View style={tw('flex-row flex-wrap justify-center pt-3')}>
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
              <Text>No {seasonName} sports found.</Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};
