import { Team } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectSchoolById } from '../../../../Schools/services/selectors';

interface OpponentRowProps {
  index: number;
  opponent: Team;
  onPress: CallableFunction;
}

const OpponentRow = ({ index, opponent, onPress }: OpponentRowProps) => {
  const opponentSchool = useSelector(selectSchoolById(opponent?.school_id));

  return (
    <TouchableOpacity
      style={[styles.rowContainer, index > 0 ? styles.rowContainerBorder : {}]}
      onPress={() => onPress(opponent?.school_id)}>
      <Text style={styles.opponentsText}>{opponentSchool?.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  rowContainerBorder: {
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
  },
  opponentsText: {
    fontWeight: '500',
  },
});

export default OpponentRow;
