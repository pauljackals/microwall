import { FRIENDS_COMBINED, LOGGED_IN, PRIVATE_WALL_POSTS, PUBLIC_WALL_POSTS } from "./types/getters"
import {USER} from "./types/state"
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
    }
}
