<template>
    <div>
        <h1>home</h1>
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
import api from "../servies/api"
export default {
    data(){
        return {
            posts: []
        }
    },
    created(){
        api.getPosts().then(response => {
            this.posts = response.data.posts
        
        }).catch(err => console.error(err))
    }
}
</script>
