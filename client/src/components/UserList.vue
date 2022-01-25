<template>
    <ul>
        <li v-for="user in users" :key="user._id">
            <router-link :to="{name: 'Profile', params: {id: user._id} }">{{user.username}} ({{user.firstName}} {{user.lastName}})</router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: "UserList",
    props: {
        users: {
            type: Array,
            required: true
        }
    }
}
</script>
