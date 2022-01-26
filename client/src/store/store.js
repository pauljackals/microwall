import {createStore} from "vuex"
import { CURRENT_POST, USER } from "./types/state"
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

export default createStore({
    state: {
        [USER]: {},
        [CURRENT_POST]: {}
    },
    mutations,
    actions,
    getters
})
