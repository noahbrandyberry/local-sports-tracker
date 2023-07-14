import { Team } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface TeamRowProps {
  team: Team;
  index: number;
  lastIndex: number;
  showSectionHeaders: boolean;
  onPress: CallableFunction;
}

const TeamRow = ({
  team,
  index,
  lastIndex,
  showSectionHeaders,
  onPress,
}: TeamRowProps) => {
  const nameComponents: string[] = [];
  nameComponents.push(team.sport.name);
  if (team.level?.name) {
    nameComponents.push(`(${team.level.name})`);
  }
  if (team.label) {
    nameComponents.push(team.label);
  }
  const name = nameComponents.join(' ');

  return (
    <TouchableOpacity
      style={[
        styles.rowContainer,
        index === 0 && !showSectionHeaders ? styles.firstRow : {},
        index < lastIndex ? styles.rowContainerBorder : styles.lastRow,
      ]}
      onPress={() => onPress(team.id)}>
      <Text style={styles.name}>{name}</Text>
      {!team.hide_gender && team.gender ? (
        <Text style={styles.gender}>{team.gender.name}</Text>
      ) : null}
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
  firstRow: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  lastRow: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default TeamRow;
