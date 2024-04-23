import { firestoreAdmin } from '~/server/utils/firebase';

export default defineEventHandler(async (event) => {
    const docId = event?.context?.params?.id; 

    event.node.res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const ref = firestoreAdmin.doc(`chats/${docId}`);

    const unsubscribe = ref.onSnapshot(docSnapshot => {
        if (docSnapshot.exists) {
            if (docSnapshot?.data()?.forwarded != true) return;
            event.node.res.write(`data: ${JSON.stringify(docSnapshot.data())}\n\n`);
        } else {
            event.node.res.write('data: null\n\n');
        }
    }, error => {
        event.node.res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    });

    // Clean up when connection is closed by the client
    event.node.res.on('close', () => {
        unsubscribe();
        event.node.res.end();
    });
});