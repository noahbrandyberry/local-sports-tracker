import { Text } from 'components';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import TeamRow from 'schools/scenes/SportDetail/components/TeamRow';
import { useTailwind } from 'tailwind-rn';
import { Team } from 'teams/models';
import { selectTeamsBySportId } from 'teams/services/selectors';
import { groupBy, map } from 'lodash';
import { useBookmarkedTeams } from 'src/hooks/useBookmarkedTeams';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SelectSchoolNavigatorParams } from '../SelectSchoolParams';
import RootStackParamList from 'src/RootStackParams';
import { getColorByBackground } from 'src/utils/getColorByBackground';

type TeamNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type TeamRouteProp = RouteProp<SelectSchoolNavigatorParams, 'Team'>;

export const TeamStep: React.FC<{
  route: TeamRouteProp;
  navigation: TeamNavigationProp;
}> = ({ route, navigation }) => {
  const { school, sport } = route.params;
  const tw = useTailwind();
  const sportTeams = useSelector(selectTeamsBySportId(sport.id));
  const { bookmarkTeam, bookmarkedTeams } = useBookmarkedTeams();

  const sectionsGroup = groupBy(sportTeams, (team) =>
    team.hide_gender ? team.sport.name : team.gender.name,
  );
  const sections: Array<{ title: string; data: Team[] }> = map(
    sectionsGroup,
    (teamsGroup, gender) => ({
      title: gender,
      data: teamsGroup,
    }),
  );

  const showSectionHeaders = true;

  const onSelectTeam = async (teamId: string) => {
    const team = sportTeams.find((t) => t.id === teamId);

    if (team) {
      await bookmarkTeam(teamId);
      navigation.navigate('Home');
    }
  };

  return (
    <ScrollView style={tw('flex-1')} contentContainerStyle={tw('p-5')}>
      {sections.map(({ title, data }) => (
        <View style={tw('bg-white rounded shadow mb-4')} key={title}>
          <View
            style={[
              tw('flex-row px-5 py-3 rounded-t'),
              { backgroundColor: school.primary_color },
            ]}>
            <Text
              style={[
                tw('text-lg font-bold'),
                { color: getColorByBackground(school.primary_color) },
              ]}>
              {title}
            </Text>
          </View>
          {data.map((item, index) => (
            <TeamRow
              key={item.id}
              bookmarked={bookmarkedTeams.some((t) => t.id === item.id)}
              team={{ ...item, hide_gender: true }}
              index={index}
              onPress={onSelectTeam}
              showSectionHeaders={showSectionHeaders}
              lastIndex={data.length - 1}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
