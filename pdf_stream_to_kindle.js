const nodemailer = require('nodemailer');
const logger = require('./logger');

const pdf_stream_to_kindle = async ({ stream, filename }, emailConfig, kindle_email) => {
    if (!stream) {
        return false;
    }

    const transporter = nodemailer.createTransport({
        host: emailConfig.SMTP_HOST,
        port: emailConfig.SMTP_PORT,
        secure: false,
        auth: {
            user: emailConfig.SENDER_ADDRESS,
            pass: emailConfig.SENDER_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    logger.info(`Sending (${filename}) to (${kindle_email})`);

    return await transporter.sendMail({
        from: emailConfig.SENDER_ADDRESS,
        to: kindle_email,
        subject: `Sending ${filename}`,
        text: `Attached, ${filename}`,
        attachments: [
            {
                filename: filename,
                content: stream
            }
        ]
    })
        .then(result => result)
        .catch(err => {
            logger.error(`PDF (${filename}) wasn't sent to (${kindle_email}) because of (${err})`);

            return false;
        });
};

module.exports = pdf_stream_to_kindle;
