import {createStore} from "vuex"
import { USER } from "./types/state"
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

export default createStore({
    state: {
        [USER]: {}
    },
    mutations,
    actions,
    getters
})
