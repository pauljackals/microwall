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
    },
    login(username, password) {
        return axios.post("/login",
            {
                username,
                password
            },
            {
                withCredentials: true,
                credentials: "include"
            }
        )
    },
    logout() {
        return axios.delete("/logout", {
            withCredentials: true,
            credentials: "include"
        })
    },
    getUserData() {
        return axios.get("/user/me", {
            withCredentials: true,
            credentials: "include"
        })
    },
    updateUserData(firstName, lastName) {
        return axios.patch("/user/me",
            {
                firstName,
                lastName
            },
            {
                withCredentials: true,
                credentials: "include"
            }
        )
    },
    updateUserLogin(password, passwordOld) {
        return axios.patch("/user/me/login",
            {
                password,
                passwordOld
            },
            {
                withCredentials: true,
                credentials: "include"
            }
        )
    }
}
