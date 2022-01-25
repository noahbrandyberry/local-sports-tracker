import React from 'react';
import { Text, InvalidDataError } from 'components';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectTeamById } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';
import { selectPosts } from './services/selectors';
import PostRow from './components';
import RootStackParamList from 'src/RootStackParams';

type TeamHomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TeamDetail'
>;

type TeamHomeRouteProp = RouteProp<TeamsNavigatorParams, 'TeamHome'>;

const TeamHome = ({
  route,
  navigation,
}: {
  route: TeamHomeRouteProp;
  navigation: TeamHomeNavigationProp;
}) => {
  const { teamId } = route.params;
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id || 0));
  const posts = useSelector(selectPosts);

  if (!team || !school) {
    return <InvalidDataError />;
  }

  const onSelectPost = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.modalDragBar} />
        <Text style={styles.header}>{team.name}</Text>
        <View style={styles.contentContainer}>
          <View style={styles.well}>
            <Text style={styles.subHeader}>Overview</Text>

            <Text>
              Overall Record:{' '}
              {team.record ? `${team.record.win} - ${team.record.win}` : null}
            </Text>
            <View style={styles.overviewLabels}>
              <Text
                style={[
                  styles.overviewLabel,
                  { backgroundColor: school.primary_color },
                ]}>
                {team.sport.name}
              </Text>
              {team.level ? (
                <Text
                  style={[
                    styles.overviewLabel,
                    { backgroundColor: school.primary_color },
                  ]}>
                  {team.level.name}
                </Text>
              ) : null}
              <Text
                style={[
                  styles.overviewLabel,
                  { backgroundColor: school.primary_color },
                ]}>
                {team.gender.name}
              </Text>
              <Text
                style={[
                  styles.overviewLabel,
                  { backgroundColor: school.primary_color },
                ]}>
                {team.season.name}
              </Text>
            </View>
          </View>

          <Text style={styles.subHeader}>Latest News</Text>
          <FlatList
            keyExtractor={(item) => item.id}
            style={styles.scrollContainer}
            data={posts}
            contentInset={{ bottom: 20 }}
            renderItem={({ item }) => (
              <PostRow post={item} onPress={onSelectPost} />
            )}
          />
        </View>
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
  contentContainer: {
    padding: 20,
    flex: 1,
    paddingBottom: 0,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 8,
    marginHorizontal: -20,
    paddingHorizontal: 20,
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
  overviewLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  overviewLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: 'white',
    overflow: 'hidden',
    fontSize: 12,
  },
});

export default TeamHome;
