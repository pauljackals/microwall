<template>
    <div>
        <h1>home</h1>
        <PostList :posts="posts"/>
    </div>
</template>

<script>
import api from "../servies/api"
import PostList from "../components/post/PostList.vue"

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
    },
    components: {
        PostList
    }
}
</script>
