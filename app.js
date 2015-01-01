
/**
 * Module dependencies.
 */

var express = require('express');
var	http = require('http');
var	path = require('path');
var	MongoStore = require('connect-mongo')(express);
var	settings = require('./settings');
var	router = require('./router');
var	app = express();

// 服务器端口
app.set('port', process.env.PORT || 3000);
// 前端文件夹
app.set('views', __dirname + '/views');
// 前端模板引擎
app.set('view engine', 'ejs');
// 网站图标
app.use(express.favicon());
// 开发状态
app.use(express.logger('dev'));
// 解析post数据
app.use(express.bodyParser());
// 支持定制的http方法
app.use(express.methodOverride());
// cookie
app.use(express.cookieParser());
// session
app.use(express.session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db
	})
}));
// 项目路由支持
app.use(app.router);
// 静态文件支持
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// 项目的路由
router(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
