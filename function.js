const https = require('https');
const url = require('url');

module.exports = (context, req) => {
  const dropboxUrlParam = req.query.dropboxUrl;

  if (!dropboxUrlParam || !dropboxUrlParam.startsWith('https://www.dropbox.com/')) {
    context.res = {
      body: {
        error: 'Forbidden'
      },
      status: 403
    };
    context.done();
    return;
  }

  const dropboxUrl = url.parse(dropboxUrlParam);
  const dropboxUrlPath = dropboxUrl.path;
  const dropboxUrlPathParts = dropboxUrlPath.split('/');
  const dropboxUrlRawPath = [dropboxUrlPathParts[1], 'raw', dropboxUrlPathParts[2], dropboxUrlPathParts[3]].join('/');

  https.get(`https://${dropboxUrl.hostname}/${dropboxUrlRawPath}`, function (result) {
    let headers = {};

    headers['location'] = result.headers['location'];

    headers['access-control-allow-origin'] = '*';

    context.res = {
      body: null,
      headers: headers,
      status: 302
    };
    context.done();
  });
};