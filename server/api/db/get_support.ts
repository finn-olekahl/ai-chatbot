export default defineEventHandler(async (event) => { 
    try {      
        const body = await readBody(event);

        const ref = firestoreAdmin.doc(`chats/${body.id}`);
        const snapshot = await ref.get();
        const data = snapshot.data();
        return data;
    } catch (error: any) {
        return { error: error.message }
    } 
})