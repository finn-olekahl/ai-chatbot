import { firestoreAdmin } from '~/server/utils/firebase';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    try {     
        const data = await readBody(event);
        let id = data.id ? data.id : crypto.randomBytes(5).toString('hex');
        const ref = firestoreAdmin.doc(`chats/${id}`);

        if (data.id) {
            await ref.update({
                chatlog: data.chatlog,
                timestamp: new Date().toISOString(),
                forwarded: data.forwarded,
                forward_reason: data.forward_reason
            });
        } else {
            await ref.set({
                chatlog: data.chatlog,
                timestamp: new Date().toISOString(),
                forwarded: data.forwarded,
                forward_reason: data.forward_reason
            });
        }
        
        return { result: id };
    } catch (error: any) {
        return { error: error.message }
    } 
});