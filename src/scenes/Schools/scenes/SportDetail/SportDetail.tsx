import React from 'react';
import { Text, InvalidDataError } from 'components';
import { SectionList, StyleSheet, View, TouchableOpacity } from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectTeamsBySportId } from 'teams/services/selectors';
import { useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectSchoolById } from 'schools/services/selectors';
import TeamRow from 'schools/scenes/SportDetail/components/TeamRow';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { getColorByBackground } from 'src/utils/getColorByBackground';

type SportDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'SportDetail'
>;

const SportDetail = ({ route, navigation }: SportDetailProps) => {
  const { sportId, schoolId } = route.params;

  const teams = useSelector(selectTeamsBySportId(sportId));
  const school = useSelector(selectSchoolById(schoolId));

  if (teams.length === 0 || !school) {
    return <InvalidDataError />;
  }

  const sport = teams[0].sport;

  const goBack = () => {
    navigation.goBack();
  };

  const onSelectTeam = (teamId: number) => {
    navigation.navigate('TeamDetail', { teamId, schoolId });
  };

  const sectionsGroup = groupBy(teams, (team) =>
    team.hide_gender ? team.sport.name : team.gender.name,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections: any[] = map(sectionsGroup, (teamsGroup, gender) => ({
    title: gender,
    data: teamsGroup,
  }));

  const showSectionHeaders = true;
  const color = getColorByBackground(school.primary_color);

  return (
    <SafeAreaView
      style={{ backgroundColor: school.primary_color, flex: 1 }}
      edges={['top', 'left', 'right']}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={goBack}
          hitSlop={{ top: 15, bottom: 15, left: 15 }}>
          <FontAwesomeIcon icon="angle-left" size={15} color={color} />
          <Text style={[styles.backText, { color }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color }]}>{sport.name} Teams</Text>
        <View style={styles.backContainer} />
      </View>
      <View style={styles.container}>
        <View style={styles.well}>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index, section }) => (
              <TeamRow
                team={item}
                index={index}
                onPress={onSelectTeam}
                showSectionHeaders={showSectionHeaders}
                lastIndex={section.data.length - 1}
              />
            )}
            renderSectionHeader={({ section }) => {
              if (showSectionHeaders) {
                return (
                  <View style={styles.headerContainer}>
                    <Text style={styles.header}>{section.title}</Text>
                  </View>
                );
              }
              return <View />;
            }}
            renderSectionFooter={() => <View style={styles.footerContainer} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
  },
  titleContainer: {
    paddingVertical: 12,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  backText: {
    paddingLeft: 5,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  well: {
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
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  footerContainer: {
    marginBottom: 20,
  },
});

export default SportDetail;
