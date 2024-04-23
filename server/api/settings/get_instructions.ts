export default defineEventHandler(async () => { 
    try {      
        const ref = firestoreAdmin.doc(`settings/instructions`);
        const snapshot = await ref.get();
        const data = snapshot.data();
        return data;
    } catch (error: any) {
        return { error: error.message }
    } 
})