import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux';
import reducer, { RootReducer } from './reducers';

const composeEnhancers =
  (typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

const middlewares: ReadonlyArray<Middleware> = [];

export const configureStore = (): Store<RootReducer> => {
  const store = createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept(
      './reducers',
      (): void => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nextRootReducer = require('./reducers');
        store.replaceReducer(nextRootReducer);
      },
    );
  }

  return store;
};
