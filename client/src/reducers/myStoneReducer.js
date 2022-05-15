import { LOAD_MY_DATA } from "../actions";

const initialState = {
  isMusician: false,
  stoneList: [],
};

const myStoneReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MY_DATA:
      const tempArr = [];
      for (let i = 0; i < action.payload.myStoneInfo.length; i++) {
        //                const service = new caver.klay.Contract(service_abi, process.env.REACT_APP_SERVICE_ADDRESS);

        const tempObj = {
          myStoneInfo: action.payload.myStoneInfo[i],
          stoneInfo: action.payload.stoneInfo[i],
          img: action.payload.albumInfo[i],
        };
        tempArr.push(tempObj);
        //(Object.assign(action.payload.myStoneInfo[i], action.payload.stoneInfo[i], { , test: res }))
      }
      const newState = {
        isMusician: action.payload.isMusician,
        stoneList: tempArr,
      };
      return newState;
    default:
      return state;
  }
};

export default myStoneReducer;
