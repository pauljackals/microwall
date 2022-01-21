import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import Register from "../views/Register.vue"
import Login from "../views/Login.vue"
import NotFound from "../views/NotFound.vue"
import Profile from "../views/profile/Profile.vue"
import EditData from "../views/profile/EditData.vue"
import EditLogin from "../views/profile/EditLogin.vue"
import UserList from "../views/UserList.vue"

const routes = [
    {
        path: "/",
        component: Home,
        name: "Home"
    },
    {
        path: "/register",
        component: Register,
        name: "Register"
    },
    {
        path: "/login",
        component: Login,
        name: "Login"
    },

    {
        path: "/me",
        component: Profile,
        name: "Profile"
    },
    {
        path: "/me/edit",
        component: EditData,
        name: "EditData"
    },
    {
        path: "/me/edit-login",
        component: EditLogin,
        name: "EditLogin"
    },

    {
        path: "/user",
        component: UserList,
        name: "UserList"
    },

    {
        path: "/:path(.*)",
        component: NotFound,
        name: "NotFound"
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
