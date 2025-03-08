<script setup>
import { gameState } from '../../store/gameStore';

const props = defineProps({
    person: Object,
    align: Array,
    activeRow: Number,
});

function handleDragStart(e) {
    if (!gameState.isStarted) e.preventDefault(); 
    e.dataTransfer.effectAllowed = 'move';
}
</script>

<template>
    <tr v-bind:draggable="gameState.isStarted" class="hover:bg-orange-50 transition duration-200"
        @dragstart="handleDragStart" @dragend="handleDragEnd" :class="[
            'transition duration-200',
            gameState.isStarted ? 'cursor-grab' : 'opacity-60 bg-gray-50 cursor-not-allowed'
        ]">
        <td :style="{ textAlign: align[0] }" class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">{{ person.name }}</td>
        <td :style="{ textAlign: align[1] }" class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">{{ person.email }}</td>
        <td :style="{ textAlign: align[2] }" class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">{{ person.potatoesAmount }}</td>
    </tr>
</template>