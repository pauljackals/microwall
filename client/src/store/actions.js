import actions from "./types/actions"
import mutations from "./types/mutations"
import api from "../servies/api"

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
            commit(mutations.SET_USER, response.data.user)
        })
    },

    [actions.UPDATE_USER_LOGIN]({commit}, {password, passwordOld}) {
        return api.updateUserLogin(password, passwordOld).then(response => {
            commit(mutations.SET_USER, response.data.user)
        })
    }
}
