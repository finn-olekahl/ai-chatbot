import { firestoreAdmin } from '~/server/utils/firebase';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    try {      
        let id = uuidv4();
        const ref = firestoreAdmin.doc(`chats/${id}`);
        const data = await readBody(event);

        const docRef = await ref.set({
            ...data,
            timestamp: new Date().toISOString()

        })
        return { result: id };
    } catch (error: any) {
        return { error: error.message }
    } 
});