import { Event } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface EventRowProps {
  event: Event;
  index: number;
  onPress: CallableFunction;
}

const EventRow = ({ event, index, onPress }: EventRowProps) => {
  const name = event.name ?? '';

  return (
    <TouchableOpacity
      style={[styles.rowContainer, index > 0 ? styles.rowContainerBorder : {}]}
      onPress={() => onPress(event.id)}>
      <View style={styles.nameContainer}>
        <Text>{event.location.name}</Text>
        <Text>{event.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    padding: 20,
  },
  rowContainerBorder: {
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EventRow;
