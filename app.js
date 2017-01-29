var config = require('./config');
var path = require('path');
var express = require('express');
var session = require('express-session');
var apiRouter = require('./api_router');
var webRouter = require('./web_router');
var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var compress = require('compression');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var dict = require('./resources/dic/data.json');
var cors = require('cors');
var logger = require('./common/logger').logger('app');
var swig = require('./common/swig');
var expressLess = require('express-less');
var helmet = require('helmet');
var flash = require('connect-flash');

if (!config.debug) {
  require('oneapm');
}

// 静态文件目录
var staticDir = path.join(__dirname, 'public');

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.engine('html', swig.renderFile);
app.enable('trust proxy');

// 静态资源
app.use('/stylesheets', expressLess(__dirname + '/public/stylesheets', { compress: true }));
app.use('/public', express.static(staticDir));

app.use(helmet.frameguard('sameorigin'));
app.use(require('response-time')());

// configure upload middleware

app.use(bodyParser.join());

app.use(bodyParser.urlencoded({
  extended: true    //use qs library
}));
app.use(require('method-override')('_method'));
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
  secret: config.session_secret,
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host,
  }),
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = req.flash();
  next();
});

// custom middleware
//app.use(auth.authUser);

if (!config.debug) {
  app.set('view cache', true);
}

// set static, dynamic helpers
_.extend(app.locals, {
  config: config
});

_.extend(app.locals, require('./common/render_helper'));
if (!_.isEmpty(dict)) {
  _.extend(app.locals, {dict: dict});
}

// routes
app.use('/API', cors(), apiRouter);
app.use('/', webRouter);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    console.error('server 500 error:', err);
    return res.status(500).send('500 status');
  });
}

app.listen(config.port, function () {
  logger.info("node-meeting listening on port %d", config.port);
  logger.info("You can debug your app with http://" + config.hostname + ':' + config.port);
});

module.exports = app;
