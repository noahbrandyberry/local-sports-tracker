import { combineReducers } from 'redux';
import { schoolsReducer } from 'schools/services/reducer';
import { teamsReducer } from 'teams/services/reducer';
import { locationReducer } from 'services/location/reducer';

const rootReducer = combineReducers({
  schools: schoolsReducer,
  teams: teamsReducer,
  location: locationReducer,
});

export default rootReducer;
