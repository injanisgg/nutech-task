import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileAPI, updateProfileAPI, updateProfileImageAPI } from "../../services/api";

export const fetchProfile = createAsyncThunk(
    'profile/fetch',
    async(_, { rejectWithValue }) => {
        try {
            const response = await getProfileAPI(); 
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/update',
    async(profileData, { rejectWithValue }) => {
        try {
            const response = await updateProfileAPI(profileData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProfileImage = createAsyncThunk(
  'profile/updateImage',
  async (file, { rejectWithValue }) => {
    try {
      const response = await updateProfileImageAPI(file);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
    data: {
        first_name: '',
        last_name: '',
        email: '',
        profile_image: '',
    },
    loading: false,
    error: null,
    updateSuccess: false,
    },
    reducers: {
        clearUpdateSuccess: (state) => {
            state.updateSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
        // fetch profile
        .addCase(fetchProfile.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchProfile.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload !== '__NO_CONTENT__') {
                state.data = action.payload;
            }
        })
        .addCase(fetchProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // update profile
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.data = action.payload;
            state.updateSuccess = true;
        })

        // update image
        .addCase(updateProfileImage.fulfilled, (state, action) => {
            state.data = action.payload;
            state.updateSuccess = true;
        });
    },
});

export const { clearUpdateSuccess } = profileSlice.actions;
export default profileSlice.reducer;