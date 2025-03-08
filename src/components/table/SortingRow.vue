<script setup>
import { gameState } from '../../store/gameStore';


const props = defineProps({
    person: Object,
    align: Array,
    activeRow: Number,
});

</script>

<template>
    <tr v-bind:draggable="gameState.isStarted" class="hover:bg-orange-50 transition duration-200"
        @dragstart="(e) => { if (!gameState.isStarted) e.preventDefault(); }"
        :class="[
            'transition duration-200',
            gameState.isStarted ? 'hover:bg-orange-50 cursor-grab' : 'opacity-60 bg-gray-50 cursor-not-allowed'
        ]">
        <td :style="{ textAlign: align[0] }" class="px-4 py-4 border-b border-gray-100">{{ person.name }}</td>
        <td :style="{ textAlign: align[1] }" class="px-4 py-4 border-b border-gray-100">{{ person.email }}</td>
        <td :style="{ textAlign: align[2] }" class="px-4 py-4 border-b border-gray-100">{{ person.potatoesAmount }}</td>
    </tr>
</template>