import React from 'react';
import { Text, InvalidDataError } from 'components';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Player } from 'teams/models';
import startCase from 'lodash/startCase';
import Qty from 'js-quantities';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { selectSchoolById } from 'schools/services/selectors';
import { getColorByBackground } from 'src/utils/getColorByBackground';

interface PlayerAttributeProps {
  player: Player;
  attribute: keyof Player;
}

const feetAndInches = (scalar: number) => {
  const feet = Math.floor(scalar / 12);
  const inches = Math.floor(scalar % 12);

  if (feet > 0) {
    if (inches > 0) {
      return `${feet} ft, ${inches} in`;
    } else {
      return `${feet} ft`;
    }
  } else {
    return '';
  }
};

const PlayerAttribute = ({ player, attribute }: PlayerAttributeProps) => {
  const attributeName = startCase(attribute);
  let value = player[attribute];

  if (value) {
    switch (attribute) {
      case 'weight':
        value += ' lbs';
        break;
      case 'height':
        const quantity = new Qty(Number(value), 'in');
        value = quantity.format(feetAndInches);
        break;
    }
  }

  if (value) {
    return (
      <>
        <Text style={styles.subHeader}>{attributeName}</Text>
        <Text style={styles.attribute} selectable>
          {value}
        </Text>
      </>
    );
  }

  return null;
};

type PlayerDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'PlayerDetail'
>;

const PlayerDetail = ({ route }: PlayerDetailProps) => {
  const { schoolId, teamId, playerId } = route.params;

  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(schoolId));
  const player = team?.players.find((p) => p.id === playerId);

  if (!school || !team || !player) {
    return <InvalidDataError />;
  }

  const color = getColorByBackground(school.primary_color);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentInset={{ bottom: 32 }}>
        <View style={styles.modalDragBar} />

        <Text style={styles.header}>
          {player.first_name} {player.last_name}
        </Text>

        <View style={styles.well}>
          <View style={styles.row}>
            <View style={styles.column}>
              <PlayerAttribute player={player} attribute="position" />
              <PlayerAttribute player={player} attribute="height" />
              <PlayerAttribute player={player} attribute="weight" />
              <PlayerAttribute player={player} attribute="grad_year" />
            </View>
            <View>
              <View style={styles.jerseyContainer}>
                <FontAwesomeIcon
                  icon={['fas', 'tshirt']}
                  color={school?.primary_color}
                  size={112}
                />
                <Text style={[styles.playerNumber, { color }]}>
                  {player.jersey}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
    padding: 20,
  },
  modalDragBar: {
    marginBottom: 20,
    alignSelf: 'center',
    width: 36,
    backgroundColor: 'gray',
    height: 5,
    borderRadius: 3,
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
    paddingBottom: 0,
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
  attribute: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  jerseyContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerNumber: {
    position: 'absolute',
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    paddingRight: 12,
  },
});

export default PlayerDetail;
