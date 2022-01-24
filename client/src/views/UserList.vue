<template>
    <div>
        <h1>users</h1>
        <ul>
            <li v-for="user in users" :key="user._id">
                <router-link :to="{name: 'Profile', params: {id: user._id} }">{{user.username}}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import api from "../servies/api"

export default {
    data() {
        return {
            users: []
        }
    },
    created() {
        api.getUsers().then(response => {
            this.users = response.data.users

        }).catch(() => {})
    }
}
</script>
