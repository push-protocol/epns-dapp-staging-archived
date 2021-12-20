/**
 * This file helps us maintain the notifications fetched in state, so when tabs are switched we can retain the notification information
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: 1, //the current page
    notifications: [],// the actual notifications
    finishedFetching: false
}

export const contractSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addPaginatedNotifications: (state, action) => {
            state.notifications = [ ...state.notifications, ...action.payload ];
            state.page += 1;
        },
        incrementPage: (state) => {
            state.page += 1;
        },
        addNewNotification: (state, action) => {
            state.notifications = [{...action.payload}, ...state.notifications]
        },
        setFinishedFetching: (state) => {
            state.finishedFetching = true;
        }
    }
});

export const {
    addPaginatedNotifications,
    incrementPage,
    addNewNotification,
    setFinishedFetching
} = contractSlice.actions;

export default contractSlice.reducer;