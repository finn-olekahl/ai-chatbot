import { storage } from '~/server/utils/firebase';
import { IncomingForm } from 'formidable';

export default defineEventHandler(async (event) => {
    const form = new IncomingForm();
    const bucket = storage.bucket("gs://bugland-chatbot.appspot.com");

    try {
        const result = await new Promise((resolve, reject) => {
            form.parse(event.req, (err, fields, files) => {
                if (err) {
                    console.error('Error parsing the form: ', err);
                    reject({ statusCode: 500, error: 'Server Error' });
                    return;
                }

                const file = files.file![0];
                if (!file) {
                    reject({ statusCode: 400, error: 'No file uploaded' });
                    return;
                }

                const blob = bucket.file(`images/${file.originalFilename}`);
                const stream = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype || undefined,
                    }
                });

                stream.on('error', (error) => {
                    console.error('Failed to upload file:', error);
                    reject({ statusCode: 500, error: 'Error uploading file' });
                });

                stream.on('finish', () => {
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve({ url: publicUrl });
                });

                stream.end(file.filepath);
            });
        });

        // Send the response
        return result;
    } catch (error) {
        console.error('Error handling request:', error);
        // Send an appropriate error response
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
    }
});
