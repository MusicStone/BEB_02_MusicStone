export const LOAD_STONE_LIST = "LOAD_STONE_LIST";
export const RESET_STONE_LIST = "RESET_STONE_LIST";
export const LOAD_MUSICIAN_LIST = "LOAD_MUSICIAN_LIST"
export const RESET_MUSICIAN_LIST = "RESET_STONE_LIST";
export const LOAD_MY_DATA = 'LOAD_MY_DATA';

// action functions
export const loadMusicianList = (musicians) => {
    return {
        type: LOAD_MUSICIAN_LIST,
        payload: musicians
    }
}

export const resetMusicianList = () => {
    return {
        type: RESET_MUSICIAN_LIST
    }
}
export const loadStoneList = (data) => {
    return {
        type: LOAD_STONE_LIST,
        payload: data

    }
}
export const resetStoneList = () => {
    return {
        type: RESET_STONE_LIST
    }
}

export const loadMyData = (data) => {
    return {
        type: LOAD_MY_DATA,
        payload: data.data
    }
}