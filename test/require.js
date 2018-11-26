'use strict';

const assert = require('assert');

describe('module loading', async () => {
    it('should work with require and no parameters.', async () => {
        /* eslint-disable global-require */
        assert(require('../'));
        /* eslint-enable global-require */
    });
});
