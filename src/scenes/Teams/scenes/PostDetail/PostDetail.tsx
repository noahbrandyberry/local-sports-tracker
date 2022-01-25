import React from 'react';
import { Text, InvalidDataError } from 'components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
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
import BoxScore from './components';

type PostDetailProps = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const SportDetail = ({ route }: PostDetailProps) => {
  const { postId } = route.params;

  const post = useSelector(selectPostById(postId));

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
      <ScrollView style={styles.container}>
        <View style={styles.modalDragBar} />

        <Text style={styles.header}>{post.title}</Text>
        <Text style={styles.authorDate}>
          {post.submitted_by} • {post.submitted.format('MMMM D')}
        </Text>

        {post.featured_image ? (
          <Image source={{ uri: post.featured_image }} style={styles.image} />
        ) : null}

        <BoxScore boxscore={boxscore} />
        <Text>{recap.Summary}</Text>
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
    aspectRatio: 1.5,
    marginBottom: 10,
    width: '100%',
  },
});

export default SportDetail;
