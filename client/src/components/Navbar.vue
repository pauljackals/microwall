<template>
    <div>
        <router-link :to="{name: 'Home'}">home</router-link>
        <router-link :to="{name: 'Users'}">users</router-link>
        <div class="wrapper-inline" v-if="!loggedIn">
            <router-link :to="{name: 'Register'}">register</router-link>
            <router-link :to="{name: 'Login'}">login</router-link>
        </div>
        <div class="wrapper-inline" v-else>
            <router-link :to="{name: 'Friends'}">friends</router-link>
            <router-link :to="{name: 'MyProfile'}">{{user.username}}</router-link>
            <LogoutButton/>
        </div>
    </div>
</template>

<script>
import LogoutButton from "./LogoutButton.vue"
import {mapGetters, mapState} from "vuex"
import getters from "../store/types/getters"
import state from "../store/types/state"

export default {
    name: "Navbar",
    components: {
        LogoutButton
    },
    computed: {
        ...mapState({
            user: state.USER
        }),
        ...mapGetters({
            loggedIn: getters.LOGGED_IN
        })
    }
}
</script>

<style scoped>
a {
    margin-right: 10px;
}
</style>
