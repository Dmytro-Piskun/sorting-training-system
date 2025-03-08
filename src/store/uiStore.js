import { reactive } from "vue";

export const uiState = reactive({
    isStartGameModalOpen: false,
    isEndGameModalOpen: false,
});

export function openStartGameModal() {
    uiState.isStartGameModalOpen = true;
}

export function closeStartGameModal() {
    uiState.isStartGameModalOpen = false;
}

export function openEndGameModal() {
    uiState.isEndGameModalOpen = true;
}

export function closeEndGameModal() {
    uiState.isEndGameModalOpen = false;
}