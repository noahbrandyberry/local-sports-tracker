import TeamsNavigatorParams from 'teams/TeamsNavigatorParams';

type RootStackParamList = {
  SelectSchool: undefined;
  SchoolsList: undefined;
  SchoolDetail: { schoolId: number };
  SportDetail: { sportId: number; schoolId: number };
  TeamDetail: {
    schoolId: number;
    teamId: number;
    initialRouteName?: keyof TeamsNavigatorParams;
  };
  EventDetail: {
    schoolId: number;
    teamId: number;
    eventId: number;
    openDirections?: boolean;
  };
  PostDetail: { postId: string; teamId: number };
};

export default RootStackParamList;
