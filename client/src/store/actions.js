import actions from "./types/actions"
import mutations from "./types/mutations"
import api from "../servies/api"
import stateTypes from "./types/state"

export default {
    [actions.LOGIN]({commit}, {
        username,
        password
    }) {
        return api.login(
            username,
            password

        ).then(response => {
            commit(mutations.SET_USER, response.data.user)
        })
    },

    [actions.LOGOUT]({commit}) {
        return api.logout().then(() => {
            commit(mutations.CLEAR_USER)
        })
    },

    [actions.GET_USER_DATA]({commit}) {
        return api.getUserData().then(response => {
            commit(mutations.SET_USER, response.data.user)
        })
    },

    [actions.UPDATE_USER_DATA]({commit}, {firstName, lastName}) {
        return api.updateUserData(firstName, lastName).then(response => {
            const {firstName, lastName} = response.data.user
            commit(mutations.UPDATE_USER, {firstName, lastName})
        })
    },

    [actions.UPDATE_USER_LOGIN]({commit}, {password, passwordOld}) {
        return api.updateUserLogin(password, passwordOld).then(response => {
            // const {} = response.data.user
            commit(mutations.UPDATE_USER, {})
        })
    },

    [actions.INVITE_FRIEND]({commit, state}, {_id}) {
        return api.inviteFriend(_id).then(response => {
            commit(mutations.UPDATE_USER, {
                invitationsSent: [
                    ...state[stateTypes.USER].invitationsSent,
                    response.data.user
                ]
            })
        })
    }
}
