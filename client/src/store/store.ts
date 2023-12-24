import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import authSlice from "./slice/auth.slice";
import userSlice from "./slice/user.slice";

const reducers = {
  auth: authSlice,
  user: userSlice,
};

const combinedReducer = combineReducers<typeof reducers>(reducers);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, combinedReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;
