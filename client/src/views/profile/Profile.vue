<template>
    <User :id="id" :key="id"/>
</template>

<script>
import User from "../../components/User.vue"
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        User
    }
}
</script>
