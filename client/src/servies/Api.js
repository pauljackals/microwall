import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"

export default {
    register(username, password, firstName, lastName) {
        return axios.post("/register", {
            username,
            password,
            firstName,
            lastName
        })
    }
}
