<template>
    <input :type="field.type" v-model="field.value" :placeholder="field.name" class="input">
</template>

<script>
export default {
    name: "FormField",
    props: {
        field: {
            type: Object,
            required: true
        }
    }
}
</script>