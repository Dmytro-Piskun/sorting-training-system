import { ref, computed, onUnmounted } from 'vue';
import { gameState, endGame } from '../store/gameStore';
import { checkDescendingOrder } from '../utils/sortUtils';

export default function useDragAndDrop() {
    const activeRow = ref(null);
    const ghostPosition = ref({ x: 0, y: 0 });
    const showGhost = ref(false);
    const activePerson = ref(null);
    const scrollInterval = ref(null);

    const ghostStyle = computed(() => {
        return {
            top: `${ghostPosition.value.y}px`,
            left: `${ghostPosition.value.x}px`,
            transform: 'translate(-50%, -50%)',
        };
    });

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
        showGhost.value = false;
        activePerson.value = null;
        stopAutoScroll();

        const isSorted = checkDescendingOrder(gameState.people);

        if (isSorted) {
            endGame();
        }
    }

    function handleDragEnd() {
        activeRow.value = null;
        showGhost.value = false;
        activePerson.value = null;
        stopAutoScroll();
    }

    function handleTouchStart(e) {
        if (!gameState.isStarted) return;

        e.preventDefault();

        const rowElement = e.target.closest("[data-index]");
        if (!rowElement) return;

        const index = parseInt(rowElement.getAttribute("data-index"));
        activeRow.value = index;
        activePerson.value = gameState.people[index];

        ghostPosition.value = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };

        setTimeout(() => {
            if (activeRow.value !== null) {
                showGhost.value = true;
            }
        }, 100);
    }

    function handleTouchMove(e) {
        if (!gameState.isStarted || activeRow.value === null) {
            return;
        }

        e.preventDefault();

        ghostPosition.value = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };

        checkForAutoScroll(e.touches[0].clientY);
    }

    function handleTouchEnd(e) {
        if (!gameState.isStarted || activeRow.value === null) {
            return;
        }

        e.preventDefault();

        stopAutoScroll();

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
        showGhost.value = false;
        activePerson.value = null;
    }

    function checkForAutoScroll(touchY) {
        const windowHeight = window.innerHeight;
        const scrollThreshold = 60;
        const scrollSpeed = 5;

        stopAutoScroll();

        if (touchY < scrollThreshold) {
            scrollInterval.value = setInterval(() => {
                window.scrollBy(0, -scrollSpeed);
            }, 16);
        } else if (touchY > windowHeight - scrollThreshold) {
            scrollInterval.value = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 16);
        }
    }

    function stopAutoScroll() {
        if (scrollInterval.value) {
            clearInterval(scrollInterval.value);
            scrollInterval.value = null;
        }
    }

    onUnmounted(() => {
        stopAutoScroll();
    });

    return {
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
    };
}
