import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import Register from "../views/Register.vue"
import Login from "../views/Login.vue"
import NotFound from "../views/NotFound.vue"
import Profile from "../views/profile/Profile.vue"
import EditData from "../views/profile/EditData.vue"
import EditLogin from "../views/profile/EditLogin.vue"
import Users from "../views/Users.vue"
import Friends from "../views/Friends.vue"
import Wall from "../components/Wall.vue"
import PostNew from "../views/post/New.vue"

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
        path: "/user/me/edit-data",
        component: EditData,
        name: "EditData"
    },
    {
        path: "/user/me/edit-login",
        component: EditLogin,
        name: "EditLogin"
    },

    {
        path: "/user",
        component: Users,
        name: "Users"
    },
    {
        path: "/user/:id/",
        component: Profile,
        name: "Profile",
        props: true,
        redirect: {name: "WallPublic"},
        children: [
            {
                path: "public",
                component: Wall,
                name: "WallPublic",
                props: {
                    isPrivate: 0
                }
            },
            {
                path: "private",
                component: Wall,
                name: "WallPrivate",
                props: {
                    isPrivate: 1
                }
            }
        ]
    },

    {
        path: "/friend",
        component: Friends,
        name: "Friends"
    },

    {
        path: "/post/add",
        component: PostNew,
        name: "PostNew"
    },

    {
        path: "/:path(.*)*",
        component: NotFound,
        name: "NotFound"
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
