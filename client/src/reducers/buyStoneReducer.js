import { LOAD_STONE_LIST, RESET_STONE_LIST } from "../actions";

const initialState = {
    stones: []
};

const buyStoneReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_STONE_LIST:
            const showName = (korName, engName) => {
                if (korName && engName) {
                    return `${korName}(${engName})`;
                } else if (korName) {
                    return korName;
                } else {
                    return engName;
                }
            }

            for (let i = 0; i < action.payload.sellList.length; i++) {
                const tempObj = {
                    stoneId: action.payload.stoneInfo[i].id,
                    name: action.payload.stoneInfo[i].name,
                    musician_name: showName(action.payload.musicianInfo[i].name_korea, action.payload.musicianInfo[i].name_english),
                    img: action.payload.albumImgList[i].originalname,
                    price: action.payload.sellList[i].price,
                    //현재 balance 넘어오는 값 없어서 고정값 넣어놓음
                    myBalance: action.payload.userBalanceList[i],
                }
                state.stones.push(tempObj)
            }
            return state;
        case RESET_STONE_LIST:
            state.stones = [];
            return state;
        default:
            return state;
    }
};

export default buyStoneReducer;
