import { combineReducers } from 'redux';

import { schoolsReducer } from '../scenes/Schools/services/reducer';
import { locationReducer } from './location/reducer';

const rootReducer = combineReducers({
  schools: schoolsReducer,
  location: locationReducer,
});

export default rootReducer;