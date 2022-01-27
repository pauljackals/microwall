<template>
    <div>
        <div>{{(new Date(post.date)).toLocaleString()}}</div>
        <div v-if="post.user">{{post.user.username}}</div>
        <div>{{post.access}}</div>
        <div class="multiline">{{post.text}}</div>
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
