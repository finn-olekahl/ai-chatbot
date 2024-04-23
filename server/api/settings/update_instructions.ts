import { firestoreAdmin } from '~/server/utils/firebase';

export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event);     
        const ref = firestoreAdmin.doc(`settings/instructions`);

        await ref.set({
            standard: data.standard,
            faq: data.faq,
        });
        
        return { result: "success" };
    } catch (error: any) {
        return { error: error.message }
    } 
});