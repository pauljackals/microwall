import getters from "./types/getters"
import stateTypes from "./types/state"

export default {
    [getters.LOGGED_IN](state) {
        return !!Object.keys(state[stateTypes.USER]).length
    },

    [getters.FRIENDS_COMBINED](state) {
        const {friends, invitationsSent, invitationsReceived} = state[stateTypes.USER]
        return [
            ...friends,
            ...invitationsSent,
            ...invitationsReceived
        ]
    }
}
