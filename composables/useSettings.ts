export const useSettings = () => {

    const getPrompt = async () => {
        try {
            const data: {standard: string, faq: {}} = await $fetch("/api/settings/get_prompt");
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const updatePrompt = async (standard: string, faq: {}) => {
        try {
            const data: { result: string } = await $fetch("/api/settings/update_prompt", {
                method: "POST",
                body: JSON.stringify({ standard: standard, faq: faq }),
            });

            return data.result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    return { getPrompt, updatePrompt };
}