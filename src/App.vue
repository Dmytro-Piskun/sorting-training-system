<script setup>
import Timer from "./components/timer/Timer.vue";
import Button from "./components/ui/Button.vue";
import Input from "./components/ui/Input.vue";
import Modal from "./components/ui/Modal.vue";
import SortingTable from "./components/sorting-table/SortingTable.vue";

import { uiState, openStartGameModal, closeStartGameModal, closeEndGameModal } from "./store/uiStore";
import { gameState, startGame } from "./store/gameStore";
import { ref } from "vue";

const peopleAmount = ref(null);
const errorMessage = ref(null);

function handleStartGame() {
  const amount = Number(peopleAmount.value);

  if (!amount || amount <= 0 || !Number.isInteger(amount)) {
    errorMessage.value = "Please enter a valid amount greater than 0.";
    return;
  }

  if (amount < 20 || amount > 100) { 
    errorMessage.value = "Please enter an amount between 20 and 100.";
    return;
  }

  errorMessage.value = "";
  peopleAmount.value = null;
  closeStartGameModal();
  startGame(amount);
}

function handleCloseStartGameModal() {
  closeStartGameModal();
  errorMessage.value = "";
  peopleAmount.value = null;
}
</script>

<template>
 <div class="min-h-screen flex flex-col p-12 max-sm:p-4">
    <!-- Header Section -->
    <header class="flex justify-between items-center mb-6 max-sm:mb-4">
      <div class="flex-none w-1/3">
        <h1 class="text-2xl max-sm:text-sm">Sorting Training System</h1>
      </div>
      <div v-if="gameState.isStarted" class="flex-none w-1/3 flex justify-center">
        <Timer />
      </div>
      <div class="flex-none w-1/3 flex justify-end">
        <Button :onClick="openStartGameModal" :disabled="gameState.isStarted" title="Start Sorting" />
      </div>
    </header>

    <SortingTable/>

    <Modal title="How many people?" :isOpen="uiState.isStartGameModalOpen" @close="closeStartGameModal" @enter="handleStartGame">
      <h2 class="text-md mb-5 text-gray-500 max-sm:text-sm">
        Enter a number of how many people you want to add to the list. (20 - 100)
      </h2>
      <Input v-model="peopleAmount" placeholder="Enter number of people" />
      <p v-if="errorMessage" class="text-red-700 text-md mt-4 ml-1 max-sm:text-sm">
        {{ errorMessage }}
      </p>
      <template v-slot:footer>
        <div class="flex justify-evenly space-x-2">
          <Button secondary :onClick="handleCloseStartGameModal" title="Cancel" />
          <Button :onClick="handleStartGame" title="Start" />
        </div>
      </template>
    </Modal>

    <Modal title="Success" :isOpen="uiState.isEndGameModalOpen" @close = "closeEndGameModal" @enter="closeEndGameModal">
      <p class="text-md text-center text-gray-500 max-sm:text-sm">
        Congratulations!
        You sorted the list correctly in <span class="text-black">{{ gameState.timer.elapsedTime }}</span> seconds.
      </p>
      <template #footer>
        <div class="flex justify-evenly space-x-2">
          <Button :onClick="closeEndGameModal" title="OK" />
        </div>
      </template>
    </Modal>
  </div>
</template>