import { gameState } from "../store/gameStore";

export const checkDescendingOrder = (people) => {
    const isSorted = people.every((person, index) => {
  
      return index === 0 || person.potatoesAmount <= people[index - 1].potatoesAmount;
    });
  
    return isSorted;
  };