import axios from "axios"
import isDevelopment from "../utils/isDevelopment"

axios.defaults.baseURL = isDevelopment ? `http://localhost:${process.env.VUE_APP_SERVER_PORT || 5000}` : "/api"
axios.defaults.withCredentials = true
axios.defaults.credentials = "include"

export default {
    register(username, password, firstName, lastName) {
        return axios.post("/register", {
            username,
            password,
            firstName,
            lastName
        })
    },
    login(username, password) {
        return axios.post("/login", {
            username,
            password
        })
    },
    logout() {
        return axios.delete("/logout")
    },
    getUserData() {
        return axios.get("/user/me")
    },
    updateUserData(username, firstName, lastName) {
        return axios.patch("/user/me", {
            username,
            firstName,
            lastName
        })
    },
    updateUserLogin(password, passwordOld) {
        return axios.patch("/user/me/login", {
            password,
            passwordOld
        })
    },

    getUsers(username) {
        return axios.get("/user", {params: {username}})
    },
    getUser(_id) {
        return axios.get(`/user/${_id}`)
    },

    inviteFriend(_id) {
        return axios.patch(`/user/${_id}/friend/add`)
    },
    declineFriend(_id) {
        return axios.patch(`/user/${_id}/friend/decline`)
    },
    removeFriend(_id) {
        return axios.patch(`/user/${_id}/friend/remove`)
    },
    acceptFriend(_id) {
        return axios.patch(`/user/${_id}/friend/accept`)
    },
    cancelFriend(_id) {
        return axios.patch(`/user/${_id}/friend/cancel`)
    },

    getPosts() {
        return axios.get("/post")
    },
    addPost(text, access, links, images) {
        return axios.post("/post", {
            text, access, links, images
        })
    },
    getPost(_id, isPrivate) {
        return axios.get(`/post/${_id}`, {params: {isPrivate}})
    },
    addComment(_id, text, isPrivate) {
        return axios.post(`/post/${_id}`, {text}, {params: {isPrivate}})
    }
}
