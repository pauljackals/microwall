<template>
    <button @click="logout">logout</button>
</template>

<script>
import Api from "../servies/Api"
export default {
    name: "LogoutButton",
    methods: {
        logout() {
            Api.logout().then(() => {
                this.$router.push({
                    name: 'Home'
                })

            }).catch(error => {
                console.error(error)
            })
        }
    }
}
</script>
