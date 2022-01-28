<template>
    <div class="box mb-0 mt-6 has-background-light">
        <div>{{(new Date(post.date)).toLocaleString()}}</div>
        <div v-if="post.user" class="">
            <router-link :to="{name: 'Profile', params: {id: post.user._id} }">{{post.user.username}} ({{post.user.firstName}} {{post.user.lastName}})</router-link>
        </div>
        <div>{{post.access}}</div>
        <div class="multiline box">{{post.text}}</div>
        <ul>
            <li v-for="(link, index) in post.links" :key="index"><a :href="link" target="_blank">{{link}}</a></li>
        </ul>
        <ul>
            <li v-for="(image, index) in post.images" :key="index"><img :src="image"></li>
        </ul>
    </div>
</template>

<script>

export default {
    name: "Post",
    props: {
        post: {
            type: Object,
            required: true
        }
    }
}
</script>
