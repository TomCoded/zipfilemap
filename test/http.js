'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const zipfilemap = require('../')({});
require('./fixtures/nockZipFiles.js');

const request = require('request');

function makeFixturePath(filename) {
    return path.join(__dirname, 'fixtures', filename);
}

function makeFixtureURL(filename) {
    return 'http://localhost/' + filename;
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

const badFile = {
    path: makeFixturePath('binaryData'),
};

let zipBuffer;

function requestPromise(url) {
    return new Promise((resolve, reject) => {
        request({uri: url, encoding: null}, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                //resolve(response);
                resolve(body);
            }
        });
    });
}

it('should open url of file', async () => {
    let url = goodFiles.threeFiles.url;
    const p1 = await requestPromise(url);
    const dictOfFiles = await zipfilemap.fromLink({uri: url});
    assert(dictOfFiles);
});

function checkGoodLink(file, description) {
    let dictOfFiles;
    describe(description, () => {
	beforeEach('opening remote file', async () => {
	    dictOfFiles = await zipfilemap.fromLink({uri: file.url});
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

Object.values(goodFiles).forEach((file, key) => {
    checkGoodLink(file, 'tests on good file or link ' + file.path);
});

// describe('local file tests on bad file', () => {
//     beforeEach('', () => {
// 	zipBuffer = fs.readFileSync(badFile.path);
//     });

//     it('should fail to unzip random local file to memory', async () => {
//         assert.rejects(zipfilemap.fromBuffer(zipBuffer), /end of central directory record signature not found/);
//     });

// });

