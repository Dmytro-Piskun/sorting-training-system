<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: String,
    placeholder: String,
    type: {
        type: String,
        default: 'text',
    },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <input :type="type" :placeholder="placeholder" :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)" class="w-full border border-gray-300 p-2 rounded-md font-semibold transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-offset-2 ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
      hover:scale-[1.005] active:scale-[0.995]
      " />
</template>
