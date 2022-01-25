import { FRIENDS_COMBINED, LOGGED_IN } from "./types/getters"
import {USER} from "./types/state"

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
    }
}
