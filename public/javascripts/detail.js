define(function(require, exports, module) {
	var $ = require('jquery.min');
	var common = require('common');
	var baseFun = require('baseFun');
	var detail = {
		init: function() {
			this.$wrapper = $('.postwrapper');
			this.view('baseFunInit');
			this.event('deleting');
			this.event('love');
			this.event('recommend');
			this.event('comment');
		},
		view: function(method, params) {
			var _class = {
				baseFunInit: function(params) {
					//顶部操作栏-更多
					baseFun.managing();
					//返回顶部按钮初始化
					baseFun.gotop_init();
				}
			};
			return _class[method](params);
		},
		event: function(method, params) {
			var self = this;
			var _class = {
				doDelete: function(e) {
					e.preventDefault();

					var $this = $(this);
					var $body = $('body');
					var $layer = $body.children('.a-scale-layer');
					var delurl = $this.attr('href');
					var bowenEmpty = new EJS({url: '/templates/bowenEmpty.ejs'}).render();
					var delBowen = new EJS({url: '/templates/delBowen.ejs'}).render();

					if ($layer.length <= 0) {
						$body.append(delBowen);
						$layer = $body.children('.a-scale-layer')
					}

					//显示提示框
					common.dialogCenter($layer, 999, {}, function($o) {
						$o.addClass('a-scale-do');
						common.dialogMove($layer, $('.zmov', $layer)); //拖动提示框
					});

					//关闭提示框
					$layer.on('click', '.w-close2' , {layer: $layer}, _class.closeLayer);
					$layer.on('click', '.w-sbtn-3', {layer: $layer}, _class.closeLayer);

					//确定删除
					$layer.on('click', '.w-sbtn-0', function(e) {
						e.preventDefault();

						self.model('ajax', {
							url: delurl,
							type: 'post',
							dataType: 'json',
							success: function(m) {
								if (m.status == 1) {
									location.href = '/bowen';
								}
							}
						});
					});
				},
				closeLayer: function(e) {
					var layer = e.data.layer;

					e.preventDefault && e.preventDefault();
					layer.removeClass('a-scale-do');
					common.unloading();
				},
				deleting: function(params) {
					var $delete_btn = $('.boprt08');
					$delete_btn.on('click', _class.doDelete);
				},
				doLove: function(e) {
					e.preventDefault();

					var $loving = $(e.target).parent('.loving');

					self.model('ajax', {
						url: $loving.attr('href'),
						type: 'post',
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								if (m.type == 'y') {
									$loving.addClass('boprt07').attr('title', '取消喜欢');
								}
								else if (m.type == 'n') {
									$loving.removeClass('boprt07').attr('title', '喜欢');
								}
							}
						}
					});
				},
				love: function(params) {
					var $love_btn = $('.loving em', '.a-control');
					$love_btn.on('click', _class.doLove);
				},
				doRecommend: function(e) {
					e.preventDefault();

					$recommending = $(e.target).parent('.recommending');
					
					self.model('ajax', {
						url: $recommending.attr('href'),
						type: 'post',
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								if (m.type == 'y') {
									$recommending.addClass('boprt12').attr('title', '取消推荐');
								}
								else if (m.type == 'n') {
									$recommending.removeClass('boprt12').attr('title', '推荐');
								}
							}
						}
					});
				},
				recommend: function(params) {
					var $recommend_btn = $('.recommending', '.a-control');
					$recommend_btn.on('click', _class.doRecommend);
				},
				doComment: function(e) {
					e.preventDefault();

					var $this = $(e.target);
					var $commentArea = e.data.commentArea;
					var $ul = $('.bcmtlst ul', $commentArea);
					var $iarea = $('.bcmtadd textarea.s-fc0', $commentArea);
					var $nctitle = $('.nctitle', $commentArea);
					var _content = $.trim($iarea.val());
					var reply_regExp = /^回复\s(.+)：(.*)/;
					var data = {_content: _content};

					if (_content == '') {
						baseFun.content_tip('err', '请输入评论内容');
						$iarea.focus();
						return false;
					}

					if (reply_regExp.test(_content)) {
						//回复
						var _reply = reply_regExp.exec(_content);

						//验证回复内容是否为空
						if (_reply[2] == '') {
							baseFun.content_tip('err', '请输入回复内容！');
							return false;
						}

						data = {_reply: _reply[2], _cname: _reply[1]};
					}

					self.model('ajax', {
						url: $this.attr('href'),
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								var _li = new EJS({url: '/templates/bowen_doComment.ejs'}).render(m);

								$ul.prepend(_li)
								  .children('li')
								  .first()
								  .animate({height: '40px'}, 500, function() {
								  	  $(this).removeAttr('style');
								  	  $nctitle.text('评论('+m.nowcount+')');
									  $iarea.val('');
								  });
							}
						}
					});
				},
				delComment: function(e) {
					e.preventDefault();

					var $this = $(e.target);
					var $li = $this.closest('li');
					var $commentArea = e.data.commentArea;
					var $nctitle = $('.nctitle', $commentArea);
					var comment_id = $this.prevAll('.comment_id').val();

					if (!comment_id) return;

					self.model('ajax', {
						url: $this.attr('href'),
						type: 'post',
						data: {comment_id: comment_id},
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								$li.animate({height: 0}, 500, function() {
									$li.remove();
									$nctitle.text('评论('+m.nowcount+')');
								});
							}
						}
					});
				},
				replyComment: function(e) {
					e.preventDefault();
					
					var $this = $(e.target);
					var $commentArea = e.data.commentArea;
					var $textarea = $('.bcmtadd textarea.s-fc0', $commentArea);
					var name = $this.closest('.bcmtlsth').prevAll('.bcmtlstg').find('a.bcmtlstk').text();
					var vaulePix = '回复 '+$.trim(name)+'：';
					
					$textarea.val('').focus().val(vaulePix);
				},
				comment: function(params) {
					var $comment_btn = $('.pubComment', self.$wrapper);
					var $commentArea = $('.commentArea', self.$wrapper);

					$comment_btn.on('click', {commentArea: $commentArea}, _class.doComment);
					self.$wrapper.on('click', 'a.delComment', {commentArea: $commentArea}, _class.delComment);
					self.$wrapper.on('click', 'a.replyComment', {commentArea: $commentArea}, _class.replyComment);
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
				        error: $.noop
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
		detail.init();
	})
});