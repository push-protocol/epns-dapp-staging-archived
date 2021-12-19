/**
 * This file helps us to maintain the state of the user(if they have an account)
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channelDetails: null
};

export const contractSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUserChannelDetails: (state, action) => {
            state.channelDetails = action.payload;
        }
    }
});

export const {
    setUserChannelDetails
} = contractSlice.actions;

export default contractSlice.reducer;