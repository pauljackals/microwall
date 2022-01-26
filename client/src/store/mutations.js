import { CLEAR_USER, SET_CURRENT_POST, SET_USER, UPDATE_USER, CLEAR_CURRENT_POST } from "./types/mutations"
import {CURRENT_POST, USER} from "./types/state"

export default {
    [SET_USER](state, {user}) {
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
    },

    [SET_CURRENT_POST](state, {post}) {
        state[CURRENT_POST] = post
    },
    [CLEAR_CURRENT_POST](state) {
        state[CURRENT_POST] = {}
    }
}
