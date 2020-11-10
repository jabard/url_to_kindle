const { Readability } = require('./mozilla/readability/index.js');
const { JSDOM } = require('jsdom');
const logger = require('./logger');
const html_pdf = require('html-pdf-chrome');

const url_to_pdf_stream = async (url) => {
    logger.info(`Downloading (${url})`);

    let article = {};

    try {
        const dom = await JSDOM.fromURL(url);
        const doc = new JSDOM(dom.serialize());
        const reader = new Readability(doc.window.document);
        article = reader.parse();
    } catch (e) {
        logger.error(`URL (${url}) caused (${e.message})`);

        return false;
    }

    if (!article || !article.title || !article.content) {
        logger.error(`URL (${url}) produced a bad object`);

        return false;
    }

    const style = `
      <style>
        body {
          font-size: 160%;
          padding: 0;
        }
        figure {
          border: 1px black;
          border-style: dashed;
          text-align: center;
        }
        figcaption {
          text-align: center;
          font-style: italic;
        }
      </style>
    `;
    const title = article.title;
    const content = `${style} ${article.content}`;
    const options = {
        printOptions: {
          displayHeaderFooter: true,
          headerTemplate: `
            <div class="text center" style="font-size: 14px; font-weight: 700;">
              ${title}
            </div>
          `,
          footerTemplate: `
            <div class="text center" style="font-weight: 700;">
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
          `
        }
    };

    logger.info(`Extracting PDF stream for (${title})`);

    return await html_pdf
        .create(content, options)
        .then(pdf => ({
            stream: pdf.toStream(),
            filename: `${title}.pdf`
        }))
        .catch(err => {
            logger.error(`URL (${url}) didn't convert to stream because of (${err})`);

            return false;
        })
};

module.exports = url_to_pdf_stream;
