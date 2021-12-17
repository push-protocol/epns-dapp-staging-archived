/**
 * This file helps us maintain the channels fetched in state, such that when we leave the tab, the channels can be fetched from memory
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 0,
  channels: [], // the core contract reader
  channelsCache: {}, // a mapping of channel address to channel details
};

export const contractSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannelMeta: (state, action) => {
      state.channels = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    cacheChannelInfo: (state, action) => {
      const { address, meta } = action.payload;
      state.channelsCache[address] = meta;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setChannelMeta,
  incrementPage,
  cacheChannelInfo,
} = contractSlice.actions;

export default contractSlice.reducer;
