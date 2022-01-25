<template>
    <div>
        <h2>{{isPrivate ? "private" : "public"}} wall</h2>
        <ul>
            <li v-for="post in posts" :key="post._id" style="margin-bottom: 10px">
                <div>{{(new Date(post.date)).toLocaleString()}}</div>
                <div>{{post.user.username}}</div>
                <div>{{post.access}}</div>
                <div>{{post.text}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import {POST_ACCESS_ENUM} from "../utils/types"

export default {
    name: "Wall",
    props: {
        isPrivate: {
            type: Boolean,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        posts(){
            return (this.user.posts ?? []).filter(post => post.access!== (this.isPrivate ? POST_ACCESS_ENUM.PUBLIC : POST_ACCESS_ENUM.PRIVATE))
        }
    }
}
</script>
