import {createStore} from "vuex"
import { CURRENT_POST, USER, USER_SOCKET } from "./types/state"
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

export default createStore({
    state: {
        [USER]: {},
        [USER_SOCKET]: null,
        [CURRENT_POST]: {}
    },
    mutations,
    actions,
    getters
})
