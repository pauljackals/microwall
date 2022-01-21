import actions from "./types/actions"
import mutations from "./types/mutations"
import Api from "../servies/Api"

export default {
    [actions.LOGIN]({commit}, {
        username,
        password
    }) {
        return Api.login(
            username,
            password

        ).then(response => {
            commit(mutations.SET_USER, response.data.user)
        })
    },

    [actions.LOGOUT]({commit}) {
        return Api.logout().then(() => {
            commit(mutations.CLEAR_USER)
        })
    },

    [actions.GET_USER_DATA]({commit}) {
        return Api.getUserData().then(response => {
            commit(mutations.SET_USER, response.data.user)
        })
    }
}
