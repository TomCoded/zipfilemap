'use strict';

const yauzl = require('yauzl');
const request = require('request');

module.exports = function zipfilemap(moduleOptions = {}) {
    const module = {
        fromLink: fromLink,
        fromBuffer: unpackZippedBuffer,
        options: moduleOptions,
    };

    module.options = module.options || {};
    module.options.streaming = module.options.streaming || false;

    async function fromLink(options) {
        options.encoding = null;
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(unpackZippedBuffer(body));
                }
            });
        });
    }

    async function unpackZippedBuffer(zipBuffer) {
        const options = null;
        const result = {};
        let errors = false;
        let entriesProcessed = 0;
        return new Promise((resolve, reject) => {
            yauzl.fromBuffer(zipBuffer, options, (err, zipfile) => {
                if (err) {
                    errors += 1;
                    return reject(err);
                }
                zipfile.on('entry', (entry) => {
                    if (/\/$/.test(entry.fileName)) {
                        entriesProcessed += 1;
                        if (!errors && entriesProcessed === zipfile.entryCount) {
                            return resolve(result);
                        }
                    } else {
                        zipfile.openReadStream(entry, (errOpenRS, readStream) => {
                            if (errOpenRS) {
                                errors += 1;
                                return reject(errOpenRS);
                            }
                            if (module.options.streaming) {
                                result[entry.fileName] = readStream;
                                entriesProcessed += 1;
                                if (!errors && entriesProcessed === zipfile.entryCount) {
                                    return resolve(result);
                                }
                                return null;
                            }
                            readStream.on('end', () => {
                                entriesProcessed += 1;
                                if (!errors && entriesProcessed === zipfile.entryCount) {
                                    return resolve(result);
                                }
                                return null;
                            });
                            readStream.on('error', (errRS) => {
                                errors += 1;
                                return reject(errRS);
                            });
                            readStream.on('data', (data) => {
                                result[entry.fileName] = result[entry.fileName] || '';
                                result[entry.fileName] += data.toString();
                            });
                            return null;
                        });
                    }
                });
                zipfile.on('end', (zerr) => {
                    if (zerr) {
                        errors += 1;
                        return reject(err);
                    }
		    if(zipfile.entryCount === 0) {
			return resolve(result);
		    }
                    return null;
                });
                zipfile.on('error', (zerr) => {
                    errors += 1;
                    return reject(zerr);
                });
                return null;
            });
        });
    }

    return module;
};
