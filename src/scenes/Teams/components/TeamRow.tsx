import { Team } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface TeamRowProps {
  team: Team;
  index: number;
  onPress: CallableFunction;
}

const TeamRow = ({ team, index, onPress }: TeamRowProps) => (
  <TouchableOpacity
    style={[styles.rowContainer, index > 0 ? styles.rowContainerBorder : {}]}
    onPress={() => onPress(team.id)}>
    <Text style={styles.name}>{team.name}</Text>
    <Text style={styles.gender}>{team.gender?.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  rowContainerBorder: {
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
  },
  name: {
    fontWeight: '500',
  },
  gender: {
    color: 'gray',
    fontSize: 12,
  },
});

export default TeamRow;
