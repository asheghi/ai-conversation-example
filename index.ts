import { createConverstaion } from "./ollama";

const { addMessage, runConverstaions } = createConverstaion({
    agents: [
        {
            name: 'Rick',
            system: "you're Rick from rich and morty series, morty will talk with you, you have to respond to him and keep ther conversation going forward, keep the response short",
        },
        {
            name: 'Morty',
            system: "you're Morty from rich and morty series, rick will talk with you, you have to respond to him and keep ther conversation going forward, keep the response short",
        }
    ],
    messageLimit: 30,
});


addMessage('Rick', 'Hey Morty!')

await runConverstaions();