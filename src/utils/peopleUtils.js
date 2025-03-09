import { faker } from "@faker-js/faker";
import { checkDescendingOrder } from "./sortUtils";

const minPotatoesAmount = 1;
const maxPotatoesAmount = 100;

export function generatePeople(amount) {

    let people = [];

    do {

        people = [];
        const usedPotatoesAmount = new Set();

        for (let i = 0; i < amount; i++) {

            let potatoesAmount;

            do {

                potatoesAmount = Math.floor(Math.random() * (maxPotatoesAmount - minPotatoesAmount + 1) + minPotatoesAmount);

            } while (usedPotatoesAmount.has(potatoesAmount));

            usedPotatoesAmount.add(potatoesAmount);

            const randomPeople = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                potatoesAmount,
            }
            people.push(randomPeople);
        }


    } while(checkDescendingOrder(people));


    return people;

}

