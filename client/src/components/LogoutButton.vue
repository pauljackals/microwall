<template>
    <button @click="logout">logout</button>
</template>

<script>
import {LOGOUT} from "../store/types/actions"
import {mapActions} from "vuex"

export default {
    name: "LogoutButton",
    methods: {
        logout() {
            this.logoutStore().then(() => {
                this.$router.push({
                    name: 'Login'
                })

            }).catch(error => {
                console.error(error)
            })
        },
        ...mapActions({
            logoutStore: LOGOUT
        })
    }
}
</script>
