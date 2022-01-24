type RootStackParamList = {
  SelectSchool: undefined;
  SchoolsList: undefined;
  SchoolDetail: { schoolId: number };
  SportDetail: { sportId: number; schoolId: number };
  TeamDetail: { teamId: number };
};

export default RootStackParamList;
