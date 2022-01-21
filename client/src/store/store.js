import {createStore} from "vuex"
import stateTypes from "./types/state"
import actions from "./actions"
import mutations from "./mutations"

export default createStore({
    state: {
        [stateTypes.USER]: null
    },
    mutations,
    actions,
    getters: {}
})
