/* global process */
/* eslint no-console: 0 */

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import { watch } from 'rollup';
import rollupConfig from './rollup.config.mjs';

import express from 'express';
import proxy from 'express-http-proxy';
const app = express();

app.use('/v1', proxy('localhost:3000'));
app.use(express.static(path.resolve(__dirname, 'dist')));
app.get('/favicon.con', (req, res) => {
  res.status(200);
  res.send('');
});
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'), {
    lastModified: false,
    cacheControl: false,
  });
});

(async () => {

  var server = app.listen(
    process.env.PORT || 4000,
    process.env.HOST || '0.0.0.0',
    function () {
      console.log(`Server listening at http://127.0.0.1:${this.address().port} in ${app.settings.env} mode`);
    },
  );


  const watcher = await watch(rollupConfig);

  watcher.on('event', (event) => {
    if (event.result) event.result.close();
    // console.log(event.code);
    if (event.code === 'BUNDLE_START') {
      console.log('Starting bundle...');
    }
    if (event.code === 'BUNDLE_END') {
      console.log('Finished bundle.');
    }
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //                  * event.input will be the input options object if present
    //                  * event.output contains an array of the "file" or
    //                    "dir" option values of the generated outputs
    //   BUNDLE_END   — finished building a bundle
    //                  * event.input will be the input options object if present
    //                  * event.output contains an array of the "file" or
    //                    "dir" option values of the generated outputs
    //                  * event.duration is the build duration in milliseconds
    //                  * event.result contains the bundle object that can be
    //                    used to generate additional outputs by calling
    //                    bundle.generate or bundle.write. This is especially
    //                    important when the watch.skipWrite option is used.
    //                  You should call "event.result.close()" once you are done
    //                  generating outputs, or if you do not generate outputs.
    //                  This will allow plugins to clean up resources via the
    //                  "closeBundle" hook.
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    //                  * event.error contains the error that was thrown
    //                  * event.result is null for build errors and contains the
    //                    bundle object for output generation errors. As with
    //                    "BUNDLE_END", you should call "event.result.close()" if
    //                    present once you are done.

    if (event.code === 'ERROR') console.error(event.error.formatted || event.error.message);
  });

  async function shutdown () {
    watcher.close();

    var closed = new Promise((resolve) => server.on('close', resolve));
    server.close();

    await closed;

    console.log('Server halted.');

    var promises = [];
    process.emit('graceful stop', promises);

    await Promise.allSettled(promises);
    console.log('Shutdown');
    process.exit();
  }

  process.on('SIGUSR2', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  process.on('uncaughtException', (err) => {
    console.error(err, 'Encountered an unhandled exception error, restarting process');
    process.exit(-1);
  });

})().catch(console.error);
