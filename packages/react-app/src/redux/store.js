import {configureStore, combineReducers, getDefaultMiddleware} from '@reduxjs/toolkit';
import contractReducer from './slices/contractSlice';
import channelReducer from './slices/channelSlice';

const rootReducer = combineReducers({
	contracts: contractReducer,
    channels: channelReducer
});

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware({
		serializableCheck: false,
		immutableCheck: false
	})
});

export default store;