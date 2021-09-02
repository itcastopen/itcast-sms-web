// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('request')

const urls = {
    development: 'http://localhost:8770',
}

const poxy = Object.entries(urls).reduce((obj, [key, target]) => {
	obj[`/${key}`] = {
		target,
		changeOrigin: true,
		pathRewrite: {
			[`^/${key}`]: '/'
		},
		cookieDomainRewrite: {
      '*': ''
    }
	}
	return obj
}, {})

module.exports = {
  proxy: poxy,
  open: true,
  port: 8080,
  before (app) {
    app.all('/localhttp/*', function (req, res) {
      req.pipe(request({
        method: req.method,
        url: req.headers.localhttp.replace(/(localhost|127\.0\.0\.1|0\.0\.0\.0)/, req.ip),
				headers: req.headers
      })).pipe(res)
    })
  }
}
