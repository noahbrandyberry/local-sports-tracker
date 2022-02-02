import React from 'react';
import { Text, InvalidDataError } from 'components';
import { ScrollView, StyleSheet, View } from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectPostById } from '../TeamHome/services/selectors';
import {
  BoxScore as BoxScoreType,
  Recap as RecapType,
} from '../../models/post';
import { BoxScore, Result, TeamResults } from './components';
import { selectEventById } from '../TeamSchedule/services/selectors';
import { selectTeamById } from '../../services/selectors';
import ImageModal from 'react-native-image-modal';
import isEmpty from 'lodash/isEmpty';
import { selectSchoolById } from '../../../Schools/services/selectors';

type PostDetailProps = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const SportDetail = ({ route, navigation }: PostDetailProps) => {
  const { postId, teamId } = route.params;

  const post = useSelector(selectPostById(postId));
  const team = useSelector(selectTeamById(teamId));
  const school = useSelector(selectSchoolById(team?.school_id ?? 0));
  const event = useSelector(selectEventById(post?.event_id || 0));

  if (!post) {
    return <InvalidDataError />;
  }

  const recap = post.recap as RecapType;
  const boxscore = post.boxscore as BoxScoreType;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['left', 'right']}>
      <ScrollView style={styles.container} contentInset={{ bottom: 32 }}>
        <View style={styles.modalDragBar} />

        <Text style={styles.header}>{post.title}</Text>
        <Text style={styles.authorDate}>
          {isEmpty(post.submitted_by) ? post.submitted_by : post.created_by} • 
          {(post.submitted ? post.submitted : post.created).format('MMMM D')}
          {event ? (
            <Text>
              {' '}
              • 
              <Text
                style={styles.viewEvent}
                onPress={() =>
                  navigation.navigate('EventDetail', {
                    teamId,
                    eventId: event.id,
                    schoolId: school?.id ?? 0,
                  })
                }>
                View Event
              </Text>
            </Text>
          ) : (
            ''
          )}
        </Text>

        {post.featured_image ? (
          <ImageModal
            style={styles.image}
            modalImageResizeMode={'contain'}
            source={{
              uri: post.featured_image,
            }}
          />
        ) : null}

        <Result event={event} team={team} />
        <BoxScore boxscore={boxscore} />
        <TeamResults teamResults={event?.team_results ?? []} />
        <Text>{recap?.Summary}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
    padding: 20,
  },
  modalDragBar: {
    marginBottom: 20,
    alignSelf: 'center',
    width: 36,
    backgroundColor: 'gray',
    height: 5,
    borderRadius: 3,
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
    marginBottom: 6,
  },
  authorDate: {
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    aspectRatio: 1.75,
    marginBottom: 10,
    width: '100%',
  },
  viewEvent: {
    textDecorationLine: 'underline',
  },
});

export default SportDetail;
