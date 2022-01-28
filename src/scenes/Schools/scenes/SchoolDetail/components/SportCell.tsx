import { Sport } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { ColorValue, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SportIcons } from 'src/enums/sportIcons';
import { getColorByBackground } from 'src/utils/getColorByBackground';

interface SportCellProps {
  sport: Sport;
  backgroundColor?: ColorValue;
  onPress: CallableFunction;
}

const SportCell = ({
  sport,
  onPress,
  backgroundColor = '#000000',
}: SportCellProps) => {
  const name: keyof typeof SportIcons = sport.name;
  const icon = sport.name in SportIcons ? SportIcons[name] : null;
  const color = getColorByBackground(backgroundColor.toString());

  return (
    <View style={styles.cellContainer}>
      <TouchableOpacity
        style={[styles.cell, { backgroundColor }]}
        onPress={() => onPress(sport.id)}>
        {icon ? <FontAwesomeIcon icon={icon} color={color} size={40} /> : null}
        <Text style={[styles.name, { color }]}>{sport.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: '50%',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SportCell;
