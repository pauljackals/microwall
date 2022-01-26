import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"
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
    updateUserData(firstName, lastName) {
        return axios.patch("/user/me", {
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

    getUsers() {
        return axios.get("/user")
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
    }
}
