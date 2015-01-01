var error_msg = {
	email_empty: '邮箱不能为空！',
	email_match: '邮箱格式不正确！',
	name_empty: '昵称不能为空！',
	name_exist: '昵称已存在！',
	password_plump: '密码最少6位！',
	repassword_plump: '重复密码最少6位！',
	twoinput_not_same: '两次密码输入不一致！'
};

var right_msg = {
	email: '',
	name: '',
	password: '',
	repassword: ''
};

define(function(require, exports, module) {
	var $ = require('jquery.min');
	var baseFun = require('baseFun');
	var regist = {
		init: function() {
			this.$wrapper = $('.regist');
			this.event('regist');
		},
		view: function(method, params) {
			var _class = {};
			return _class[method](params);
		},
		event: function(method, params) {
			var self = this;
			var _class = {
				doRegist: function(e){
					e.preventDefault();

					var $controlGroup = $('.control-group');
					var $email = $('input[name=email]', self.$wrapper);
					var	$name = $('input[name=nickName]', self.$wrapper);
					var	$password = $('input[name=password]', self.$wrapper);
					var	$repassword = $('input[name=repassword]', self.$wrapper);
					var	email = $email.val();
					var	email_reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					var	name = $name.val();
					var	password = $password.val();
					var	repassword = $repassword.val();
					var	tips = [
									{ type:1, obj:$email, msg:right_msg.email },
									{ type:1, obj:$name, msg:right_msg.name },
									{ type:1, obj:$password, msg:right_msg.password },
									{ type:1, obj:$repassword, msg:right_msg.repassword }
								];
					var	validated = true;

					if ($.trim(email) == '') {
						tips[0].type = 0;
						tips[0].msg = error_msg.email_empty;
					}
					else if (!email_reg.test(email)) {
						tips[0].type = 0;
						tips[0].msg = error_msg.email_match;
					}

					if ($.trim(name) == '') {
						tips[1].type = 0;
						tips[1].msg = error_msg.name_empty;
					}

					if ($.trim(password).length < 6) {
						tips[2].type = 0;
						tips[2].msg = error_msg.password_plump;
					}

					if ($.trim(repassword).length < 6) {
						tips[3].type = 0;
						tips[3].msg = error_msg.repassword_plump;
					}

					if (password != repassword) {
						tips[3].type = 0;
						tips[3].msg = error_msg.twoinput_not_same;
					}

					if (tips.length > 0) {
						for(var i=0, count=tips.length; i<count; i++) {
							var $obj = tips[i].obj;
							var	$control_group = $obj.closest('.control-group');

							if (tips[i].type == 0) {
								$control_group.addClass('error');
								validated &= false;
							}
							else {
								$control_group.removeClass('error');
							}

							$obj.parent().next('.help-inline').text(tips[i].msg);
						}

						if (!validated) return false;
					}

					//ajax异步请求
					self.model('ajax', {
						url: '/regist',
						type: 'post',
						data: {
							email: $.trim(email),
							name: $.trim(name),
							password: $.trim(password)
						},
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								location.href = m.last_visit_url;
							}
							else {
								//清空密码
								$password.val('');
								$repassword.val('');
								//显示错误tip
								baseFun.loginRig_tip($controlGroup.first(), m.msg);
							}
						}
					});
				},
				regist: function(params) {
					var $submit_btn = $('button[type=submit]', self.$wrapper);
					$submit_btn.on('click', _class.doRegist);
				}
			};

			return _class[method](params);
		},
		model: function(method, params){
			var _class = {
				ajax: function(params){
				    $.ajax({
				    	url: params.url,
				        type: params.type,  
				        data: params.data,
				        dataType: params.dataType,
				        success: params.success,
				        error: function(){
				        	//清空密码
							$password.val('');
							$repassword.val('');
							//显示错误tip
							baseFun.loginRig_tip($controlGroup.first(), '系统出错，请稍后再试！');
				        }
					});
				}
			};

			return _class[method](params);
		},
		plug: function(method, params){
			var _class = {};
			return _class[method](params);
		}
	};

	$(function(){
		regist.init();
	})
});