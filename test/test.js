'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const zipfilemap = require('../')({});
require('./fixtures/nockZipFiles.js');
require('./fixtures/nockFailures.js');


function makeFixturePath(filename) {
    return path.join(__dirname, 'fixtures', filename);
}

function makeFixtureURL(filename) {
    return `http://localhost/${filename}`;
}

const goodFiles = {
    threeFiles: {
        name: 'threeFiles',
        path: makeFixturePath('threeFiles.zip'),
        url: makeFixtureURL('threeFiles.zip'),
        filesInZip: [ 'quote1', 'quote2', 'binaryData' ],
    },
    dirOnlyPath: {
        name: 'dirOnlyPath',
        path: makeFixturePath('dirOnly.zip'),
        url: makeFixtureURL('dirOnly.zip'),
        filesInZip: [ ],
    },
    dirWithFilePath: {
        name: 'dirWithFilePath',
        path: makeFixturePath('dirWithFile.zip'),
        url: makeFixtureURL('dirWithFile.zip'),
        filesInZip: [ 'dirWithFile/quote3' ],
    },
    emptyDirPlusPath: {
        name: 'emptyDirPlusPath',
        path: makeFixturePath('emptyDirPlus.zip'),
        url: makeFixtureURL('emptyDirPlus.zip'),
        filesInZip: [ 'quote1', 'quote2', 'binaryData' ],
    },
    emptyZip: {
        name: 'empty',
        url: makeFixtureURL('empty.zip'),
        path: makeFixturePath('empty.zip'),
        filesInZip: [],
    },
};

const badFiles = {
    binaryData: {
        name: 'randomBinaryData',
        path: makeFixturePath('binaryData'),
        filesInZip: [],
    },
    404: {
        name: '404',
        url: makeFixtureURL('404'),
        status: 404,
    },
    500: {
        name: '500',
        url: makeFixtureURL('500'),
        status: 500,
    },
};

function checkGoodZip(file, description, isLink) {
    let dictOfFiles;
    describe(description, () => {
        beforeEach('opening file', async () => {
            if (isLink) {
                dictOfFiles = await zipfilemap.fromLink({ uri: file.url });
            } else {
                const zipBuffer = fs.readFileSync(file.path);
                dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
            }
        });

        it('should unzip file to memory', async () => {
            assert(dictOfFiles);
        });

        it('should unzip file with the right number of entries', async () => {
            assert.strictEqual(Object.keys(dictOfFiles).length, file.filesInZip.length);
        });

        it('should unzip file to entries that match zipped files', async () => {
            Object.values(file.filesInZip).forEach((filename) => {
                assert(filename in dictOfFiles);
            });
        });

        it('should have matching contents between zipped files and originals', async () => {
            Object.values(file.filesInZip).forEach((filename) => {
                const originalFile = fs.readFileSync(makeFixturePath(filename));
                const originalFileData = originalFile.toString();
                assert(originalFileData === dictOfFiles[filename]);
            });
        });
    });
}

Object.values(goodFiles).forEach((file) => {
    const isLink = true;
    checkGoodZip(file, `tests on good mocked url ${file.url}`, isLink);
    checkGoodZip(file, `tests on good local file ${file.path}`);
});


it('should fail to fetch un-mocked file', async () => {
    const file = {
        url: 'http://localhost/unnockedfile.zip',
    };
    await assert.rejects(zipfilemap.fromLink({ uri: file.url }), /No match for request/);
});

async function checkBadZip(file, description, expectedError, isLink) {
    it(description, async () => {
        if (isLink) {
            assert.rejects(zipfilemap.fromLink({ uri: file.url }), expectedError);
        } else {
            const zipBuffer = fs.readFileSync(file.path);
            assert.rejects(zipfilemap.fromBuffer(zipBuffer), expectedError);
        }
    });
}

describe('test failure cases', () => {
    Object.values(badFiles).forEach((file) => {
        if ('url' in file) {
            const isLink = true;
            checkBadZip(file, `tests on bad mocked url ${file.url}`, /end of central directory/, isLink);
        }
        if ('path' in file) {
            checkBadZip(file, `tests on bad local file ${file.path}`, /end of central directory/);
        }
    });
});
