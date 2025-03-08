<script setup>
import { computed } from "vue";
import { gameState } from "../../store/gameStore"

const elapsedTime = computed(() => gameState.timer.elapsedTime);

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
</script>

<template>
    <p class="text-lg max-sm:text-sm">Timer: {{ formatTime(elapsedTime) }}</p>
</template>
