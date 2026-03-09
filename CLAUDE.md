# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Test:** `npm test` (runs mocha)
- **Run single test:** `npx mocha test/test.js` or `npx mocha test/require.js`
- **Lint:** `npm run lint`
- **Lint with autofix:** `npm run lint-fix`

## Architecture

This is a small Node.js library (`zipfilemap.js`) that fetches zip files from URLs or Node.js Buffers and unpacks them into JavaScript objects (filename → content string).

The module exports a factory function. Call it to get an instance with two methods:
- `fromLink(options)` — fetches a zip from a URL via `request`, then delegates to `fromBuffer`
- `fromBuffer(zipBuffer, options)` — uses `yauzl` to unzip a Buffer into a `{ filename: content }` dictionary. Supports a `streaming` option that returns raw read streams instead of strings.

Both methods return Promises. Entry resolution is tracked by counting processed entries against `zipfile.entryCount`.

## Testing

Tests use mocha with `nock` for HTTP mocking. Test fixtures live in `test/fixtures/`:
- `nockZipFiles.js` — mocks HTTP responses for zip files (persisted nock interceptors)
- `nockFailures.js` — mocks 404/500 responses
- Zip files and raw fixture files used for content comparison

## Code Style

ESLint extends `airbnb-base` with these notable overrides:
- 4-space indentation
- `'use strict'` required (sourceType: script)
- Max line length: 120
- Named function expressions required (`func-names: always`)
- Trailing commas on multiline (except function params)
