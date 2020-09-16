import * as ACTION_TYPE from "./actionType";
import { StoreInterface } from "./storeInterface";

const defaultState:StoreInterface = {
    collapsed: false,
    fontsize: null
}
const appReducer = (state: any, action: any) => {
    switch (action.type) {
        case ACTION_TYPE.FONTSIZE:
            return { ...state, fontsize: action.fontsize };
        case ACTION_TYPE.COLLAPSED:
            return { ...state, collapsed: action.data };
        default: return state
    }
}

export {
    defaultState,
    appReducer
}