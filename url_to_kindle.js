const url_to_pdf_stream = require('./url_to_pdf_stream');
const pdf_stream_to_kindle = require('./pdf_stream_to_kindle');

const url_to_kindle = async (url, email_config, kindle_email) => {
    const pdf_stream = await url_to_pdf_stream(url);
    if (!pdf_stream) {
        return pdf_stream;
    }

    const sent_to_kindle = await pdf_stream_to_kindle(pdf_stream, email_config, kindle_email);

    return sent_to_kindle;
};

module.exports = url_to_kindle;
