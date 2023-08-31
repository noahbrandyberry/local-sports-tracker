import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from './Button';

interface TutorialStepProps {
  name: string;
  text: string;
  position: Position;
}

interface Position {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export const TutorialStep = ({ name, text, position }: TutorialStepProps) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    readVisible();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readVisible = async () => {
    const storedValue = await AsyncStorage.getItem(`@hideTutorialStep${name}`);
    setHidden(JSON.parse(storedValue ?? 'false'));
  };

  const hide = async () => {
    await AsyncStorage.setItem(
      `@hideTutorialStep${name}`,
      JSON.stringify(true),
    );
    setHidden(true);
  };

  return (
    <Modal transparent visible={!hidden} animationType="fade">
      <View style={styles.backdrop} />
      <View
        style={[
          styles.tutorialStep,
          { top: position.top, bottom: position.bottom },
        ]}>
        <Text style={styles.tutorialText}>{text}</Text>

        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={hide}>
            Done
          </Button>
        </View>

        <View
          style={[styles.arrow, { left: position.left, right: position.right }]}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  tutorialStep: {
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 15,
    position: 'absolute',
    borderRadius: 5,
  },
  tutorialText: {
    fontSize: 16,
    marginBottom: 14,
  },
  arrow: {
    top: -10,
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
