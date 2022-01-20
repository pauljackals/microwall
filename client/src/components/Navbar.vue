<template>
    <div>
        <router-link :to="{name: 'Home'}">home</router-link>
        <router-link :to="{name: 'Register'}">register</router-link>
        <router-link :to="{name: 'Login'}">login</router-link>
        <LogoutButton/>
    </div>
</template>

<script>
import LogoutButton from "./LogoutButton.vue"
export default {
    name: "Navbar",
    components: {
        LogoutButton
    }
}
</script>
