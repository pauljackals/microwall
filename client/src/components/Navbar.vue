<template>
    <div>
        <router-link :to="{name: 'Home'}">home</router-link>
        <router-link :to="{name: 'Register'}">register</router-link>
    </div>
</template>

<script>
export default {
    name: "Navbar"
}
</script>
