<template>
    <div>
        <PostList :posts="posts" :isPrivate="-1"/>
    </div>
</template>

<script>
import api from "../services/api"
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
