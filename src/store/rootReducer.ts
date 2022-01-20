import { combineReducers } from 'redux';
import { schoolsReducer } from 'schools/services/reducer';
import { locationReducer } from 'services/location/reducer';

const rootReducer = combineReducers({
  schools: schoolsReducer,
  location: locationReducer,
});

export default rootReducer;
