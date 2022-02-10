<template>
    <input :type="field.type" :value="field.value" :placeholder="field.name" class="input" @input="$emit('update:modelValue', $event.target.value)">
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