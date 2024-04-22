import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    //const { email, name } = await readBody(event);

    let transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.strato.de",
        port: 465,
        secure: true, // use TLS
        auth: {
          user: "contact@nordify.one",
          pass:  "yBQgGb%f6PjU@5mSvtByvtn*nr2buPVi",
        },
      });

    let mailOptions = {
        from: "contact@nordify.one",
        to: "contact@nordify.one",
        subject: 'Hello ' + "Hello",
        text: 'This is a test email from Nuxt app'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return {
        message: 'Email sent'
    }

});