import { Post } from 'teams/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

interface PostRowProps {
  post: Post;
  onPress: CallableFunction;
}

const PostRow = ({ post, onPress }: PostRowProps) => (
  <TouchableOpacity
    style={styles.rowContainer}
    onPress={() => onPress(post.id)}>
    {post.featured_image ? (
      <Image source={{ uri: post.featured_image }} style={styles.image} />
    ) : null}
    <Text style={styles.name}>{post.title}</Text>
    <Text>
      By {post.submitted_by} on {post.submitted.format('MMMM D')}
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
