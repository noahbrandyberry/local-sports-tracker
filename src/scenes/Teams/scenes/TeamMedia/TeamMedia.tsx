import React from 'react';
import { Text, InvalidDataError, LoadingScreen } from 'components';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectSchoolTeamsLoading } from 'store/selectors';
import ImageModal from 'react-native-image-modal';

type TeamMediaProps = NativeStackScreenProps<TeamsNavigatorParams, 'TeamMedia'>;

const TeamMedia = ({ route }: TeamMediaProps) => {
  const { teamId } = route.params;
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const loading = useSelector(selectSchoolTeamsLoading);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!team || !school) {
    return <InvalidDataError />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.modalDragBar} />
        <Text style={styles.header}>{team.name}</Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.well}>
            <Text style={styles.subHeader}>Media</Text>

            {team.images?.length ? (
              <View style={styles.imagesRow}>
                {team.images.map((image) => (
                  <View style={styles.imageContainer} key={image.id}>
                    <ImageModal
                      style={styles.image}
                      modalImageResizeMode={'contain'}
                      source={{
                        uri: image.url,
                      }}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text>No results found.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
  },
  modalDragBar: {
    marginBottom: 20,
    alignSelf: 'center',
    width: 36,
    backgroundColor: 'gray',
    height: 5,
    borderRadius: 3,
  },
  scrollContainer: {
    padding: 20,
    flex: 1,
  },
  well: {
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
    marginBottom: 24,
    padding: 20,
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subHeader: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  imageContainer: {
    width: '50%',
    padding: 10,
  },
  image: {
    aspectRatio: 1,
    width: '100%',
  },
});

export default TeamMedia;
