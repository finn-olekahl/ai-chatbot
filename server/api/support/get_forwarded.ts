import { DocumentData } from 'firebase-admin/firestore';
import { firestoreAdmin } from '~/server/utils/firebase';

export default defineEventHandler(async () => {
    const chatRef = firestoreAdmin.collection('chats');
    const forwardedChatsSnapshot = await chatRef.where('forwarded', '==', true).get();

    const forwardedChats: DocumentData[] = [];
    forwardedChatsSnapshot.forEach(doc => {
        forwardedChats.push(doc.data());
    });

    return forwardedChats;
});