# zipfilemap

[![Build Status](https://travis-ci.org/TomCoded/zipfilemap.svg?branch=master)](https://travis-ci.org/TomCoded/zipfilemap)
[![Coverage Status](https://img.shields.io/coveralls/TomCoded/zipfilemap.svg)](https://coveralls.io/r/TomCoded/zipfilemap)

Zipfilemap maps a zipfiles from URLs or buffers to JavaScript dictionaries.

## Installation

```
npm i zipfilemap
```

## Usage Examples

### Read the contents of a zipfile into a JavaScript dictionary
```js
const zipfilemap = require('zipfilemap');
const fs = require('fs');

const zipBuffer = fs.readFileSync('/path/to/myfile.zip');

async function myTestFunction() {
      zipDict = await zipfilemap.fromBuffer(zipBuffer);
      
      Object.keys(zipDict).forEach((key)=>{
	console.log("zipFile contains file " + key + " which has a file with contents " + zipDict[key]);
      });
}
```

### Read a zipfile from the web into a JavaScript dictionary
```js
const zipfilemap = require("zipfilemap");

async function myTestFunction() {
      options = {
        uri: 'http://localhost/test.zip'
      }
      zipDict = await zipfilemap.fromLink(options);
      
      Object.keys(zipDict).forEach((key)=>{
	console.log("zipFile contains file " + key + " which has a file with contents " + zipDict[key]);
      });
}
```