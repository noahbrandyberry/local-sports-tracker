import { BoxScore as BoxScoreType } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, View } from 'react-native';

interface BoxScoreProps {
  boxscore: BoxScoreType;
}

export const BoxScore = ({ boxscore }: BoxScoreProps) => {
  if (!boxscore || boxscore.headers.length === 0) return null;

  return (
    <View style={styles.boxScoreContainer}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={[styles.headerCell, styles.cell]}>Team</Text>
          {boxscore.results.map((result, index) => (
            <Text key={index} style={styles.cell}>
              {result.team_name}
            </Text>
          ))}
        </View>
        {boxscore.headers.map((header, index) => (
          <View key={header} style={styles.column}>
            <Text style={[styles.headerCell, styles.cell]}>{header}</Text>
            {boxscore.results.map((result, resultIndex) => (
              <Text key={resultIndex} style={styles.cell}>
                {result.scores[index]}
              </Text>
            ))}
          </View>
        ))}
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
