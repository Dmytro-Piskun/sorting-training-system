<script setup>
import { gameState } from '../../store/gameStore';

const props = defineProps({
    person: Object,
    align: Array,
    index: Number,
});

const emit = defineEmits(['dragstart', 'dragover', 'drop', 'dragend', 'touchstart', 'touchend']);

function handleDragStart(e, index) {
    if (!gameState.isStarted) e.preventDefault();
    e.dataTransfer.effectAllowed = 'move';
    emit('dragstart', index, e);
}

function handleDragOver(e) {
    e.preventDefault();
    emit('dragover', e);
}

function handleDrop(e, index) {
    e.preventDefault();
    emit('drop', index, e);
}

function handleDragEnd(e) {
    emit('dragend', e);
}

function handleTouchStart(e) {
    emit('touchstart', e);
}

function handleTouchEnd(e) {
    emit('touchend', e);
}


</script>

<template>
    <tr v-bind:draggable="gameState.isStarted" :data-index="index" class="hover:bg-orange-50 transition duration-200"
        :class="[
            'transition duration-200',
            gameState.isStarted ? 'cursor-grab' : 'opacity-60 bg-gray-50 cursor-not-allowed'
        ]" @dragstart="handleDragStart($event, index)" @dragover="handleDragOver($event)"
        @drop="handleDrop($event, index)" @dragend="handleDragEnd($event)" @touchstart="handleTouchStart($event)"
        @touchend="handleTouchEnd($event)">
        <td :style="{ textAlign: align[0] }"
            class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">{{ person.name }}</td>
        <td :style="{ textAlign: align[1] }"
            class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">
            <div class="max-sm:w-20 max-sm:truncate">{{ person.email }}</div>
        </td>
        <td :style="{ textAlign: align[2] }"
            class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">{{ person.potatoesAmount
            }}</td>
    </tr>
</template>