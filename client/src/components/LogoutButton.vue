<template>
    <button @click="logout">logout</button>
</template>

<script>
import actions from "../store/types/actions"
import {mapActions} from "vuex"

export default {
    name: "LogoutButton",
    methods: {
        logout() {
            this.logoutStore().then(() => {
                this.$router.push({
                    name: 'Home'
                })

            }).catch(error => {
                console.error(error)
            })
        },
        ...mapActions({
            logoutStore: actions.LOGOUT
        })
    }
}
</script>
