import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import Register from "../views/Register.vue"
import Login from "../views/Login.vue"
import NotFound from "../views/NotFound.vue"
import Profile from "../views/Profile.vue"

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
        path: "/:path(.*)",
        component: NotFound,
        name: "NotFound"
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
