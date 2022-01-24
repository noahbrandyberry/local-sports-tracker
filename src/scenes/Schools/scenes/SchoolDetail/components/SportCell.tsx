import { Sport } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { ColorValue, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SportIcons } from 'src/enums/sportIcons';

interface SportCellProps {
  sport: Sport;
  backgroundColor?: ColorValue;
  onPress: CallableFunction;
}

const SportCell = ({
  sport,
  onPress,
  backgroundColor = 'black',
}: SportCellProps) => {
  const name: keyof typeof SportIcons = sport.name;
  const icon = sport.name in SportIcons ? SportIcons[name] : null;

  return (
    <View style={styles.cellContainer}>
      <TouchableOpacity
        style={[styles.cell, { backgroundColor }]}
        onPress={() => onPress(sport.id)}>
        {icon ? <FontAwesomeIcon icon={icon} color="white" size={40} /> : null}
        <Text style={styles.name}>{sport.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: '50%',
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    aspectRatio: 1,
    flex: 1,
    margin: 10,
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SportCell;
