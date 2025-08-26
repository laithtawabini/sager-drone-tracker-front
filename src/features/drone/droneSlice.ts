import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DroneData } from '../../types/droneData';

interface DroneState {
  latest: DroneData | null;
  history: DroneData[];
  selectedDroneRegistration: string | null;
}

const initialState: DroneState = {
  latest: null,
  history: [],
  selectedDroneRegistration: null,
};

const droneSlice = createSlice({
  name: 'drone',
  initialState,
  reducers: {
    receiveDroneData(state, action: PayloadAction<DroneData>) {
      const registrationOfNew = action.payload.features[0].properties.registration;

      const exists = state.history.find(d => d.features[0].properties.registration === registrationOfNew);

      if (exists) {
        // If the drone with the same registration exists, do not add it again, append the new feature or point
        exists.features.push(...action.payload.features);
        state.latest = exists;
        return;
      }
      // Otherwise, add the new drone data to history
      action.payload.flightStartTime = Date.now(); // UTC ms since epoch
      state.latest = action.payload;
      state.history.push(action.payload);
    },
    setSelectedDrone(state, action: PayloadAction<string | null>) {
      state.selectedDroneRegistration = action.payload;
    },
    clearHistory(state) {
      state.history = [];
    },
  },
});

export const { receiveDroneData, clearHistory, setSelectedDrone } = droneSlice.actions;
export default droneSlice.reducer;
