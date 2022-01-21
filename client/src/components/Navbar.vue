<template>
    <div>
        <router-link :to="{name: 'Home'}">home</router-link>
        <div class="wrapper-inline" v-if="!user">
            <router-link :to="{name: 'Register'}">register</router-link>
            <router-link :to="{name: 'Login'}">login</router-link>
        </div>
        <LogoutButton v-else/>
    </div>
</template>

<script>
import LogoutButton from "./LogoutButton.vue"
import {mapState} from "vuex"
import state from "../store/types/state"

export default {
    name: "Navbar",
    components: {
        LogoutButton
    },
    computed: {
        ...mapState({
            user: state.USER
        })
    }
}
</script>
