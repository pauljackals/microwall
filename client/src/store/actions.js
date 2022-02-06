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
    CANCEL_FRIEND,
    ADD_POST,
    GET_POST,
    COMMENT_CURRENT_POST
} from "./types/actions"
import { ADD_COMMENT_TO_CURRENT_POST, ADD_COMMENT_TO_USER, CLEAR_USER, SET_CURRENT_POST, SET_CURRENT_POST_SOCKET, SET_USER, SET_USER_SOCKET, UPDATE_USER } from "./types/mutations"
import api from "../services/api"
import {USER, USER_SOCKET} from "./types/state"
import sio from "../services/sio"

const listenToUser = (commit, id) => {
    const socket = sio.listenToUser(id)

    socket.on("comment", payloadRaw => {
        const {comment, isPrivate} = JSON.parse(payloadRaw)
        commit(ADD_COMMENT_TO_USER, {comment, isPrivate})
    })

    return socket
}

export default {
    [LOGIN]({commit}, {
        username,
        password
    }) {
        return api.login(
            username,
            password

        ).then(response => {
            const {user} = response.data
            commit(SET_USER, {user})

            const socket = listenToUser(commit, user._id)
            commit(SET_USER_SOCKET, {socket})
        })
    },

    [LOGOUT]({commit, state}) {
        return api.logout().then(() => {
            commit(CLEAR_USER)
            state[USER_SOCKET].close()
            commit(SET_USER_SOCKET, {socket: null})
        })
    },

    [GET_USER_DATA]({commit}) {
        return api.getUserData().then(response => {
            const {user} = response.data
            commit(SET_USER, {user})

            const socket = listenToUser(commit, user._id)
            commit(SET_USER_SOCKET, {socket})
        })
    },

    [UPDATE_USER_DATA]({commit}, {username, firstName, lastName}) {
        return api.updateUserData(username, firstName, lastName).then(response => {
            const {username, firstName, lastName} = response.data.user
            commit(UPDATE_USER, {username, firstName, lastName})
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
                invitesReceived: state[USER].invitesReceived.filter(user => user._id !== _id)
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
                invitesReceived: state[USER].invitesReceived.filter(user => user._id !== friend._id),
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
                invitesSent: state[USER].invitesSent.filter(user => user._id !== _id)
            })
        })
    },

    [ADD_POST]({commit, state}, {text, access, links, images}) {
        return api.addPost(text, access, links, images).then(response => {
            commit(UPDATE_USER, {
                posts: [response.data.post, ...state[USER].posts]
            })
        })
    },

    [GET_POST]({commit, state}, {_id, isPrivate}) {
        return api.getPost(_id, isPrivate).then(response => {
            const {post} = response.data
            commit(SET_CURRENT_POST, {post})
            
            const socket = sio.listenToPost(post._id, isPrivate)
            socket.on("comment", payloadRaw => {
                const {comment} = JSON.parse(payloadRaw)
                if(comment.user._id!==state[USER]._id) {
                    commit(ADD_COMMENT_TO_CURRENT_POST, {comment})
                }
            })
            commit(SET_CURRENT_POST_SOCKET, {socket})
        })
    },

    [COMMENT_CURRENT_POST]({commit, state}, {_id, text, isPrivate}) {
        return api.addComment(_id, text, isPrivate).then(response => {
            const {comment} = response.data
            commit(ADD_COMMENT_TO_CURRENT_POST, {comment})
            if(state[USER]._id===comment.user._id) {
                commit(ADD_COMMENT_TO_USER, {comment, isPrivate})
            }
        })
    }
}
