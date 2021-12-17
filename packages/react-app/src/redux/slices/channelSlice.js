/**
 * This file helps us maintain the channels fetched in state, such that when we leave the tab, the channels can be fetched from memory
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [], // the core contract reader
  channelsCache: {}, // a mapping of channel address to channel details
};

export const contractSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannelMeta: (state, action) => {
      alert("here");
      state.setChannelMeta = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChannelMeta } = contractSlice.actions;

export default contractSlice.reducer;
