import { LOAD_MUSICIAN_LIST, RESET_MUSICIAN_LIST } from "../actions";

const initialState = {
  musicians: []
};

const musicianReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MUSICIAN_LIST:
      state.musicians = [...state.musicians, ...action.payload];
      return state;
    case RESET_MUSICIAN_LIST:
      state.musicians = [];
      return state;
    default:
      return state;
  }
};

export default musicianReducer;
