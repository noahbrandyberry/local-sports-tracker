type RootStackParamList = {
  SelectSchool: undefined;
  SchoolsList: undefined;
  SchoolDetail: { schoolId: number };
  SportDetail: { sportId: number; schoolId: number };
  TeamDetail: { teamId: number };
  EventDetail: { teamId: number; eventId: number };
  PostDetail: { postId: string; teamId: number };
};

export default RootStackParamList;
