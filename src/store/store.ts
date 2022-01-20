import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'store/rootSaga';
import rootReducer from 'store/rootReducer';

const sagaMiddleware = createSagaMiddleware();

let composeEnhancers = compose;

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(rootSaga);

export default store;
