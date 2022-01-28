<template>
    <div>
        <h1 class="title">users</h1>
        <UserList :users="users"/>
    </div>
</template>

<script>
import api from "../services/api"
import UserList from "../components/UserList.vue"

export default {
    data() {
        return {
            users: []
        }
    },
    components: {
        UserList
    },
    created() {
        api.getUsers().then(response => {
            this.users = response.data.users

        }).catch(() => {})
    }
}
</script>

<style scoped>
h1 {
    text-align: center;
}
</style>
