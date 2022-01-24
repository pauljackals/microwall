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
import UserList from "../components/UserList.vue"
import state from "../store/types/state"

export default {
    components: {
        UserList
    },
    computed: {
        ...mapState({
            user: state.USER
        })
    }
}
</script>
