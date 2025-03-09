<script setup>
import { ref } from 'vue';
import { gameState, endGame } from '../../store/gameStore';
import SortingRow from './SortingRow.vue';
import { checkDescendingOrder } from '../../utils/sortUtils';

const activeRow = ref(null);

function handleDragStart(index) {
  activeRow.value = index;
}

function handleDragOver(e) {
  e.preventDefault();
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

function handleTouchStart(e, index) {
  if (!gameState.isStarted) {
    return;
  }

  e.preventDefault();

  activeRow.value = index;

  console.log('touch start', index);
}


function handleTouchEnd(e) {
  if (!gameState.isStarted || activeRow.value === null) {
    return;
  }

  e.preventDefault();

  const touchX = e.changedTouches[0].clientX;
  const touchY = e.changedTouches[0].clientY;
  const elementsAtTouch = document.elementsFromPoint(touchX, touchY);


  const rowElement = elementsAtTouch.find(el =>
    el.closest('tr[data-index]')
  );


  if (rowElement) {
    const dropIndex = parseInt(rowElement.closest('tr[data-index]').getAttribute('data-index'));
    if (dropIndex !== activeRow.value) {

      const draggedIndex = activeRow.value;
      const draggedPerson = gameState.people[draggedIndex];

      gameState.people.splice(draggedIndex, 1);
      gameState.people.splice(dropIndex, 0, draggedPerson);

      const isSorted = checkDescendingOrder(gameState.people);
      if (isSorted) {
        endGame();
      }
    }
  }

  activeRow.value = null;
}

</script>

<template>
  <table class="w-full rounded-md bg-white border-collapse flex-grow">
    <thead v-if="gameState.people.length !== 0">
      <tr v-if="gameState.isStarted" class="transition duration-200 text-gray-500 opacity-80" :class="{
        'opacity-60 bg-gray-50 cursor-not-allowed': !gameState.isStarted,
      }">
        <th class="text-left px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 text-sm">Sort the
          people by the amount of potatoes in descending order</th>
        <th class="text-left px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 text-sm"></th>
        <th class="text-right px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 text-sm">
          {{ gameState.people.length }} people in the list</th>
      </tr>
      <tr class="transition duration-200" :class="{
        'opacity-60 bg-gray-50 cursor-not-allowed': !gameState.isStarted,
      }">
        <th class="text-left px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 max-sm:text-sm">Name
        </th>
        <th class="text-center px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 max-sm:text-sm">
          Email</th>
        <th class="text-right px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 max-sm:text-sm">
          Potatoes</th>
      </tr>
    </thead>
    <TransitionGroup name="row" tag="tbody" @touchmove="handleTouchMove">
      <template v-if="gameState.people.length === 0">
        <tr>
          <td colspan="3" class="text-center py-4 text-gray-500 max-sm:text-sm">
            No people to display
          </td>
        </tr>
      </template>
      <template v-else>
        <SortingRow v-for="(person, index) in gameState.people" :key="person.potatoesAmount" :index="index"
          :activeRow="activeRow" :person="person" :align="['left', 'center', 'right']"
          @dragstart="handleDragStart(index)" @dragover="handleDragOver" @drop="handleDrop(index)"
          @dragend="handleDragEnd" @touchstart="(e) => handleTouchStart(e, index)" @touchend="handleTouchEnd" />
      </template>
    </TransitionGroup>
  </table>
</template>

<style scoped>
.row-move,
.row-enter-active,
.row-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.row-enter-from,
.row-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.row-leave-active {
  position: absolute;
}
</style>