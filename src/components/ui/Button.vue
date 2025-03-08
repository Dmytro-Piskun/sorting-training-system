<script setup>

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },

  onClick: {
    type: Function,
    default: () => { },
  },
  title:{
    type: String,
    default: 'Click me!',
  }
});


</script>

<template>

  <button 
  :class="[
    'w-40 flex justify-center p-2 rounded-md font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    props.secondary ? 'bg-gradient-to-r from-gray-200 to-zinc-200 hover:from-gray-300 hover:to-zinc-300 focus:ring-gray-300 text-gray-700' : 'text-white  bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:ring-orange-300'
  ]" 
  :disabled="props.disabled"
   @click="props.onClick"
   :aria-label="title"
   >
    {{ title }}
  </button>
</template>