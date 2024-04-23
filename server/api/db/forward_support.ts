import { firestoreAdmin } from '~/server/utils/firebase';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    try {     
        const data = await readBody(event);
        let id = data.id;

        const ref = firestoreAdmin.doc(`chats/${id}`);
        await ref.set({
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