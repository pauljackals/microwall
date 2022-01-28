<template>
    <div class="block has-background-info">
        <h1 class="title is-1 has-text-white-ter">MicroWall</h1>
        <div class="navbar has-background-info">
            <router-link :to="{name: 'Home'}" class="button is-dark">home</router-link>
            <router-link :to="{name: 'Users'}" class="button is-dark">users</router-link>
            <div class="wrapper-inline" v-if="!loggedIn">
                <router-link :to="{name: 'Login'}" class="button is-dark">login</router-link>
                <router-link :to="{name: 'Register'}" class="button is-dark">register</router-link>
            </div>
            <div class="wrapper-inline" v-else>
                <router-link :to="{name: 'Friends'}" class="button is-dark">friends</router-link>
                <router-link :to="{name: 'Profile', params: {id: 'me'} }" class="button is-dark">{{user.username}}</router-link>
                <LogoutButton class="button is-dark"/>
            </div>
        </div>
    </div>
</template>

<script>
import LogoutButton from "./LogoutButton.vue"
import {mapGetters, mapState} from "vuex"
import {USER} from "../store/types/state"
import { LOGGED_IN } from '../store/types/getters'

export default {
    name: "Navbar",
    components: {
        LogoutButton
    },
    computed: {
        ...mapState({
            user: USER
        }),
        ...mapGetters({
            loggedIn: LOGGED_IN
        })
    }
}
</script>

<style scoped>
a:not(:last-child) {
    margin-right: 50px;
}
.navbar {
    display: flex;
    justify-content: center;
}
.title {
    text-align: center;
}
</style>
