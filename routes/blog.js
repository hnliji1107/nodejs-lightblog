var blog = require('../models/blog');
var user = require('../models/user');
var util = require('./widget/util');

exports.new = function(req, res) {
	var session_user = req.session.user;

	if (!session_user) {
		res.redirect('/');
	}
	else {
		res.render('blog', {
			title: '发布文字|NodeJs学习站',
			type: 'blog-new',
			loginer: session_user
		});
	}
}

exports.edit = function(req, res) {
	var session_user = req.session.user;
	var _id = req.session.edit_id = req.params._id;

	if (!session_user) {
		res.redirect('/');
	}
	else {
		blog.get({_id: _id}, function(status, message) {
			if (status==1 && message.length>0) {
				res.render('blog', {
					title: '编辑文字|NodeJs学习站',
					type: 'blog-edit',
					loginer: session_user,
					blog: message[0]
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
}

exports.reserved = function(req, res) {
	var session_user = req.session.user;
	var _id = req.session.edit_id = req.params._id;

	if (!session_user) {
		res.redirect('/');
	}
	else {
		blog.get({_id: _id}, function(status, message) {
			if (status==1 && message.length>0) {
				res.render('blog', {
					title: '转载文字|NodeJs学习站',
					type: 'blog-reserved',
					loginer: session_user,
					blog: message[0]
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
}

exports.del = function(req, res) {
	var session_user = req.session.user;
	var _id = req.session.edit_id = req.params._id;

	blog.del({_id: _id}, function(status, message) {
		if (status == 1) {
			res.json({status: 1, msg: '恭喜，删除成功！'});
		}
		else {
			res.json({status: 0, msg: '系统出错，请稍后再试！'});
		}
	});
}

exports.love = function(req, res) {
	var _id = req.params._id;
	var _uid = req.session.user._id;
	var _name = req.session.user.name;
	var _avatar = 'http://s.gravatar.com/avatar/'+util.md5(req.session.user.email);
	var _time = util.getNowTime().time;

	if (_uid) {
		blog.get({_id: _id}, function(status, message) {
			var loves = message[0].loves;
			var recommends = message[0].recommends;
			var isRepeat = loves.every(function(one) {
				return one._uid != _uid;
			});

			if (isRepeat) {
				loves.push({_id: loves.length, _uid:_uid, _name: _name, _avatar: _avatar, _time: _time});

				blog.update_additional({_id: _id}, {loves: loves}, function(status, message) {
					if (status == 1) {
						res.json({status: 1, type: 'y', hotnum: recommends.length+loves.length, msg: '喜欢'});
					}
					else {
						res.json({status: 0, msg: '系统出错，请稍后再试！'});
					}
				});
			}
			else {
				loves = loves.filter(function(one) {
					return one._uid != _uid;
				});

				blog.update_additional({_id: _id}, {loves: loves}, function(status, message) {
					if (status == 1) {
						res.json({status: 1, type: 'n', hotnum: recommends.length+loves.length, msg: '不喜欢'});
					}
					else {
						res.json({status: 0, msg: '系统出错，请稍后再试！'});
					}
				});
			}
		});
	}
}

exports.recommend = function(req, res) {
	var _id = req.params._id;
	var _uid = req.session.user._id;
	var _name = req.session.user.name;
	var _avatar = 'http://s.gravatar.com/avatar/'+util.md5(req.session.user.email);
	var _time = util.getNowTime().time;

	if (_uid) {
		blog.get({_id: _id}, function(status, message) {
			var recommends = message[0].recommends;
			var loves = message[0].loves;
			var isRepeat = recommends.every(function(one) {
				return one._uid != _uid;
			});

			if (isRepeat) {
				recommends.push({_id: recommends.length, _uid:_uid, _name: _name, _avatar: _avatar, _time: _time});

				blog.update_additional({_id: _id}, {recommends: recommends}, function(status, message) {
					if (status == 1) {
						res.json({status: 1, type: 'y', hotnum: recommends.length+loves.length, msg: '已推荐'});
					}
					else {
						res.json({status: 0, msg: '系统出错，请稍后再试！'});
					}
				});
			}
			else {
				recommends = recommends.filter(function(one) {
					return one._uid != _uid;
				});

				blog.update_additional({_id: _id}, {recommends: recommends}, function(status, message) {
					if (status == 1) {
						res.json({status: 1, type: 'n', hotnum: recommends.length+loves.length, msg: '推荐'});
					}
					else {
						res.json({status: 0, msg: '系统出错，请稍后再试！'});
					}
				});
			}
		});
	}
}

exports.comment = function(req, res) {
	var _id = req.params._id;
	var _uid = req.session.user._id;
	var _name = req.session.user.name;
	var _avatar = 'http://s.gravatar.com/avatar/'+util.md5(req.session.user.email);
	var _cname = req.body._cname;
	var _reply = req.body._reply;
	var _content = req.body._content || (' 回复了 '+_cname+' '+_reply);
	var _time = util.getNowTime().time;

	user.get({name: _cname}, function(status, message) {
		if (_reply && _cname && message.length > 0) { //回复
			blog.get({_id: _id}, function(status, message) {
				var comments = message[0].comments;
				var some_reply = {_id: comments.length, _content: _reply, _uid:_uid, _name: _name, _avatar: _avatar, _cname: _cname, _time: _time};
				comments.push(some_reply);

				blog.update_additional({_id: _id}, {comments: comments}, function(status, message) {
					if (status == 1) {
						res.json({status: 1, type:'reply', data:some_reply, nowcount: comments.length, blog_id: _id, msg: '回复成功！'});
					}
					else {
						res.json({status: 0, msg: '系统出错，请稍后再试！'});
					}
				});
			});
		}
		else { //评论
			blog.get({_id: _id}, function(status, message) {
				var comments = message[0].comments;
				var some_comment = {_id: comments.length, _content: _content, _uid:_uid, _name: _name, _avatar: _avatar, _time: _time};
				comments.push(some_comment);

				blog.update_additional({_id: _id}, {comments: comments}, function(status, message) {
					if (status == 1) {
						res.json({status: 1, data:some_comment, nowcount: comments.length, blog_id: _id, msg: '评论成功！'});
					}
					else {
						res.json({status: 0, msg: '系统出错，请稍后再试！'});
					}
				});
			});
		}
	});
}

exports.delComment = function(req, res) {
	var _id = req.params._id;
	var comment_id = req.body.comment_id;

	blog.get({_id: _id}, function(status, message) {
		var comments = message[0].comments;

		comments.forEach(function(some, i) {
			if (some._id == comment_id) {
				//删除评论
				comments.splice(i,1);

				blog.update_additional({_id: _id}, {comments: comments}, function(status, message) {
					if (status == 1) {
						res.json({status: 1, nowcount: comments.length, msg: '删除成功！'});
					}
					else {
						res.json({status: 0, msg: '系统出错，请稍后再试！'});
					}
				});
			}
		});
	});
}

exports.save = function(req, res) {
	var type = req.body._type;
	var title = req.body._title;
	var content = req.body._body;
	var label = req.body._label;
	var author_id = req.session.user._id;
	var author_name = req.session.user.name;
	var author_avatar = 'http://s.gravatar.com/avatar/'+util.md5(req.session.user.email);
	var edit_id = req.session.edit_id;

	if (!content) {
		res.json({status:0, msg:'参数错误，无权访问！'});
	}
	else {
		var one = new blog({
			title: title,
			content: content,
			label: label,
			author_id: author_id,
			author_name: author_name,
			author_avatar: author_avatar
		});
		
		if (type == 'new' || type == 'reserved') {
			one.save(function(status, message) {
				if (status == 1) {
					res.json({status: 1, msg: '恭喜，发布成功！'});
				}
				else {
					res.json({status: 0, msg: '系统出错，请稍后再试！'});
				}
			});
		}
		else {
			one.update({_id: edit_id}, function(status, message) {
				if (status == 1) {
					res.json({status: 1, msg: '恭喜，修改成功！'});
				}
				else {
					res.json({status: 0, msg: '系统出错，请稍后再试！'});
				}
			});
		}
	}
}