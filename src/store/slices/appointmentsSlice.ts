import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of an appointment and the slice's state
interface Appointment {
  id: string;
  doctorName: string;
  date: string; // Should be an ISO string
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  // Start with some mock data for development
  appointments: [
    { id: '1', doctorName: 'Dr. Emily Carter', date: '2024-08-15T00:00:00.000Z', time: '10:30 AM', status: 'upcoming' },
    { id: '2', doctorName: 'Dr. John Mathews', date: '2024-08-18T00:00:00.000Z', time: '02:00 PM', status: 'upcoming' },
    { id: '3', doctorName: 'Dr. Sarah Wilson', date: '2024-07-20T00:00:00.000Z', time: '09:00 AM', status: 'completed' },
  ],
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchAppointmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess: (state, action: PayloadAction<Appointment[]>) => {
      state.loading = false;
      state.appointments = action.payload;
    },
    fetchAppointmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // You can add more reducers here later (e.g., cancelAppointment)
  },
});

export const {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
