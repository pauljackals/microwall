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
    COMMENT_CURRENT_POST,
    GET_MAIN_WALL_POSTS,
    GET_CURRENT_USER
} from "./types/actions"
import {
    ADD_COMMENT_TO_CURRENT_POST,
    ADD_COMMENT_TO_USER,
    ADD_CURRENT_USER_POST,
    ADD_MAIN_WALL_POSTS,
    CLEAR_PRIVATE_WALL_SOCKET,
    CLEAR_USER, FRIENDS_ADD_USER,
    FRIENDS_REMOVE_USER,
    INVITES_RECEIVED_ADD_USER,
    INVITES_RECEIVED_REMOVE_USER,
    INVITES_SENT_ADD_USER,
    INVITES_SENT_REMOVE_USER,
    SET_CURRENT_POST,
    SET_CURRENT_USER,
    SET_MAIN_WALL_POSTS,
    SET_USER,
    SET_USER_SOCKET,
    UPDATE_USER
} from "./types/mutations"
import api from "../services/api"
import {USER, USER_SOCKET} from "./types/state"
import sio from "../services/sio"
import {POST_ACCESS_ENUM} from "../utils/types"

const listenToUser = (commit, id) => {
    const socket = sio.listenToUser(id)

    socket.on("comment", ({comment, isPrivate}) => {
        commit(ADD_COMMENT_TO_USER, {comment, isPrivate})
    })

    socket.on("friendAdd", ({user}) => {
        commit(INVITES_RECEIVED_ADD_USER, {user})
    })
    socket.on("friendDecline", ({user}) => {
        commit(INVITES_SENT_REMOVE_USER, {user})
    })
    socket.on("friendAccept", ({user}) => {
        commit(FRIENDS_ADD_USER, {user})
    })
    socket.on("friendRemove", ({user}) => {
        commit(FRIENDS_REMOVE_USER, {user})
        commit(CLEAR_PRIVATE_WALL_SOCKET, {user})
    })
    socket.on("friendCancel", ({user}) => {
        commit(INVITES_RECEIVED_REMOVE_USER, {user})
    })

    return socket
}

const getFriendsIds = user => (user.friends ?? []).map(friend => friend._id)

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
            // commit(UPDATE_USER, {})
        })
    },

    [INVITE_FRIEND]({commit}, {_id}) {
        return api.inviteFriend(_id).then(response => {
            const {user} = response.data
            commit(INVITES_SENT_ADD_USER, {user})
        })
    },

    [DECLINE_FRIEND]({commit}, {_id}) {
        return api.declineFriend(_id).then(response => {
            const {user} = response.data
            commit(INVITES_RECEIVED_REMOVE_USER, {user})
        })
    },

    [REMOVE_FRIEND]({commit}, {_id}) {
        return api.removeFriend(_id).then(response => {
            const {user} = response.data
            commit(FRIENDS_REMOVE_USER, {user})
        })
    },

    [ACCEPT_FRIEND]({commit}, {_id}) {
        return api.acceptFriend(_id).then(response => {
            const {user} = response.data
            commit(FRIENDS_ADD_USER, {user})
        })
    },

    [CANCEL_FRIEND]({commit}, {_id}) {
        return api.cancelFriend(_id).then(response => {
            const {user} = response.data
            commit(INVITES_SENT_REMOVE_USER, {user})
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
            
            const socket = sio.listenToPost(post._id, isPrivate).on("comment", ({comment}) => {
                if(comment.user._id!==state[USER]._id) {
                    commit(ADD_COMMENT_TO_CURRENT_POST, {comment})
                }
            })
            commit(SET_CURRENT_POST, {post, socket})
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
    },

    [GET_MAIN_WALL_POSTS]({commit, state}) {
        return api.getPosts().then(response => {
            const {posts} = response.data
            const sockets = (state[USER].friends ?? [])
                .reduce((object, friend) => {
                    object[friend._id] = sio.listenToPrivateWall(friend._id).on("post", ({post}) => {
                        commit(ADD_MAIN_WALL_POSTS, {post})
                    })
                    return object
                }, {})
            
            sockets.main = sio.listenToMainWall().on("post", ({post}) => {
                if(post.access===POST_ACCESS_ENUM.GENERAL && getFriendsIds(state[USER]).includes(post.user._id)) {
                    return
                }
                commit(ADD_MAIN_WALL_POSTS, {post})
            })

            commit(SET_MAIN_WALL_POSTS, {posts, sockets})
        })
    },

    [GET_CURRENT_USER]({commit, state}, {_id}) {
        return api.getUser(_id).then(response => {
            const {user} = response.data

            const sockets = {
                public: sio.listenToPublicWall(_id).on("post", ({post}) => {
                    if(post.access===POST_ACCESS_ENUM.GENERAL && getFriendsIds(state[USER]).includes(post.user._id)) {
                        return
                    }
                    commit(ADD_CURRENT_USER_POST, {post})
                }),
                
                private: getFriendsIds(state[USER]).includes(_id)
                    ? sio.listenToPrivateWall(_id).on("post", ({post}) => {
                        commit(ADD_CURRENT_USER_POST, {post})
                    })
                    : undefined
            }

            commit(SET_CURRENT_USER, {user, sockets})
        })
    }
}
