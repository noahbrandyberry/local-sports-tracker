import { TeamResult } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { selectSchools } from 'schools/services/selectors';
import { ordinalize } from '../../../../../utils/ordinalize';

interface TeamResultsProps {
  teamResults: TeamResult[];
}

export const TeamResults = ({ teamResults }: TeamResultsProps) => {
  const schools = useSelector(selectSchools);

  if (teamResults.length === 0) return null;

  return (
    <View style={styles.boxScoreContainer}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={[styles.headerCell, styles.cell]}>Team</Text>
          {teamResults.map((result, index) => {
            const school = schools.find((s) => s.id === result.school_id);
            return (
              <Text key={index} style={styles.cell}>
                {school ? school.name : result.name}
              </Text>
            );
          })}
        </View>

        <View style={styles.column}>
          <Text style={[styles.headerCell, styles.cell]}>Place</Text>
          {teamResults.map((result, index) => (
            <Text key={index} style={styles.cell}>
              {ordinalize(result.place)}
            </Text>
          ))}
        </View>

        {teamResults.some((result) => result.points) ? (
          <View style={styles.column}>
            <Text style={[styles.headerCell, styles.cell]}>Points</Text>
            {teamResults.map((result, index) => (
              <Text key={index} style={styles.cell}>
                {result.points}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxScoreContainer: {
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
    marginBottom: 12,
    padding: 15,
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCell: {
    fontWeight: '500',
  },
  column: {},
  cell: {
    marginBottom: 10,
    flex: 1,
  },
});
