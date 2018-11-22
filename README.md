# zipfilemap

[![Build Status](https://travis-ci.org/TomCoded/zipfilemap.svg?branch=master)](https://travis-ci.org/TomCoded/zipfilemap)
<!--- [![Coverage Status](https://img.shields.io/coveralls/TomCoded/zipfilemap.svg)](https://coveralls.io/r/TomCoded/zipfilemap) --->

Zipfilemap maps zip file from buffers to JavaScript dictionaries for easy use of the contained file data.

## Usage Examples

```js
var zipfilemap = require("zipfilemap");

const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'mydirector', 'myfilename.zip');

const zipBuffer = fs.readFileSync(filePath);

async myTestFunction() {
      zipDict = await zipfilemap.fromBuffer(zipBuffer);
      Object.keys(zipDict).forEach((key)=>{
	console.log("zipFile contains file " + key + " which has a file with contents " + zipDict[key]);
      });
}
```


