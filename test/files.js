'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const zipfilemap = require('../')({});

function makeFixturePath(filename) {
    return path.join(__dirname, 'fixtures', filename);
}

const goodFiles = {
    threeFiles: {
	name: 'threeFiles',
	path: makeFixturePath('threeFiles.zip'),
	filesInZip: [ 'quote1', 'quote2', 'binaryData' ],
    },
    dirOnlyPath: {
	name: 'dirOnlyPath',
	path: makeFixturePath('dirOnly.zip'),
	filesInZip: [ ],
    },
    dirWithFilePath: {
	name: 'dirWithFilePath',
	path: makeFixturePath('dirWithFile.zip'),
	filesInZip: [ 'quote3' ],
    },
    emptyDirPlusPath: {
	name: 'emptyDirPlusPath',
	path: makeFixturePath('emptyDirPlus.zip'),
	filesInZip: [ 'quote1', 'quote2' ],
    },
};

const badFile = {
    path: makeFixturePath('binaryData'),
};

let zipBuffer;

function checkGoodFile(file) {
    describe('local file tests on good file', () => {
	beforeEach('', () => {
	    zipBuffer = fs.readFileSync(file.path);
	});

	it('should unzip local file to memory', async () => {
            const dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
            assert(dictOfFiles);
	});

	it('should unzip local file with the right number of entries', async () => {
            const dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
            assert.strictEqual(Object.keys(dictOfFiles).length, file.filesInZip.length);
	});

	it('should unzip local file to entries that match zipped files', async () => {
            const dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
            Object.values(file.filesInZip).forEach((filename) => {
		assert(filename in dictOfFiles);
            });
	});

	it('should have matching contents between zipped files and originals', async () => {
            const dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
            Object.values(file.filesInZip).forEach((filename) => {
		const originalFile = fs.readFileSync(makeFixturePath(filename));
		const originalFileData = originalFile.toString();
		assert(originalFileData === dictOfFiles[filename]);
            });
	});
    });
}

Object.values(goodFiles).forEach((file) => {
    checkGoodFile(file);
});

describe('local file tests on bad file', () => {
    beforeEach('', () => {
	zipBuffer = fs.readFileSync(badFile.path);
    });

    it('should fail to unzip random local file to memory', async () => {
        assert.rejects(zipfilemap.fromBuffer(zipBuffer), /end of central directory record signature not found/);
    });

});

