import { firestoreAdmin } from '~/server/utils/firebase';

export default defineEventHandler(async (event) => {
    try {     
        const data = await readBody(event);
        let id = data.id;

        const ref = firestoreAdmin.doc(`chats/${id}`);
        await ref.set({
            id: id,
            forwarded: true,
            forward_reason: data.reason,
            chatlog: data.chatlog,
            timestamp: new Date().toISOString()
        });
        
        return { result: id };
    } catch (error: any) {
        return { error: error.message }
    } 
});