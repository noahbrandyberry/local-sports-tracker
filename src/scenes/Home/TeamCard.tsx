import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'components';
import { capitalize } from 'lodash';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { selectSchoolById } from 'schools/services/selectors';
import { SportIcons } from 'src/enums/sportIcons';
import RootStackParamList from 'src/RootStackParams';
import { Style, useTailwind } from 'tailwind-rn';
import { Event, Team } from 'teams/models';
import { fetchTeams } from 'teams/services/actions';

export const TeamCard: React.FC<{
  team: Team & { game?: Event };
  style?: Style;
}> = ({ team, style }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const school = useSelector(selectSchoolById(team.school_id));
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onSelectTeam = (teamId: string, schoolId: string) => {
    dispatch(fetchTeams({ schoolId: team.school_id }));
    navigation.navigate('TeamDetail', { teamId, schoolId });
  };

  const name: keyof typeof SportIcons | undefined = team.sport.name;
  const icon =
    team.sport.name && team.sport.name in SportIcons && name
      ? SportIcons[name]
      : null;
  return (
    <TouchableOpacity
      key={team.id}
      onPress={() => {
        onSelectTeam(team.id, team.school_id);
      }}
      style={[
        tw('px-4 py-3'),
        {
          borderBottomWidth: 1,
          borderColor: 'lightgray',
        },
        style,
      ]}>
      <View style={tw('flex-row items-center')}>
        {school && (
          <FastImage
            source={{ uri: school?.logo_url }}
            style={tw('w-6 h-6 mr-2')}
            resizeMode="contain"
          />
        )}
        <Text
          style={{
            fontWeight: '500',
            fontSize: 15,
            flex: 1,
          }}>
          {team.name}
        </Text>
        {icon ? <FontAwesomeIcon icon={icon} size={18} /> : null}
      </View>
      {team.game && (
        <View style={tw('flex-row mt-2 justify-between')}>
          {team.game.result ? (
            <>
              <Text style={tw('flex-1')} numberOfLines={1}>
                <Text style={tw('font-bold')}>
                  {capitalize(team.game.result_status)}
                </Text>{' '}
                (
                {team.game.home ? team.game.result.home : team.game.result.away}{' '}
                -{' '}
                {team.game.home ? team.game.result.away : team.game.result.home}
                ) {team.game.home ? 'vs ' : 'at '}
                {team.game.opponent_name}
              </Text>
              <Text style={tw('pl-4 font-medium')}>
                {team.game.start.calendar(null, {
                  lastDay: '[Yesterday]',
                  sameDay: '[Today]',
                  nextDay: '[Tomorrow]',
                  lastWeek: 'dddd',
                  sameElse: 'L',
                })}
              </Text>
            </>
          ) : (
            <>
              <Text>
                <Text style={tw('font-bold')}>
                  {team.game.start.format('h:mm a')}
                </Text>{' '}
                {team.game.home ? 'vs ' : 'at '}
                {team.game.opponent_name}
              </Text>
              <Text style={tw('pl-4 font-medium')}>
                {team.game.start.calendar(null, {
                  lastDay: '[Yesterday]',
                  sameDay: '[Today]',
                  nextDay: '[Tomorrow]',
                  lastWeek: 'dddd',
                  sameElse: 'L',
                })}
              </Text>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
