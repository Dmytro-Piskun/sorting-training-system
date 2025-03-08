import { reactive } from "vue";
import { generatePeople } from "../utils/peopleUtils";
import { uiState } from "./uiStore";

export const gameState = reactive({
    isStarted: false,
    people: [],
    timer: {
        timerId: null,
        startTime: null,
        endTime: null,
        elapsedTime: null,
    },
})


export function startGame(amount) {
    gameState.isStarted = true;
    gameState.timer.startTime = Date.now();
    gameState.timer.elapsedTime = 0;
    gameState.timer.endTime = null;
    gameState.timer.timerId = setInterval(() => {

        gameState.timer.elapsedTime++;

    }, 1000);
    gameState.people = generatePeople(amount);
}

export function endGame() {
    gameState.isStarted = false;
    clearInterval(gameState.timer.timerId);
    gameState.timer.endTime = Date.now();
    gameState.timer.elapsedTime = ((gameState.timer.endTime - gameState.timer.startTime) / 1000).toFixed(2);
    uiState.isEndGameModalOpen = true;
}