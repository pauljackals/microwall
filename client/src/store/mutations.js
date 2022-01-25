import { CLEAR_USER, SET_USER, UPDATE_USER } from "./types/mutations"
import {USER} from "./types/state"

export default {
    [SET_USER](state, user) {
        state[USER] = user
    },

    [CLEAR_USER](state) {
        state[USER] = {}
    },
    
    [UPDATE_USER](state, payload) {
        state[USER] = {
            ...state[USER],
            ...payload
        }
    }
}
