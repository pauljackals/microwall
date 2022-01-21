import getters from "./types/getters"
import stateTypes from "./types/state"

export default {
    [getters.LOGGED_IN](state) {
        return !!Object.keys(state[stateTypes.USER]).length
    }
}
