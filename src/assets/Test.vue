<script setup>
import { ref, computed } from 'vue';
import { gameState, endGame } from '../../store/gameStore';
import SortingRow from './SortingRow.vue';
import { checkDescendingOrder } from '../../utils/sortUtils';

// Track drag state
const draggedItem = ref(null);
const draggedIndex = ref(null);
const touchY = ref(0);
const rowHeight = ref(0);
const tableElement = ref(null);

// Calculate positions for touch feedback
const rowPositions = computed(() => {
  if (!tableElement.value) return [];
  
  const rows = tableElement.value.querySelectorAll('tbody tr');
  return Array.from(rows).map(row => {
    const rect = row.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height
    };
  });
});

// Initialize drag
function startDrag(index) {
  if (!gameState.isStarted) return;
  
  draggedIndex.value = index;
  draggedItem.value = { ...gameState.people[index] };
  rowHeight.value = rowPositions.value[index]?.height || 0;
}

// Handle mouse events for desktop
function handleMouseDown(event, index) {
  if (!gameState.isStarted) return;
  startDrag(index);
  
  // Add global mouse event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event) {
  if (draggedIndex.value === null) return;
  
  const mouseY = event.clientY;
  moveItemBasedOnPosition(mouseY);
}

function handleMouseUp() {
  finishDrag();
  
  // Remove global event listeners
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

// Handle touch events for mobile
function handleTouchStart(event, index) {
  if (!gameState.isStarted) return;
  
  startDrag(index);
  touchY.value = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (draggedIndex.value === null) return;
  
  // Prevent scrolling while dragging
  event.preventDefault();
  
  const currentTouchY = event.touches[0].clientY;
  moveItemBasedOnPosition(currentTouchY);
  touchY.value = currentTouchY;
}

function handleTouchEnd() {
  finishDrag();
}

// Common functionality for both mouse and touch
function moveItemBasedOnPosition(positionY) {
  if (draggedIndex.value === null) return;
  
  for (let i = 0; i < rowPositions.value.length; i++) {
    const position = rowPositions.value[i];
    
    // Skip the currently dragged row
    if (i === draggedIndex.value) continue;
    
    // Check if cursor/touch is over this row
    if (positionY >= position.top && positionY <= position.bottom) {
      // Move the item in the array
      const item = gameState.people.splice(draggedIndex.value, 1)[0];
      gameState.people.splice(i, 0, item);
      
      // Update draggedIndex to the new position
      draggedIndex.value = i;
      break;
    }
  }
}

function finishDrag() {
  if (draggedIndex.value !== null) {
    const isSorted = checkDescendingOrder(gameState.people);
    if (isSorted) {
      endGame();
    }
  }
  
  // Reset drag state
  draggedIndex.value = null;
  draggedItem.value = null;
}
</script>

<template>
  <table ref="tableElement" class="w-full rounded-md bg-white border-collapse flex-grow">
    <thead v-if="gameState.people.length !== 0">
      <tr class="transition duration-200" :class="{
        'opacity-60 bg-gray-50 cursor-not-allowed': !gameState.isStarted,
      }">
        <th class="text-left px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 max-sm:text-sm">Name</th>
        <th class="text-center px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 max-sm:text-sm">Email</th>
        <th class="text-right px-4 py-4 border-b border-gray-100 font-normal max-sm:px-2 max-sm:py-2 max-sm:text-sm">Potatoes</th>
      </tr>
    </thead>
    <TransitionGroup name="row" tag="tbody">
      <template v-if="gameState.people.length === 0">
        <tr>
          <td colspan="3" class="text-center py-4 text-gray-500 max-sm:text-sm">
            No people to display
          </td>
        </tr>
      </template>
      <template v-else>
        <tr 
          v-for="(person, index) in gameState.people" 
          :key="person.potatoesAmount"
          :class="[
            'transition duration-200',
            gameState.isStarted ? 'hover:bg-orange-50' : 'opacity-60 bg-gray-50 cursor-not-allowed',
            draggedIndex === index ? 'bg-orange-100' : ''
          ]"
          @mousedown="handleMouseDown($event, index)"
          @touchstart="handleTouchStart($event, index)"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <td :style="{ textAlign: 'left' }" class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">
            {{ person.name }}
          </td>
          <td :style="{ textAlign: 'center' }" class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">
            {{ person.email }}
          </td>
          <td :style="{ textAlign: 'right' }" class="px-4 py-4 border-b border-gray-100 max-sm:px-2 max-sm:py-2 max-sm:text-sm">
            {{ person.potatoesAmount }}
          </td>
        </tr>
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