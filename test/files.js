'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const zipfilemap = require('../')({});

function makeFixturePath(filename) {
    return path.join(__dirname, 'fixtures', filename);
}

const badFile = {
    path: makeFixturePath('binaryData'),
};

let zipBuffer;

describe('local file tests on bad file', () => {
    beforeEach('', () => {
	zipBuffer = fs.readFileSync(badFile.path);
    });

    it('should fail to unzip random local file to memory', async () => {
        assert.rejects(zipfilemap.fromBuffer(zipBuffer), /end of central directory record signature not found/);
    });

});

