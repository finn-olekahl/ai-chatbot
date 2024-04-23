import { firestoreAdmin } from '~/server/utils/firebase';

export default defineEventHandler(async () => {
    const chatRef = firestoreAdmin.collection('chats');
    const forwardedChatsSnapshot = await chatRef.where('forwarded', '==', true).get();

    const forwardedChats: string[] = [];
    forwardedChatsSnapshot.forEach(doc => {
        forwardedChats.push(doc.id);
    });

    return forwardedChats;
});