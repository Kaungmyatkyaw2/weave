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
import themeSlice from "./slice/theme.slice";

const reducers = {
  auth: authSlice,
  user: userSlice,
  theme: themeSlice,
};

const combinedReducer = combineReducers<typeof reducers>(reducers);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "theme"],
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
