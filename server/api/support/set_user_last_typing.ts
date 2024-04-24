import { firestoreAdmin } from '~/server/utils/firebase';

export default defineEventHandler(async (event) => {
    try {     
        const data = await readBody(event);
        let id = data.id;
        let reset = data.reset;

        const ref = firestoreAdmin.doc(`chats/${id}`);
        await ref.update({
            user_last_typing: reset == true ? 0 : Date.now()
        });
        
        return { result: "success" };
    } catch (error: any) {
        return { error: error.message }
    } 
});