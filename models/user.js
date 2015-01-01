var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
var util = require('../routes/widget/util');

function User(user) {
	if (user._id) {
		this._id = user._id;
	}

	this.email = user.email;
	this.name = user.name;
	this.avatar = 'http://s.gravatar.com/avatar/'+util.md5(this.email);
	this.password = user.password;
	this.time = user.time ? user.time : util.getNowTime().time;
}

//mongodb基本操作
User.base = function(callback) {
	//打开前先关闭正在打开着的mongodb
	mongodb.close();
	
	//打开mongodb
	mongodb.open(function(err, db) {
		if (err) {
			return callback(0, err);
		}

		//打开用户表
		db.collection('user', {safe:true}, function(err, collection) {
			if (err) {
				return callback(0, err);
			}

			callback(collection);
		});
	});
}

//保存用户信息
User.prototype.save = function(callback) {
	var user_info = {
		email: this.email,
		name: this.name,
		avatar: this.avatar,
		password: this.password,
		time: this.time
	};

	User.base(function(collection) {
		collection.insert(user_info, {safe:true}, function(err, user) {
			if (err) {
				return callback(0, err);
			}

			return callback(1, user);
		});
	});
};

//查询用户信息
User.get = function(condition, callback) {
	if (condition && condition._id) {
		condition._id = new ObjectID(condition._id);
	}

	User.base(function(collection) {
		collection.find(condition).toArray(function(err, user) {
			if (err) {
				return callback(0, err);
			}

			return callback(1, user);
		});
	});
};

module.exports = User;

