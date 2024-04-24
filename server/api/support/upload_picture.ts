import { storage } from '~/server/utils/firebase';
import { IncomingForm } from 'formidable';
import * as fs from 'fs'; // Import filesystem module to access file streams

export default defineEventHandler(async (event) => {
    const form = new IncomingForm();
    const bucket = storage.bucket("gs://bugland-chatbot.appspot.com");

    try {
        const result = await new Promise((resolve, reject) => {
            form.parse(event.node.req, (err, fields, files) => {
                if (err) {
                    console.error('Error parsing the form:', err);
                    reject({ statusCode: 500, error: 'Server Error' });
                    return;
                }

                // Assuming the file is the first and only upload
                const file = files.file && files.file.length > 0 ? files.file[0] : null;
                if (!file) {
                    reject({ statusCode: 400, error: 'No file uploaded' });
                    return;
                }

                const filename = Date.now()

                const blob = bucket.file(`images/${filename}`);
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype || 'application/octet-stream', // Default to binary type if mimetype is undefined
                    },
                });

                blobStream.on('error', (error) => {
                    console.error('Failed to upload file:', error);
                    reject({ statusCode: 500, error: 'Error uploading file' });
                });

                blobStream.on('finish', async () => {
                    const public_url = await blob.getSignedUrl({
                            action: 'read',
                            expires: '03-09-2491' // Use a far future date or configure as necessary
                    });
                    resolve({ url: public_url[0] });
                });

                // Create a read stream for the uploaded file
                const fileReadStream = fs.createReadStream(file.filepath);
                fileReadStream.pipe(blobStream); // Pipe the read stream to the write stream
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
