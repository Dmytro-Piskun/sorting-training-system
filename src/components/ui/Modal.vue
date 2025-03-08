<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
    width: {
        type: String,
        default: 'w-96',
    },
});

const emit = defineEmits(['close', 'enter']);

const handleClose = () => {
    emit('close');
};

const handleEnter = () => {
    emit('enter');
};

const handleKeydown = (event) => {
    if (event.key === 'Escape' && props.isOpen) {
        handleClose();
    }
    if (event.key === 'Enter' && props.isOpen) {
        handleEnter();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen" @mousedown="handleClose"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/65 overflow-y-auto">


                <div @click.stop @mousedown.stop class="relative  bg-white rounded-lg shadow-xl overflow-hidden"
                    :class="width">
                    <div v-if="title" class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
                        <button @click="handleClose"
                            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none">
                            <span class="sr-only">Close</span>
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="px-6 py-4">
                        <slot></slot>
                    </div>

                    <div v-if="$slots.footer" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <slot name="footer"></slot>
                    </div>
                </div>


            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
    opacity: 1;
}
</style>