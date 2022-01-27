import { CLEAR_USER, SET_CURRENT_POST, SET_USER, UPDATE_USER, CLEAR_CURRENT_POST, ADD_COMMENT_TO_CURRENT_POST, ADD_COMMENT_TO_USER, SET_USER_SOCKET } from "./types/mutations"
import {CURRENT_POST, USER, USER_SOCKET} from "./types/state"
import {POST_ACCESS_ENUM} from "../utils/types"

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
    [ADD_COMMENT_TO_USER](state, {comment}) {
        state[USER].posts.forEach(post => {
            if(post._id===comment.post) {
                if(post.access===POST_ACCESS_ENUM.GENERAL) {
                    const comments = comment.isPrivate ? post.commentsPrivate : post.commentsPublic
                    comments.unshift(comment._id)
                } else {
                    const comments = post.commentsPublic ?? post.commentsPrivate
                    comments.unshift(comment._id)
                }
            }
        })
    },

    [SET_CURRENT_POST](state, {post}) {
        state[CURRENT_POST] = post
    },
    [CLEAR_CURRENT_POST](state) {
        state[CURRENT_POST] = {}
    },
    [ADD_COMMENT_TO_CURRENT_POST](state, {comment}) {
        const currentPost = state[CURRENT_POST]
        if(currentPost.commentsPublic) {
            currentPost.commentsPublic.unshift(comment)
        } else {
            currentPost.commentsPrivate.unshift(comment)
        }
    }
}
