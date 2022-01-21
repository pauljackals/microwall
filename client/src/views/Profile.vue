<template>
    <div>
        <h1>profile</h1>
        <h2>{{user.username}}</h2>
        <h3>{{user.firstName}} {{user.lastName}}</h3>
    </div>
</template>

<script>
import {mapState} from "vuex"
import state from "../store/types/state"

export default {
    computed: {
        ...mapState({
            user: state.USER
        })
    }
}
</script>
