import type { Message } from '~/types';

export const useChat = () => {

    const saveChat = async (chatlog: Message[], id?: string) => {
        try {
            const data: { result: string } = await $fetch("/api/db/save_support", {
                method: "POST",
                body: JSON.stringify({ chatlog: chatlog, id: id}),
            });

            return data.result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const saveUnsolvedChat = async (chatlog: Message[], id: string, reason: string) => {
        try {
            const data: { result: string } = await $fetch("/api/db/save_unsolved", {
                method: "POST",
                body: JSON.stringify({ chatlog: chatlog, id: id, reason: reason }),
            });

            return data.result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const loadChat = async (id: string) => {
        try {
            const data: { chatlog: Message[], forwarded?: boolean } = await $fetch("/api/db/get_support", {
                method: "POST",
                body: JSON.stringify({ id: id }),
            });

            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const forwardChat = async (chatlog: Message[], id: string, reason: string) => {
        try {
            const data: { result: string } = await $fetch("/api/db/forward_support", {
                method: "POST",
                body: JSON.stringify({ chatlog: chatlog, id: id, reason: reason}),
            });

            return data.result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    return { saveChat, saveUnsolvedChat, loadChat, forwardChat };
}