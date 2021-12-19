/**
 * This file helps us to maintain the state of the user(if they have an account)
 * as well as the privilidges the logged in user has
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channelDetails: null,
    canVerify: false
};

export const contractSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUserChannelDetails: (state, action) => {
            state.channelDetails = action.payload;
        },
        setCanVerify: (state, action) => {
            state.canVerify = action.payload;
        }
    }
});

export const {
    setUserChannelDetails,
    setCanVerify
} = contractSlice.actions;

export default contractSlice.reducer;