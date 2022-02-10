import { CLEAR_USER, SET_CURRENT_POST, SET_USER, UPDATE_USER, CLEAR_CURRENT_POST, ADD_COMMENT_TO_CURRENT_POST, ADD_COMMENT_TO_USER, SET_USER_SOCKET, INVITES_SENT_ADD_USER, INVITES_RECEIVED_ADD_USER, INVITES_SENT_REMOVE_USER, INVITES_RECEIVED_REMOVE_USER, FRIENDS_REMOVE_USER, FRIENDS_ADD_USER, SET_MAIN_WALL_POSTS, ADD_MAIN_WALL_POSTS, CLEAR_MAIN_WALL_POSTS, SET_CURRENT_USER, ADD_CURRENT_USER_POST, CLEAR_CURRENT_USER } from "./types/mutations"
import {CURRENT_POST, CURRENT_POST_SOCKET, CURRENT_USER, CURRENT_USER_SOCKETS, MAIN_WALL_POSTS, MAIN_WALL_POSTS_SOCKETS, USER, USER_SOCKET} from "./types/state"
import {POST_ACCESS_ENUM} from "../utils/types"

const friendsRemoveUser = friendsType => (state, {user}) => {
    const friends = state[USER][friendsType]
    const userIndex = friends.findIndex(invite => invite._id===user._id)
    if(userIndex===-1) {
        return
    }
    state[USER][friendsType] = friends.slice(0, userIndex)
        .concat(friends.slice(userIndex+1))
}
const friendsAddUser = friendsType => (state, {user}) => {
    state[USER][friendsType] = [
        ...state[USER][friendsType],
        user
    ]
}

export default {
    [SET_USER](state, {user}) {
        state[USER] = user
    },
    [CLEAR_USER](state) {
        state[USER] = {}
    },
    [UPDATE_USER](state, payload) {
        state[USER] = {
            ...state[USER],
            ...payload
        }
    },
    [SET_USER_SOCKET](state, {socket}) {
        state[USER_SOCKET] = socket
    },
    [ADD_COMMENT_TO_USER](state, {comment, isPrivate}) {
        state[USER].posts.forEach(post => {
            if(post._id===comment.post) {
                if(post.access===POST_ACCESS_ENUM.GENERAL) {
                    const comments = isPrivate ? post.commentsPrivate : post.commentsPublic
                    comments.unshift(comment._id)
                } else {
                    const comments = post.commentsPublic ?? post.commentsPrivate
                    comments.unshift(comment._id)
                }
            }
        })
    },

    [INVITES_SENT_ADD_USER]: friendsAddUser("invitesSent"),
    [INVITES_SENT_REMOVE_USER]: friendsRemoveUser("invitesSent"),
    [INVITES_RECEIVED_ADD_USER]: friendsAddUser("invitesReceived"),
    [INVITES_RECEIVED_REMOVE_USER]: friendsRemoveUser("invitesReceived"),
    [FRIENDS_ADD_USER](state, payload) {
        friendsRemoveUser("invitesSent")(state, payload)
        friendsRemoveUser("invitesReceived")(state, payload)
        friendsAddUser("friends")(state, payload)
    },
    [FRIENDS_REMOVE_USER]: friendsRemoveUser("friends"),

    [SET_CURRENT_POST](state, {post, socket}) {
        state[CURRENT_POST] = post
        state[CURRENT_POST_SOCKET] = socket
    },
    [CLEAR_CURRENT_POST](state) {
        state[CURRENT_POST] = {}
        if(state[CURRENT_POST_SOCKET]) {
            state[CURRENT_POST_SOCKET].close()
            state[CURRENT_POST_SOCKET] = null
        }
    },
    [ADD_COMMENT_TO_CURRENT_POST](state, {comment}) {
        const currentPost = state[CURRENT_POST]
        if(currentPost.commentsPublic) {
            currentPost.commentsPublic.unshift(comment)
        } else {
            currentPost.commentsPrivate.unshift(comment)
        }
    },

    [SET_MAIN_WALL_POSTS](state, {posts, sockets}) {
        state[MAIN_WALL_POSTS] = posts
        state[MAIN_WALL_POSTS_SOCKETS] = sockets
    },
    [ADD_MAIN_WALL_POSTS](state, {post}) {
        state[MAIN_WALL_POSTS] = [
            post,
            ...state[MAIN_WALL_POSTS]
        ]
    },
    [CLEAR_MAIN_WALL_POSTS](state) {
        state[MAIN_WALL_POSTS] = []
        state[MAIN_WALL_POSTS_SOCKETS].forEach(socket => socket.close())
        state[MAIN_WALL_POSTS_SOCKETS] = []
    },

    [SET_CURRENT_USER](state, {user, sockets}) {
        state[CURRENT_USER] = user
        state[CURRENT_USER_SOCKETS] = sockets
    },
    [ADD_CURRENT_USER_POST](state, {post}) {
        state[CURRENT_USER].posts = [
            post,
            ...state[CURRENT_USER].posts
        ]
    },
    [CLEAR_CURRENT_USER](state) {
        state[CURRENT_USER] = {}
        const sockets = state[CURRENT_USER_SOCKETS]
        if(sockets.private){
            sockets.private.close()
        }
        if(sockets.public){
            sockets.public.close()
        }
        state[CURRENT_USER_SOCKETS] = {}
    }
}
