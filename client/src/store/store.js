import {createStore} from "vuex"
import { CURRENT_POST, CURRENT_POST_SOCKET, CURRENT_USER, CURRENT_USER_SOCKETS, MAIN_WALL_POSTS, MAIN_WALL_POSTS_SOCKETS, USER, USER_SOCKET } from "./types/state"
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

export default createStore({
    state: {
        [USER]: {},
        [USER_SOCKET]: null,

        [CURRENT_POST]: {},
        [CURRENT_POST_SOCKET]: null,

        [MAIN_WALL_POSTS]: [],
        [MAIN_WALL_POSTS_SOCKETS]: [],

        [CURRENT_USER]: {},
        [CURRENT_USER_SOCKETS]: {}
    },
    mutations,
    actions,
    getters
})
