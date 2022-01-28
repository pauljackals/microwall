<template>
    <div class="box mb-0 mt-6 has-background-light">
        <div>{{(new Date(comment.date)).toLocaleString()}}</div>
        <div v-if="comment.user">
            <router-link :to="{name: 'Profile', params: {id: comment.user._id} }">{{comment.user.username}} ({{comment.user.firstName}} {{comment.user.lastName}})</router-link>
        </div>
        <div class="multiline box">{{comment.text}}</div>
    </div>
</template>

<script>

export default {
    name: "Comment",
    props: {
        comment: {
            type: Object,
            required: true
        }
    }
}
</script>
