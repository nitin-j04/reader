const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/Production',
    createProxyMiddleware({
      target: 'https://ksdcu1y80a.execute-api.ap-south-1.amazonaws.com',
      changeOrigin: true,
    })
  );
     app.use(
    '/Production/ocr',
    createProxyMiddleware({
      target: 'https://ksdcu1y80a.execute-api.ap-south-1.amazonaws.com',
      changeOrigin: true,
    })
  );

};