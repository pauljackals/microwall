import mutations from "./types/mutations"
import stateTypes from "./types/state"

export default {
    [mutations.SET_USER](state, user) {
        state[stateTypes.USER] = user
    },

    [mutations.CLEAR_USER](state) {
        state[stateTypes.USER] = {}
    },
    
    [mutations.UPDATE_USER](state, payload) {
        state[stateTypes.USER] = {
            ...state[stateTypes.USER],
            ...payload
        }
    }
}
