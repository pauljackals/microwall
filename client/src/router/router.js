import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import Register from "../views/Register.vue"
import NotFound from "../views/NotFound.vue"

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
        path: "/:path(.*)",
        component: NotFound,
        name: "NotFound"
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
