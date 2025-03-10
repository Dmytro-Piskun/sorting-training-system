<script setup>
import { gameState} from '../../store/gameStore';
import SortingRow from './SortingRow.vue';
import useDragAndDrop from '../../composables/useDragAndDrop';

const {
  showGhost,
  activePerson,
  ghostStyle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} = useDragAndDrop();


</script>

<template>
  <div v-if="gameState.isStarted" class="transition duration-200 rounded-t-md bg-zinc-50 text-gray-500 opacity-80 w-full flex justify-between">
    <div class="text-left px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 text-sm">Sort in descending order</div>
    <div class="text-left px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 text-sm">{{ gameState.people.length }} people in the list</div>
  </div>
  <table class="w-full rounded-md bg-white border-collapse flex-grow">
    <thead v-if="gameState.people.length !== 0">
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
           :person="person" :align="['left', 'center', 'right']"
          @dragstart="handleDragStart(index)" @dragover="handleDragOver" @drop="handleDrop(index)"
          @dragend="handleDragEnd" @touchstart="handleTouchStart" @touchend="handleTouchEnd" />
      </template>
    </TransitionGroup>
  </table>

  <Transition name="fade">
    <div v-if="showGhost && activePerson" :style="ghostStyle"
      class=" select-none transition-transform duration-75 fixed opacity-80 bg-white rounded-md pointer-events-none z-50 w-[90%] shadow-md table border-collapse">
      <table class="w-full border-collapse">
        <tr class="bg-orange-50 transition duration-200">
          <td class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm text-left">{{
            activePerson.name }}</td>
          <td class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm text-center">{{
            activePerson.email }}</td>
          <td class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm text-right">{{
            activePerson.potatoesAmount }}</td>
        </tr>
      </table>
    </div>
  </Transition>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>