var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
var util = require('../routes/widget/util');

function Blog(blog) {
	if (blog._id) {
		this._id = blog._id;
	}

	this.title = blog.title;
	this.content = blog.content;
	this.label = blog.label;
	this.author_id = blog.author_id;
	this.author_name = blog.author_name;
	this.author_avatar = blog.author_avatar;
	this.time = blog.time ? blog.time : util.getNowTime().time;
	this.loves = blog.loves || [];
	this.recommends = blog.recommends || [];
	this.comments = blog.comments || [];
	this.hots = blog.hots || 0;
}

//mongodb基本操作
Blog.base = function(callback) {
	//打开前先关闭正在打开着的mongodb
	mongodb.close();

	//打开mongodb
	mongodb.open(function(err, db) {
		if (err) {
			return callback(0, err);
		}

		//打开博文表
		db.collection('blog', {safe:true}, function(err, collection) {
			if (err) {
				return callback(0, err);
			}

			callback(collection);
		});
	});
}

//保存博文信息
Blog.prototype.save = function(callback) {
	var blog_info = {
		title: this.title,
		content: this.content,
		label: this.label,
		author_id: this.author_id,
		author_name: this.author_name,
		author_avatar: this.author_avatar,
		time: this.time,
		loves: this.loves,
		recommends: this.recommends,
		comments: this.comments,
		hots: this.hots
	};

	Blog.base(function(collection) {
		collection.insert(blog_info, {safe:true}, function(err, blog) {
			if (err) {
				return callback(0, err);
			}

			return callback(1, blog);
		});
	});
};

//更新博文信息
Blog.prototype.update = function(condition, callback) {
	var blog_info = {
		title: this.title,
		content: this.content,
		label: this.label,
		author_id: this.author_id,
		author_name: this.author_name,
		author_avatar: this.author_avatar,
		time: this.time
	};

	if (condition && condition._id) {
		condition._id = new ObjectID(condition._id);
	}

	Blog.base(function(collection) {
		collection.update(condition, {$set: blog_info}, {safe: true, upsert: true}, function(err, blog) {
			if (err) {
				return callback(0, err);
			}

			return callback(1, blog);
		});
	});
}

//更新喜欢数据
Blog.update_additional = function(condition, setInfo, callback) {
	if (condition && condition._id) {
		condition._id = new ObjectID(condition._id);
	}

	Blog.base(function(collection) {
		collection.update(condition, {$set: setInfo}, {safe: true}, function(err, blog) {
			if (err) {
				return callback(0, err);
			}

			return callback(1, blog);
		});
	});
}

//删除博文
Blog.del = function(condition, callback) {
	if (condition && condition._id) {
		condition._id = new ObjectID(condition._id);
	}
	
	Blog.base(function(collection) {
		collection.remove(condition, {safe: true}, function(err, blog) {
			if (err) {
				return callback(0, err);
			}

			return callback(1, blog);
		});
	});
}

//查询博文信息
Blog.get = function(condition, callback) {
	if (condition && condition._id) {
		condition._id = new ObjectID(condition._id);
	}

	Blog.base(function(collection) {
		collection.find(condition).sort({time: -1}).toArray(function(err, blog) {
			if (err) {
				return callback(0, err);
			}
			
			return callback(1, blog);
		});
	});
};

module.exports = Blog;

