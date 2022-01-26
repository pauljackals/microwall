<template>
    <ul>
        <Post v-for="post in posts" :key="post._id" :post="post" :isPrivate="isPrivate" style="margin-bottom: 10px"/>
    </ul>
</template>

<script>
import Post from "./Post.vue"

export default {
    name: "PostList",
    components: {
        Post
    },
    props: {
        posts: {
            type: Array,
            required: true
        },
        isPrivate: {
            type: Number,
            required: true
        }
    }
}
</script>