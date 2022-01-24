import { Team } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface TeamRowProps {
  team: Team;
  index: number;
  lastIndex: number;
  onPress: CallableFunction;
}

const TeamRow = ({ team, index, lastIndex, onPress }: TeamRowProps) => {
  const name = `${team.sport.name} (${team.level?.name})`;

  return (
    <TouchableOpacity
      style={[
        styles.rowContainer,
        index < lastIndex ? styles.rowContainerBorder : styles.lastRow,
      ]}
      onPress={() => onPress(team.id)}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.gender}>{team.gender.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  rowContainerBorder: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  name: {
    fontWeight: '500',
  },
  gender: {
    color: 'gray',
    fontSize: 12,
  },
  lastRow: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default TeamRow;
