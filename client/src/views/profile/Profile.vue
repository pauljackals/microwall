<template>
    <div>
        <h1>profile</h1>
        <router-link :to="{name: 'EditData'}">edit user data</router-link>
        <router-link :to="{name: 'EditLogin'}">edit login data</router-link>
        <h2>{{user.username}}</h2>
        <h2>{{user.firstName}} {{user.lastName}}</h2>
    </div>
</template>

<script>
import {mapState} from "vuex"
import state from "../../store/types/state"

export default {
    computed: {
        ...mapState({
            user: state.USER
        })
    }
}
</script>
