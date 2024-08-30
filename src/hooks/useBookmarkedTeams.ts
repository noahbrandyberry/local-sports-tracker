import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveDeviceToken } from 'services/deviceToken/actions';
import { selectDeviceToken } from 'services/deviceToken/selectors';
import { selectTeams } from 'teams/services/selectors';
import { useQuery } from './useQuery';
import { transformTeams } from 'teams/services/transform';
import { Team } from 'teams/models';

export const useBookmarkedTeams = (schoolId?: string) => {
  const teamsFromSelector = useSelector(selectTeams);
  const deviceToken = useSelector(selectDeviceToken);
  const dispatch = useDispatch();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const { isLoading, data: teamsFromQuery } = useQuery<Team[]>({
    url: `teams.json`,
    params: { team_id: bookmarks },
    transform: transformTeams,
    queryKey: ['bookmarked_teams', bookmarks],
    enabled: bookmarks.length > 0 && !schoolId,
    staleTime: Infinity,
  });

  const teams = (schoolId ? teamsFromSelector : teamsFromQuery) ?? [];

  const bookmarkedTeams = teams.filter(
    (team) =>
      bookmarks.includes(team.id) &&
      (schoolId ? team.school_id === schoolId : true),
  );

  const readBookmarks = async () => {
    const storedValue = await AsyncStorage.getItem('@bookmarkedTeams');
    const bookmarkedObject = JSON.parse(storedValue ?? '{}');
    const bookmarkedIds = Object.entries(bookmarkedObject)
      .filter(([, value]) => value)
      .map(([key]) => key);
    if (isMounted.current) {
      setBookmarks(bookmarkedIds);
      setBookmarksLoading(false);
    }

    return bookmarkedObject;
  };

  useFocusEffect(
    useCallback(() => {
      readBookmarks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teams]),
  );

  const bookmarkTeam = async (teamId: string) => {
    await storeBookmark(teamId, true);
  };

  const unbookmarkTeam = async (teamId: string) => {
    await storeBookmark(teamId, false);
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
    bookmarksLoading:
      bookmarksLoading || (bookmarks.length > 0 && !schoolId && isLoading),
  };
};
