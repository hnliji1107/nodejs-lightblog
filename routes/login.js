var util = require('./widget/util');
var	user = require('../models/user');

exports.get = function(req, res) {
	if (req.session.user) {
		res.redirect('/');
	}
	else {
		res.render('login', {
			title: '登录|NodeJs学习站',
			type: 'login',
			loginer: null
		});
	}
};

exports.post = function(req, res) {
	var email = req.body.email;
	var	password = req.body.password;

	if (!email || !password) {
		res.json({status:0, msg:'参数错误，无权访问！'});
	}
	else {
		//密码md5加密
		password = util.md5(password);

		//读取未登录前最后访问路径
		var last_visit_url = req.session.last_visit_url ? req.session.last_visit_url : '/bowen';

		//查询用户信息
		user.get({email:email, password:password}, function(status, message){
			if (status==1 && message[0]) {
				req.session.user = new user(message[0]);
				res.json({status:1, msg:'登录成功！', last_visit_url: last_visit_url});
			}
			else if (status==1 && !message[0]) {
				res.json({status:0, msg:'密码与用户名不匹配！'});
			}
			else {
				res.json({status:0, msg:'系统出错，请稍后再试！'});
			}
		});
	}
};