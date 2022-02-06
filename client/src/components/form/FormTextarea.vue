<template>
    <textarea :value="field.value" :placeholder="field.name" class="textarea has-fixed-size" @input="$emit('update:modelValue', $event.target.value)"></textarea>
</template>

<script>
export default {
    name: "FormTextarea",
    props: {
        field: {
            type: Object,
            required: true
        }
    }
}
</script>