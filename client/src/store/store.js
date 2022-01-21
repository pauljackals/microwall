import {createStore} from "vuex"
import stateTypes from "./types/state"
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

export default createStore({
    state: {
        [stateTypes.USER]: {}
    },
    mutations,
    actions,
    getters
})
