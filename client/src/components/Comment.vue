<template>
    <div>
        <div>{{(new Date(comment.date)).toLocaleString()}}</div>
        <div v-if="comment.user">{{comment.user.username}}</div>
        <div class="multiline">{{comment.text}}</div>
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
