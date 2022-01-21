import { createStore } from "vuex"
import Api from "../servies/Api"
import mutationsTypes from "./types/mutations"
import actionsTypes from "./types/actions"
import stateTypes from "./types/state"

export default createStore({
    state: {
        [stateTypes.USER]: null
    },
    mutations: {
        [mutationsTypes.SET_USER](state, {
            username,
            firstName,
            lastName
        }) {
            state[stateTypes.USER] = {
                username,
                firstName,
                lastName
            }
        },

        [mutationsTypes.CLEAR_USER](state) {
            state[stateTypes.USER] = null
        }
    },
    actions: {
        [actionsTypes.LOGIN]({commit}, {
            username,
            password
        }) {
            return Api.login(
                username,
                password

            ).then(response => {
                const {
                    username,
                    firstName,
                    lastName
                } = response.data.user

                commit(mutationsTypes.SET_USER,
                    username,
                    firstName,
                    lastName
                )
            })
        },

        [actionsTypes.LOGOUT]({commit}) {
            return Api.logout().then(() => {
                commit(mutationsTypes.CLEAR_USER)
            })
        }
    },
    getters: {}
})
