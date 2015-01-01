define(function(require, exports, module) {
	var $ = require('jquery.min');
	var baseFun = require('baseFun');
	var blog = {
		init: function() {
			this.$wrapper = $('.postTextArea');
			this.view('baseFunInit');
			this.view('init_editor');
		},
		view: function(method, params) {
			var self = this;
			var _class = {
				init_editor: function() {
					var blog_type = $('input.blog-type', self.$wrapper).val() || 'new';

					//请求编辑器依赖配置文件
					require('../ueditor/ueditor.config');
					require('../ueditor/ueditor.all.min');

					//编辑器工具栏配置项
					UEDITOR_CONFIG.toolbars = [
						['fullscreen', 'source', '|', 
						'undo', 'redo', '|',
						'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'blockquote', 'pasteplain', '|', 
						'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'lineheight', '|', 
						'preview', 'searchreplace', 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 
						'directionalityltr', 'directionalityrtl', 'indent', '|',
						'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 
						'touppercase', 'tolowercase', '|',
						'link', 'unlink', '|',
						'emotion', 'map', 'template', '|',
						'horizontal', 'spechars', '|',
						'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
						'insertcode'
						]
					];

					//初始化时，让编辑器获得焦点
					UEDITOR_CONFIG.focus = true;

					//初始化编辑器高度
					UEDITOR_CONFIG.initialFrameHeight = 320;

			        self.uEditor_Instance = new baidu.editor.ui.Editor();
			        self.uEditor_Instance.render('myEditor');

					self.event('publish', {_type: blog_type});
				},
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
				doPublish: function(e) {
					var $title = $('#blogTittle', self.$wrapper);
					var $label = $('.label', self.$wrapper);
					var _type = e.data._type;
					var _title = $.trim($title.val());
					var _label = $.trim($label.val());
					
					if (!self.uEditor_Instance.hasContents()) {
						baseFun.content_tip('err', '请输入日志内容！');
						return false;
					}

					self.model('ajax', {
						url: '/blog/save',
						type: 'post',
						data: {
							_type: _type,
							_title: _title,
							_body: self.uEditor_Instance.getContent(),
							_label: _label
						},
						dataType: 'json',
						success: function(m) {
							if (m.status == 1) {
								location.href = '/bowen';
							}
						}
					});
				},
				publish: function(params) {
					var $publish_btn = $('.publish', self.$wrapper);
					$publish_btn.on('click', {_type: params._type}, _class.doPublish);
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
		blog.init();
	})
});