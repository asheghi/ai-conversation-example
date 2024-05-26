import ollama from 'ollama';

const model = "Llama3:8b-Instruct-Q5_1";

type AgentType = {
    name: string
    system: string;
}

export function createConverstaion({ agents, messageLimit }: {
    agents: [AgentType, AgentType],
    messageLimit: number,
}) {
    const history: { who: string, message: string }[] = []

    async function chat(systemPrompt: string, messageHistory: { role: 'user' | 'assistant', content: string }[]) {
        const res = await ollama.chat({
            model: model,
            messages: [{
                role: 'system',
                content: systemPrompt,
            },
            ...messageHistory
            ]
        });
        return res.message.content;
    }

    function printLastMessage() {
        const last = history[history.length - 1];
        console.log(last.who.toUpperCase() + ":\n\t" + last.message + "\n\n");
    }

    async function getAgentResponse(agent: AgentType) {
        const res = await chat(agent.system, history.map(it => {
            return {
                role: it.who === agent.name ? 'assistant' : 'user',
                content: it.message,
            }
        }),);
        history.push({ who: agent.name, message: res });
    }

    const runConverstaions = async () => {
        while (history.length < messageLimit) {
            for await (const agent of agents) {
                await getAgentResponse(agent)
                printLastMessage();
            }

        }
    }

    const addMessage = async (agentName: string, message: string) => {
        history.push({ who: agentName, message: message })
        printLastMessage();
    }

    return { runConverstaions, history, addMessage };
}

