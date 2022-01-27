import { Post } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import isEmpty from 'lodash/isEmpty';

interface PostRowProps {
  post: Post;
  onPress: CallableFunction;
}

const PostRow = ({ post, onPress }: PostRowProps) => (
  <TouchableOpacity
    style={styles.rowContainer}
    onPress={() => onPress(post.id)}>
    {post.featured_image ? (
      <FastImage source={{ uri: post.featured_image }} style={styles.image} />
    ) : null}
    <Text style={styles.name}>{post.title}</Text>
    <Text>
      By {isEmpty(post.submitted_by) ? post.submitted_by : post.created_by} on{' '}
      {(post.submitted ? post.submitted : post.created).format('MMMM D')}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  rowContainer: {
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
  },
  image: {
    aspectRatio: 2,
    marginBottom: 10,
    width: '100%',
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default PostRow;
