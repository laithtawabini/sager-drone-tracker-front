import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface OptionsState {
  showSelectedPathOnly: boolean;
  cancelSelectionOnMapDrag: boolean;
}

const initialState: OptionsState = {
  showSelectedPathOnly: false,
  cancelSelectionOnMapDrag: true,
};

const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setShowSelectedPathOnly(state, action: PayloadAction<boolean>) {
      state.showSelectedPathOnly = action.payload;
    },

    setCancelSelectionOnMapDrag(state, action: PayloadAction<boolean>) {
      state.cancelSelectionOnMapDrag = action.payload;
    }
  },
});

export const { setShowSelectedPathOnly, setCancelSelectionOnMapDrag } = optionsSlice.actions;
export default optionsSlice.reducer;
