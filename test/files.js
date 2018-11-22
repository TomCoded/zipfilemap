'use strict'

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const zipfilemap = require('../')({});

const filesInZip = [ 'quote1', 'quote2', 'binaryData' ];
const filePath = path.join(__dirname, 'fixtures', 'threeFiles.zip');
let zipBuffer;

beforeEach('', () => {
    zipBuffer = fs.readFileSync(filePath);
})

describe('local file tests', () => {

    it('should unzip local file to memory', async () => {
	let dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
	assert(dictOfFiles);
    });

    it('should unzip local file with the right number of entries', async () => {
	let dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
	assert.strictEqual(Object.keys(dictOfFiles).length,filesInZip.length);
    });

    it('should unzip local file to entries that match zipped files', async () => {
	let dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
	Object.values(filesInZip).forEach((filename)=>{
	    assert(filename in dictOfFiles);
	})
    });

    it('should have matching contents between zipped files and originals', async () => {
	let dictOfFiles = await zipfilemap.fromBuffer(zipBuffer);
	Object.values(filesInZip).forEach((filename)=>{
	    let originalFile = fs.readFileSync(path.join(__dirname, 'fixtures', filename));
	    let originalFileData = originalFile.toString();
	    assert(originalFileData === dictOfFiles[filename]);
	})
    });
});
