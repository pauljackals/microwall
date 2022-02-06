<template>
    <div v-if="field.errors">
        <span v-for="(error, index) in field.errors" :key="index" class="error">{{error}}</span>
    </div>
</template>

<script>
export default {
    name: "FormFieldErrors",
    props: {
        field: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
    .error {
        display: block;
        color: red;
    }
</style>
