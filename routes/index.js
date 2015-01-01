module.exports = function(req, res) {
	var blog = require('../models/blog');
	var user = require('../models/user');
	var util = require('./widget/util');
	var session_user = req.session.user;
	var _uid = session_user && session_user._id;

	blog.get(null, function(status, message) {
		//过滤标签并返回当前用户所有博文
		var self_blogs = util.filter_static(message, _uid);
		//过滤热度并返回当前用户所有喜欢的博文
		var love_blogs = util.filter_loveAndRecommend(message, _uid);

		//压缩文章内容
		util.compress_code(message);

		res.render('index', {
			title: 'NodeJs学习站',
			type: 'index',
			loginer: session_user,
			blog: message,
			self_blog_count: self_blogs.length,
			love_blog_count: love_blogs.length
		});
	});
};
