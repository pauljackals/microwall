<template>
    <div>
        <h1>friends</h1>
        <UserList :users="user.friends ?? []"/>
        <h2>received invites</h2>
        <UserList :users="user.invitesReceived ?? []"/>
        <h2>sent invites</h2>
        <UserList :users="user.invitesSent ?? []"/>
    </div>
</template>

<script>
import {mapState} from "vuex"
import api from "../servies/api"
import UserList from "../components/UserList.vue"
import state from "../store/types/state"

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
    },
    computed: {
        ...mapState({
            user: state.USER
        })
    }
}
</script>
