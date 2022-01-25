import {
    LOGIN,
    LOGOUT,
    GET_USER_DATA,
    UPDATE_USER_DATA,
    UPDATE_USER_LOGIN,
    INVITE_FRIEND,
    DECLINE_FRIEND,
    REMOVE_FRIEND,
    ACCEPT_FRIEND,
    CANCEL_FRIEND
} from "./types/actions"
import { CLEAR_USER, SET_USER, UPDATE_USER } from "./types/mutations"
import api from "../servies/api"
import {USER} from "./types/state"

export default {
    [LOGIN]({commit}, {
        username,
        password
    }) {
        return api.login(
            username,
            password

        ).then(response => {
            commit(SET_USER, response.data.user)
        })
    },

    [LOGOUT]({commit}) {
        return api.logout().then(() => {
            commit(CLEAR_USER)
        })
    },

    [GET_USER_DATA]({commit}) {
        return api.getUserData().then(response => {
            commit(SET_USER, response.data.user)
        })
    },

    [UPDATE_USER_DATA]({commit}, {firstName, lastName}) {
        return api.updateUserData(firstName, lastName).then(response => {
            const {firstName, lastName} = response.data.user
            commit(UPDATE_USER, {firstName, lastName})
        })
    },

    [UPDATE_USER_LOGIN]({commit}, {password, passwordOld}) {
        return api.updateUserLogin(password, passwordOld).then(response => {
            // const {} = response.data.user
            commit(UPDATE_USER, {})
        })
    },

    [INVITE_FRIEND]({commit, state}, {_id}) {
        return api.inviteFriend(_id).then(response => {
            commit(UPDATE_USER, {
                invitesSent: [
                    ...state[USER].invitesSent,
                    response.data.user
                ]
            })
        })
    },

    [DECLINE_FRIEND]({commit, state}, {_id}) {
        return api.declineFriend(_id).then(response => {
            const {_id} = response.data.user
            commit(UPDATE_USER, {
                invitesReceived: state[USER].invitesSent.filter(user => user._id !== _id)
            })
        })
    },

    [REMOVE_FRIEND]({commit, state}, {_id}) {
        return api.removeFriend(_id).then(response => {
            const {_id} = response.data.user
            commit(UPDATE_USER, {
                friends: state[USER].friends.filter(user => user._id !== _id)
            })
        })
    },

    [ACCEPT_FRIEND]({commit, state}, {_id}) {
        return api.acceptFriend(_id).then(response => {
            const friend = response.data.user
            commit(UPDATE_USER, {
                invitesReceived: state[USER].friends.filter(user => user._id !== friend._id),
                friends: [
                    ...state[USER].friends,
                    friend
                ]
            })
        })
    },

    [CANCEL_FRIEND]({commit, state}, {_id}) {
        return api.cancelFriend(_id).then(response => {
            const {_id} = response.data.user
            commit(UPDATE_USER, {
                invitesSent: state[USER].friends.filter(user => user._id !== _id)
            })
        })
    },
}
