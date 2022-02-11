import { FRIENDS_COMBINED, LOGGED_IN, MAIN_WALL_POSTS_LAST, PRIVATE_WALL_POSTS, PUBLIC_WALL_POSTS } from "./types/getters"
import {MAIN_WALL_POSTS, USER} from "./types/state"
import {POST_ACCESS_ENUM} from "../utils/types"

export default {
    [LOGGED_IN](state) {
        return !!Object.keys(state[USER]).length
    },

    [FRIENDS_COMBINED](state) {
        const {friends, invitesSent, invitesReceived} = state[USER]
        return [
            ...friends,
            ...invitesSent,
            ...invitesReceived
        ]
    },

    [PRIVATE_WALL_POSTS](state) {
        return (state[USER].posts ?? []).filter(post => post.access!==POST_ACCESS_ENUM.PUBLIC)
    },
    [PUBLIC_WALL_POSTS](state) {
        return (state[USER].posts ?? []).filter(post => post.access!==POST_ACCESS_ENUM.PRIVATE)
    },

    [MAIN_WALL_POSTS_LAST](state) {
        const mainWallPosts = state[MAIN_WALL_POSTS]
        return mainWallPosts.slice(-1)[0]
    }
}
