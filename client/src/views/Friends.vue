<template>
    <div>
        <h1 class="title">friends</h1>
        <UserList :users="user.friends ?? []"/>
        <h2 class="title">received invites</h2>
        <UserList :users="user.invitesReceived ?? []"/>
        <h2 class="title">sent invites</h2>
        <UserList :users="user.invitesSent ?? []"/>
    </div>
</template>

<script>
import {mapState} from "vuex"
import UserList from "../components/UserList.vue"
import {USER} from "../store/types/state"

export default {
    components: {
        UserList
    },
    computed: {
        ...mapState({
            user: USER
        })
    }
}
</script>
<style scoped>
h1, h2 {
    text-align: center;
}
</style>