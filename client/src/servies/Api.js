import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"
const authenticationConfig = {
    withCredentials: true,
    credentials: "include"
}

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
        }, authenticationConfig)
    },
    logout() {
        return axios.delete("/logout", authenticationConfig)
    },
    getUserData() {
        return axios.get("/user/me", authenticationConfig)
    },
    updateUserData(firstName, lastName) {
        return axios.patch("/user/me", {
            firstName,
            lastName
        }, authenticationConfig)
    },
    updateUserLogin(password, passwordOld) {
        return axios.patch("/user/me/login", {
            password,
            passwordOld
        }, authenticationConfig)
    },

    getUsers() {
        return axios.get("/user", authenticationConfig)
    },
    getUser(_id) {
        return axios.get(`/user/${_id}`)
    },

    inviteFriend(_id) {
        return axios.patch(`/user/${_id}/friend/add`, {}, authenticationConfig)
    },
    declineFriend(_id) {
        return axios.patch(`/user/${_id}/friend/decline`, {}, authenticationConfig)
    },
    removeFriend(_id) {
        return axios.patch(`/user/${_id}/friend/remove`, {}, authenticationConfig)
    },
    acceptFriend(_id) {
        return axios.patch(`/user/${_id}/friend/accept`, {}, authenticationConfig)
    },
    cancelFriend(_id) {
        return axios.patch(`/user/${_id}/friend/cancel`, {}, authenticationConfig)
    }
}
