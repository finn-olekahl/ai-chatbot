export const useChat = () => {

    const saveChat = async (chatlog: [], id?: string) => {
        try {
            const data: { result: string } = await $fetch("/api/db/save_support", {
                method: "POST",
                body: JSON.stringify({ chatlog: chatlog, id: id }),
            });

            return data.result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const loadChat = async (id: string) => {
        try {
            const data: { chatlog: [] } = await $fetch("/api/db/get_support", {
                method: "POST",
                body: JSON.stringify({ id: id }),
            });

            return data.chatlog;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    return { saveChat, loadChat };
}