module.exports = function(app){
	var route_path = './routes/';

	//首页路由
	app.get('/', require(route_path+'index'));
	//注册页面路由
	app.get('/regist', require(route_path+'regist').get);
	app.post('/regist', require(route_path+'regist').post);
	//登录页面路由
	app.get('/login', require(route_path+'login').get);
	app.post('/login', require(route_path+'login').post);
	//登出页面路由
	app.get('/logout', require(route_path+'logout'));
	//个人blog路由
	app.get('/blog/new', require(route_path+'blog').new);
	//编辑文字
	app.get('/blog/edit/:_id', require(route_path+'blog').edit);
	//转载文字
	app.get('/blog/reserved/:_id', require(route_path+'blog').reserved);
	//删除文字
	app.post('/blog/del/:_id', require(route_path+'blog').del);
	//喜欢
	app.post('/blog/love/:_id', require(route_path+'blog').love);
	//推荐
	app.post('/blog/recommend/:_id', require(route_path+'blog').recommend);
	//评论
	app.post('/blog/comment/:_id', require(route_path+'blog').comment);
	//评论删除
	app.post('/blog/delComment/:_id', require(route_path+'blog').delComment);
	//保存文字
	app.post('/blog/save', require(route_path+'blog').save);
	//个人博文路由
	app.get('/bowen', require(route_path+'bowen').showlist);
	//文字详情
	app.get('/bowen/detail/:_id', require(route_path+'bowen').detail);
	//喜欢的博文列表
	app.get('/love/:_id', require(route_path+'love'));
}