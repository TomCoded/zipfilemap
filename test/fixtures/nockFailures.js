const nock = require('nock');

nock('http://localhost:80')
    .get('/404')
    .reply(404)
    .persist();

nock('http://localhost:80')
    .get('/500')
    .reply(500, '500')
    .persist();
