var util = require('./widget/util');

exports.get = function(req, res) {
	if (req.session.user) {
		res.redirect('/');
	}
	else {
		res.render('regist', {
			title: '注册|NodeJs学习站',
			type: 'regist',
			loginer: null
		});
	}
};

exports.post = function(req, res) {
	var email = req.body.email;
	var	name = req.body.name;
	var	password = req.body.password;

	if (!email || !name || !password) {
		res.json({status:0, msg:'参数错误，无权访问！'});
	}
	else {
		var user = require('../models/user');

		user.get({email:email}, function(status, message) {
			if (status == 0) {
				res.json({status:0, msg: '系统出错，请稍后再试！'});
			}
			else if (status==1 && message[0]) {
				res.json({status:0, msg:'该邮箱已被注册！'});
			}
			else if (status==1 && !message[0]) {
				user.get({name:name}, function(status, message) {
					if (status == 0) {
						res.json({status:0, msg: '系统出错，请稍后再试！'});
					}
					else if (status==1 && message[0]) {
						res.json({status:0, msg:'该昵称已存在！'});
					}
					else if (status==1 && !message[0]) {
						//密码md5加密
						password = util.md5(password);

						//读取未登录前最后访问路径
						var last_visit_url = req.session.last_visit_url ? req.session.last_visit_url : '/bowen';
						
						var	one = new user({
							email: email,
							name: name,
							password: password
						});

						one.save(function(status, message) {
							if (status == 1) {
								req.session.user = new user(message[0]);
								res.json({status:1, msg: '恭喜，注册成功！', last_visit_url: last_visit_url});
							}
							else {
								res.json({status:0, msg: '系统出错，请稍后再试！'});
							}
						});
					}
				});
			}
		});
	}
};