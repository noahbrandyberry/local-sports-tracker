import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';

type RootStackParamList = {
  SelectSchool: undefined;
  SchoolsList: undefined;
  SchoolDetail: { schoolId: string };
  SportDetail: { sportId: number; schoolId: string };
  TeamDetail: {
    schoolId: string;
    teamId: string;
    initialRouteName?: keyof TeamsNavigatorParams;
  };
  EventDetail: {
    schoolId: string;
    teamId: string;
    eventId: string;
    openDirections?: boolean;
  };
  PlayerDetail: {
    schoolId: string;
    teamId: string;
    playerId: number;
  };
  PostDetail: { postId: string; teamId: string };
  UpcomingEvents: { schoolId: string };
};

export default RootStackParamList;
