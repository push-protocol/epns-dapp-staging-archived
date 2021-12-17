/**
 * This file helps us maintain a global state of all contracts to be used across the application
 * This is used to prevent duplication of logic and instantiating contracts multiple times
 * This is also used to prevent passing props everywhere and making the code ugly
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  epnsReadProvider: null, // the core contract reader
  epnsWriteProvider: null, // the core contract with signer
  epnsCommReadProvider: null, // the communicator contract reader
  epnsCommWriteProvider: null, // the communicator write contract with signer
};

export const contractSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setCoreReadProvider: (state, action) => {
      state.epnsReadProvider = action.payload;
    },
    setCoreWriteProvider: (state, action) => {
      state.epnsWriteProvider = action.payload;
    },
    setCommunicatorReadProvider: (state, action) => {
      state.epnsCommReadProvider = action.payload;
    },
    setCommunicatorWriteProvider: (state, action) => {
      state.epnsCommWriteProvider = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCoreReadProvider,
  setCoreWriteProvider,
  setCommunicatorReadProvider,
  setCommunicatorWriteProvider
} = contractSlice.actions;

export default contractSlice.reducer;
