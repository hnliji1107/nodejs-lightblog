define(function(require, exports, module) {
	var $ = require('jquery.min');
	var common = require('common');
	var baseFun = require('baseFun');
	var index = {
		init: function() {
			this.$wrapper = $('.g-bd');
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
					//他人头像hover效果
					baseFun.ta_avatar_hover();
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
					var $self_model = $this.closest('.m-mlist');
					var $model_parent = $('.g-mn', self.$wrapper);
					var $layer = $body.children('.a-scale-layer');
					var delurl = $this.attr('href');
					var bowenEmpty = new EJS({url: '../templates/bowenEmpty.ejs'}).render();
					var delBowen = new EJS({url: '../templates/delBowen.ejs'}).render();

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
								_class.closeLayer({data: {layer: $layer}});
								$self_model.remove();
								baseFun.content_tip('ok', '成功删除！');

								if (!$model_parent.children('.m-mlist').length) {
									$model_parent.append(bowenEmpty);
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
					var $delete_btn = $('.delete', self.$wrapper);
					$delete_btn.on('click', _class.doDelete);
				},
				doLove: function(e) {
					e.preventDefault();

					var $this = $(e.target);
					var $hotnum = $this.parent().prevAll('.opti').children('.hotnum');
					
					self.model('ajax', {
						url: $this.attr('href'),
						type: 'post',
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								$hotnum.text('热度('+m.hotnum+')');

								if (m.type == 'y') {
									$this.addClass('w-icn-0b-do').attr('title', '取消喜欢');
								}
								else if (m.type == 'n') {
									$this.removeClass('w-icn-0b-do').attr('title', '喜欢');
								}
							}
						}
					});
				},
				love: function(params) {
					var $love_btn = $('.w-icn', self.$wrapper);
					$love_btn.on('click', _class.doLove);
				},
				doRecommend: function(e) {
					e.preventDefault();

					var $this = $(e.target);
					var $hotnum = $this.parent().prevAll('.opti').children('.hotnum');
					
					self.model('ajax', {
						url: $this.attr('href'),
						type: 'post',
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								$this.text(m.msg);
								$hotnum.text('热度('+m.hotnum+')');

								if (m.type == 'y') {
									baseFun.content_tip('ok', '推荐成功！');
									$this.attr('title', '取消推荐');
								}
								else if (m.type == 'n') {
									baseFun.content_tip('ok', '取消推荐成功！');
									$this.attr('title', '推荐');
								}
							}
						}
					});
				},
				recommend: function(params) {
					var $recommend_btn = $('.recommending', self.$wrapper);
					$recommend_btn.on('click', _class.doRecommend);
				},
				openBox: function(e) {
					e.preventDefault();

					var $this = $(e.target);
					var $opticrt = $this.nextAll('.opticrt');
					var $iarea = $this.closest('.m-mlist').find('.'+e.data.clname);

					if ($iarea.css('margin-top') != '0px') {
						$iarea.css('margin-top', 0);
						$opticrt.css({'opacity': 1, 'visibility': 'visible'});
					}
					else {
						$iarea.css('margin-top', '-'+$iarea.height()+'px');
						$opticrt.css({'opacity': 0, 'visibility': 'hidden'});
					}
				},
				doComment: function(e) {
					e.preventDefault();

					var $this = $(e.target);
					var $ul = $this.closest('.isaymin').find('ul.xtag');
					var $iarea = $this.prevAll('.w-inputxt');
					var $open_btn = $this.closest('.m-mlist').find('.opening');
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
								var _li = new EJS({url: '../templates/doComment.ejs'}).render(m);

								$ul.prepend(_li)
								  .children('li')
								  .first()
								  .animate({height: '45px'}, 500, function() {
								  	  $(this).removeAttr('style');
								  	  $open_btn.text('评论('+m.nowcount+')');
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
					var $open_btn = $this.closest('.m-mlist').find('.opening');
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
									$open_btn.text('评论('+m.nowcount+')');
								});
							}
						}
					});
				},
				replyComment: function(e) {
					e.preventDefault();

					var $this = $(e.target);
					var $textarea = $this.closest('.isaymin').find('textarea.xtag');
					var name = $this.closest('.cmtopt').prevAll('.cmthot').find('a.commenter').text();
					var vaulePix = '回复 '+$.trim(name)+'：';
					
					$textarea.val('').focus().val(vaulePix);
				},
				comment: function(params) {
					var $open_btn = $('.opening', self.$wrapper);
					var $comment_btn = $('.w-bbtn-0', self.$wrapper);
					var $hot_btn = $('.hot-opening', self.$wrapper);

					$open_btn.on('click', {clname: 'comment-open'}, _class.openBox);
					$comment_btn.on('click', _class.doComment);
					self.$wrapper.on('click', 'a.delComment', _class.delComment);
					$hot_btn.on('click', {clname: 'hot-open'}, _class.openBox);
					self.$wrapper.on('click', 'a.replyComment', _class.replyComment);
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
		index.init();
	})
});