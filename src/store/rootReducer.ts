import { combineReducers } from 'redux';
import { schoolsReducer } from 'schools/services/reducer';
import { teamsReducer } from 'teams/services/reducer';
import { upcomingEventsReducer } from 'schools/scenes/UpcomingEvents/services/reducer';
import { eventsReducer } from 'teams/scenes/TeamSchedule/services/reducer';
import { postsReducer } from 'teams/scenes/TeamHome/services/reducer';
import { deviceTokenReducer } from 'services/deviceToken/reducer';
import { locationReducer } from 'services/location/reducer';

const rootReducer = combineReducers({
  schools: schoolsReducer,
  teams: teamsReducer,
  upcomingEvents: upcomingEventsReducer,
  events: eventsReducer,
  posts: postsReducer,
  deviceToken: deviceTokenReducer,
  location: locationReducer,
});

export default rootReducer;
