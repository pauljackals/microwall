import mutations from "./types/mutations"
import stateTypes from "./types/state"

export default {
    [mutations.SET_USER](state, {
        username,
        firstName,
        lastName
    }) {
        state[stateTypes.USER] = {
            username,
            firstName,
            lastName
        }
    },

    [mutations.CLEAR_USER](state) {
        state[stateTypes.USER] = null
    }
}
