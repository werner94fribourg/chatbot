import { fetchAllBusinesses, fetchNewBusinesses } from '@/api_calls/calls';
import { Business } from '@/utils/backend/utils';
import { createSlice, Dispatch } from '@reduxjs/toolkit';

export interface StoredBusiness {
  id: number;
  name: string;
  type: string;
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  openingHour: string;
  closingHour: string;
}

interface BusinessesState {
  businesses: StoredBusiness[];
  isLoading: boolean;
}

const initialState: BusinessesState = {
  businesses: [],
  isLoading: false,
};

const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    addBusinesses(state, action) {
      const {
        payload: { businesses },
      } = action;

      businesses.forEach((business: StoredBusiness) => {
        let storedIndex = state.businesses.findIndex(b => b.id === business.id);
        if (storedIndex !== -1) state.businesses[storedIndex] = business;
        else state.businesses.push(business);
      });
    },
    setLoadingState(state, action) {
      const {
        payload: { isLoading },
      } = action;

      state.isLoading = isLoading;
    },
  },
});

const businessesActions = businessesSlice.actions;

export const businessesReducer = businessesSlice.reducer;

export const storeAllBusinesses = async (dispatch: Dispatch) => {
  dispatch(businessesActions.setLoadingState({ isLoading: true }));
  const { valid, data } = await fetchAllBusinesses();

  if (valid && data) {
    const businesses = data.map((business: Business) => {
      const {
        address: {
          street,
          postalCode,
          city,
          state,
          country,
          coordinates: [lat, lng],
        },
      } = business;

      const businessCopy: any = { ...business };

      delete businessCopy.address;
      return {
        ...businessCopy,
        street,
        postalCode,
        city,
        state,
        country,
        lat,
        lng,
      };
    });
    dispatch(businessesActions.addBusinesses({ businesses }));
  }
  dispatch(businessesActions.setLoadingState({ isLoading: false }));
};

export const storeNewBusinesses = async (dispatch: Dispatch) => {
  dispatch(businessesActions.setLoadingState({ isLoading: true }));
  const { valid, data } = await fetchNewBusinesses();

  if (valid && data) {
    const businesses = data.map((business: Business) => {
      const {
        address: {
          street,
          postalCode,
          city,
          state,
          country,
          coordinates: [lat, lng],
        },
      } = business;

      const businessCopy: any = { ...business };

      delete businessCopy.address;
      return {
        ...businessCopy,
        street,
        postalCode,
        city,
        state,
        country,
        lat,
        lng,
      };
    });
    dispatch(businessesActions.addBusinesses({ businesses }));
  }
  dispatch(businessesActions.setLoadingState({ isLoading: false }));
};
