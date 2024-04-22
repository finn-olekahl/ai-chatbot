import { firestoreAdmin } from '~/server/utils/firebase';

export default defineEventHandler(async (event) => {
    try {     
        const data = await readBody(event);
        const id = data.id;
        const reason = data.reason;
        const ref = firestoreAdmin.doc(`unsolved_chats/${id}`);

        await ref.set({
            reason: reason,
            chatlog: data.chatlog,
            timestamp: new Date().toISOString()
        });
        
        return { result: id };
    } catch (error: any) {
        return { error: error.message }
    } 
});