import { combineReducers } from "redux";
import musicianReducer from './musicianReducer';
import accountReducer from "./accountReducer";
import buyStoneReducer from './buyStoneReducer';
import myStoneReducer from './myStoneReducer';

const rootReducer = combineReducers({
  musicianReducer,
  buyStoneReducer,
  accountReducer,
  myStoneReducer,
});

export default rootReducer;
