export const useSettings = () => {

    const getInstructions = async () => {
        try {
            const data: {standard: string, faq: {}} = await $fetch("/api/settings/get_instructions");
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const updateInstructions = async (standard: string, faq: {}) => {
        try {
            const data: { result: string } = await $fetch("/api/settings/update_instructions", {
                method: "POST",
                body: JSON.stringify({ standard: standard, faq: faq }),
            });

            return data.result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    return { getInstructions, updateInstructions };
}