//私有方法
function _filter_time(time) {
	var tmptime = Math.ceil((new Date()-new Date(time))/1000); //时间差

	if (tmptime >= 60) {
		if (tmptime >= 3600) {
			if (tmptime >= 3600*24) {
				if (tmptime > 3600*24*30) { //如果时间差超过1个月
					tmptime = time.split(' ')[0]; //输出年-月-天
				}
				else { //如果大于1天小于1个月
					if (Math.floor((tmptime%(3600*24))/3600) > 0) {
						tmptime = Math.floor(tmptime/3600/24)+'天'+Math.floor((tmptime%(3600*24))/3600)+'小时前'; //输出 约xx天xx小时前
					}
					else { //如果没有多余小时
						tmptime = Math.floor(tmptime/3600/24)+'天前'; //输入 约xx天前
					}
				}
			}
			else { //如果大于1小时小于1天
				if (Math.floor((tmptime%3600)/60) > 0) {
					tmptime = Math.floor(tmptime/3600)+'小时'+Math.floor((tmptime%3600)/60)+'分钟前'; //输出 约xx小时xx分钟前
				}
				else { //如果没有多余分钟
					tmptime = Math.floor(tmptime/3600)+'小时前'; //输入 约xx小时前
				}
			}
		}
		else { //如果大于1分钟小于1小时
			tmptime = Math.floor(tmptime/60)+'分钟前'; //输出 约xx分钟前
		}
	}
	else { //如果小于1分钟
		tmptime = tmptime+'秒前'; //输出 约xx秒前
	}
	
	return tmptime;
}

//私有方法
function _filter_space(str) {
	return str.replace(/[ \t\n\r]+/g, '');
}

//私有方法
function _md5(str) {
	var crypto = require('crypto');
	return crypto.createHash('md5').update(str).digest('hex');
}

//获取标准格式的当前时间
exports.getNowTime = function() {
	var d = new Date();
	var year = d.getYear()+1900;
	var month = d.getMonth()+1;
	var date = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();

	month = month.toString().length<2 ? '0'+month : month;
	date = date.toString().length<2 ? '0'+date : date;
	hours = hours.toString().length<2 ? '0'+hours : hours;
	minutes = minutes.toString().length<2 ? '0'+minutes : minutes;
	seconds = seconds.toString().length<2 ? '0'+seconds : seconds;
	
	return {
		year: year, 
		month: month, 
		date: date, 
		hours: hours, 
		minutes: minutes, 
		seconds: seconds, 
		time: year+'/'+month+'/'+date+' '+hours+':'+minutes+':'+seconds
	}
}

//去除所有空格换行符以及tab键
exports.filter_space = _filter_space;

//md5加密
exports.md5 = _md5;

//压缩文章内容
exports.compress_code = function(arr) {
	arr.forEach(function(one) {
		one.content = _filter_space(one.content).replace(/<[^>].*?>/g, '').substr(0, 500);
	});
}

//格式化文章中的一些数据
exports.filter_static = function(arr, _uid) {
	var self_blogs = [];

	arr.forEach(function(one) {
		//start: 过滤出当前用户博文
		if (one.author_id == _uid) {
			self_blogs.push(one);
		}
		//end: 过滤出当前用户博文

		//start: 过滤文章标签
		var label_arr = one.label.split(',');
		var new_arr = [];

		label_arr.forEach(function(label) {
			var label_arr2 = label.split('，');

			label_arr2.forEach(function(label2) {
				var clean_elem = label2.trim();

				if (clean_elem != '') {
					new_arr.push(clean_elem);
				}
			});
		});

		one.label = new_arr;
		//end: 过滤文章标签

		//格式化文章评论时间
		one.comments.forEach(function(comment) {
			comment._time = _filter_time(comment._time);
		});

		//给文章的喜欢数据添加标志
		one.loves.forEach(function(love) {
			love.type = 'love';
		});

		//给文章的推荐数据添加标志
		one.recommends.forEach(function(recommend) {
			recommend.type = 'recommend';
		});

		//合并推荐、喜欢数组病根据时间排序
		one.hots = one.loves.concat(one.recommends).sort(function(value1, value2) {
			return new Date(value2['_time']) - new Date(value1['_time']);
		});

		//格式化排序后的文章推荐、喜欢时间
		one.hots.forEach(function(hot) {
			hot._time = _filter_time(hot._time);
		});

		//格式化文章时间
		one.time = _filter_time(one.time);
	});

	return self_blogs;
}

//给文章的热度数据添加标志
exports.filter_loveAndRecommend = function(arr, _uid) {
	var love_blogs = [];

	arr.forEach(function(one) {
		var isExists_love = one.loves.some(function(e) {
			return e._uid == _uid;
		});
		var isExists_recommend = one.recommends.some(function(e) {
			return e._uid == _uid;
		});

		if (isExists_love) {
			//标识当前登录者是否喜欢了该文章
			one.isLove = true;
			//过滤喜欢的博文
			love_blogs.push(one);
		}

		if (isExists_recommend) {
			//标识当前登录者是否推荐了该文章
			one.isRecommend = true;
		}
	});

	//返回喜欢的博文
	return love_blogs;
}