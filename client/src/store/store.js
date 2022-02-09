import {createStore} from "vuex"
import { CURRENT_POST, CURRENT_POST_SOCKET, MAIN_WALL_POSTS, MAIN_WALL_POSTS_SOCKETS, USER, USER_SOCKET } from "./types/state"
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
        [MAIN_WALL_POSTS_SOCKETS]: []
    },
    mutations,
    actions,
    getters
})
