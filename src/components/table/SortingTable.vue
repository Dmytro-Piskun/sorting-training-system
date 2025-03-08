<script setup>
import { ref} from 'vue';
import { gameState, endGame } from '../../store/gameStore';
import SortingRow from './SortingRow.vue';
import { checkDescendingOrder } from '../../utils/sortUtils';

const activeRow = ref(null);

function handleDragStart(index) {
  activeRow.value = index;

}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(index) {
  const draggedIndex = activeRow.value;
  const draggedPerson = gameState.people[draggedIndex];

  gameState.people.splice(draggedIndex, 1);
  gameState.people.splice(index, 0, draggedPerson);

  activeRow.value = null;

  const isSorted = checkDescendingOrder(gameState.people);

  if (isSorted) {
    endGame();
  }

}

function handleDragEnd() {
  activeRow.value = null;
}



</script>

<template>
  <table class="w-full rounded-md bg-white border-collapse flex-grow">
    <thead v-if="gameState.people.length !== 0">
      <tr class="transition duration-200" :class="{
             'opacity-60 bg-gray-50 cursor-not-allowed': !gameState.isStarted,
        }">
        <th class="text-left px-4 py-4 border-b border-gray-100 font-normal">Name</th>
        <th class="text-center px-4 py-4 border-b border-gray-100 font-normal">Email</th>
        <th class="text-right px-4 py-4 border-b border-gray-100 font-normal">Potatoes</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="gameState.people.length === 0">
        <td colspan="3" class="text-center py-4 text-gray-500">
          No people to display
        </td>
      </tr>
      <SortingRow v-for="(person, index) in gameState.people" :key="index" :activeRow="activeRow" :person="person"
        :align="['left', 'center', 'right']" @dragstart="handleDragStart(index)" @dragover="handleDragOver"
        @drop="handleDrop(index)" @dragend="handleDragEnd" />
    </tbody>
  </table>
</template>