import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveDeviceToken } from 'services/deviceToken/actions';
import { selectDeviceToken } from 'services/deviceToken/selectors';
import { selectTeams } from 'teams/services/selectors';

export const useBookmarkedTeams = (schoolId: string) => {
  const teams = useSelector(selectTeams);
  const deviceToken = useSelector(selectDeviceToken);
  const dispatch = useDispatch();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const bookmarkedTeams = teams.filter(
    (team) => bookmarks.includes(team.id) && team.school_id === schoolId,
  );

  const readBookmarks = async () => {
    const storedValue = await AsyncStorage.getItem('@bookmarkedTeams');
    const bookmarkedObject = JSON.parse(storedValue ?? '{}');
    const bookmarkedIds = Object.entries(bookmarkedObject)
      .filter(([, value]) => value)
      .map(([key]) => key);
    setBookmarks(bookmarkedIds);
    setBookmarksLoading(false);

    return bookmarkedObject;
  };

  useFocusEffect(
    useCallback(() => {
      readBookmarks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teams]),
  );

  const bookmarkTeam = (teamId: string) => {
    storeBookmark(teamId, true);
  };

  const unbookmarkTeam = (teamId: string) => {
    storeBookmark(teamId, false);
  };

  const storeBookmark = async (teamId: string, newValue: boolean) => {
    const storedValue = await readBookmarks();
    storedValue[teamId] = newValue;

    await AsyncStorage.setItem('@bookmarkedTeams', JSON.stringify(storedValue));

    await readBookmarks();

    if (newValue && deviceToken) {
      dispatch(
        saveDeviceToken({
          device_token: deviceToken,
          device_subscriptions_attributes: [
            { subscribable_type: 'Team', subscribable_id: teamId },
          ],
        }),
      );
    }
  };

  return {
    bookmarkedTeams,
    bookmarkTeam,
    unbookmarkTeam,
    storeBookmark,
    bookmarksLoading,
  };
};
