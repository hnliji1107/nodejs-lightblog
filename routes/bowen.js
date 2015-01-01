var blog = require('../models/blog');
var util = require('./widget/util');

function _context_ids(id, arr){
	var prev_id = next_id = 0;

	if (arr.length <= 1) {
		return {pid: 0, nid: 0};
	}

	for (var i = 0; i < arr.length; i++){
		if(arr[i]._id == id){
			if(i > 0 && i < arr.length-1){
				prev_id = arr[i-1]._id;
				next_id = arr[i+1]._id;
			}
			else if(i == 0){
				prev_id = arr[arr.length-1]._id;
				next_id = arr[i+1]._id;
			}
			else if(i == arr.length-1){
				prev_id = arr[i-1]._id;
				next_id = arr[0]._id;
			}

			return {pid: prev_id, nid: next_id};
		}
	}
}

exports.showlist = function(req, res) {
	var session_user = req.session.user;
	var _uid = session_user && session_user._id;

	if (!session_user) {
		res.redirect('/');
	}
	else {
		blog.get(null, function(status, message) {
			//过滤热度并返回当前用户所有喜欢的博文
			var love_blogs = util.filter_loveAndRecommend(message, _uid);
			//过滤标签并返回当前用户所有博文
			var self_blogs = util.filter_static(message, _uid);
			
			//压缩文章内容
			util.compress_code(message);

			res.render('bowen', {
				title: '个人文章|NodeJs学习站',
				type: 'bowen',
				loginer: session_user,
				blog: self_blogs,
				love_blog_count: love_blogs.length
			});
		});
	}
};

exports.detail = function(req, res) {
	var session_user = req.session.user;
	var _id = req.params._id;

	blog.get({_id: _id}, function(status, message) {
		if (status==1 && message.length>0) {
			var only_message = message[0];
			var title = (only_message.title || '详细文字') + only_message.author_name;

			//过滤标签
			util.filter_static(message);

			//过滤热度
			util.filter_loveAndRecommend(message);

			//获取文章时间中的月份和天数
			only_message.month = util.getNowTime().month;
			only_message.date = util.getNowTime().date;

			//找出所有文章
			blog.get({author_id: only_message.author_id}, function(estate, all) {
				//读取上篇、下篇文章的_id
				var ids = _context_ids(_id, all);
				only_message.pid = ids.pid;
				only_message.nid = ids.nid;

				//记录未登录前最后访问页面
				// req.session.last_visit_url = 'bowen/detail/'+_id;
				
				//模板渲染
				res.render('detail', {
					title: title+'|NodeJs学习站',
					type: 'detail',
					loginer: session_user,
					blog: only_message
				});
			});
		}
		else {
			res.render('error', {
				title: '出错啦|NodeJs学习站',
				type: 'error',
				loginer: session_user
			});
		}
	});
}