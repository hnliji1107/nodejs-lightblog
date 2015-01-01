define(function(require, exports, module) {
	var $ = require('jquery.min');
	var EJS = require('ejs');
	var baseFun = {
		gotop_init: function() {
			var $doc = $(document);
			var $win = $(window);
			var $upDown = $('.upDown');
			var $upBtn = $upDown.children('a.upMove');
			var $downBtn = $upDown.children('a.downMove');
			var $hdBtn = $upDown.children('a.hdMove');

			function initialization() {
				var start_pos = $doc.scrollTop();
				var doc_h = $doc.height();
				var win_h = $win.height();
				var diff_h = doc_h - win_h;

				//右侧快捷按钮是否显示
				if (diff_h == 0) {
					$upDown.addClass('s-stealth');
				}
				else {
					$upDown.removeClass('s-stealth');

					//右侧快捷按钮中的返回顶部按钮是否显示
					if (start_pos <= 0) {
						$upBtn.addClass('s-stealth');
					}
					else {
						$upBtn.removeClass('s-stealth');
					}

					//右侧快捷按钮中的返回底部按钮是否显示
					if (start_pos >= diff_h) {
						$downBtn.addClass('s-stealth');
					}
					else {
						$downBtn.removeClass('s-stealth');
					}
				}

				return diff_h;
			}

			function docMove(e) {
				var originCoor_Y = e.data.originCoor_Y;
				var newCoor_Y = e.clientY;
				var scrollTop = $doc.scrollTop();
				var diff_Y = newCoor_Y - originCoor_Y;
				var distance = scrollTop+diff_Y;
				
				if (diff_Y > 0) {
					timer('down', distance, 1, diff_Y);
				}
				else {
					timer('up', distance, 1, diff_Y);
				}
			}

			function timer(flag, distance, step, diff_distance) {
				var step = diff_distance ? Math.ceil(Math.abs(diff_distance)/10) : step;
				var start_pos = $doc.scrollTop();
				var time = null;

				time = setInterval(function() {
					if (flag == 'down') {
						if (start_pos >= distance) {
							clearInterval(time);
							return;
						}
						start_pos += step;
					}
					else if (flag == 'up'){
						if (start_pos <= distance) {
							clearInterval(time);
							return;
						}
						start_pos -= step;
					}
					
					$doc.scrollTop(start_pos);
				}, 1);
				
			}

			//页面加载完成时的初始化
			initialization();

			//窗口大小改变时
			$win.on('resize', function() {
				initialization();
			});

			//滚动条滑动时
			$win.on('scroll', function() {
				initialization();
			});

			//返回顶部
			$upBtn.on('click', function(e) {
				e.preventDefault();
				timer('up', 0, 50);
			});

			//直通底部
			$downBtn.on('click', function(e) {
				e.preventDefault();
				timer('down', initialization(), 50);
			});

			//双击文档，解除随鼠标滚动
			$doc.on('dblclick', function(e) {
				e.preventDefault();
				
				$hdBtn.removeAttr('style').attr('title', '单击停止自动滚动');
				$upBtn.removeClass('udHide');
				$downBtn.removeClass('udHide');
				$doc.off('mousemove', docMove);
			});

			//打开随鼠标移动
			$hdBtn.on('click', function(e) {
				e.preventDefault();

				if (!$hdBtn.attr('style')) {
					$hdBtn.css('background-position', '-35px -29px').attr('title', '单击停止自动滚动');
					$upBtn.addClass('udHide');
					$downBtn.addClass('udHide');
					$doc.on('mousemove', {originCoor_Y: e.clientY}, docMove);
				}
				else {
					$hdBtn.removeAttr('style').attr('title', '单击跟随鼠标上下滚动');
					$upBtn.removeClass('udHide');
					$downBtn.removeClass('udHide');
					$doc.off('mousemove', docMove);
				}
			});

			//鼠标移到快捷按钮上，停止随鼠标移动
			$hdBtn.on('mousemove', function() {
				if ($hdBtn.attr('style')) {
					$doc.off('mousemove', docMove);
				}
			}).on('mouseout', function(e) {
				if ($hdBtn.attr('style')) {
					$doc.on('mousemove', {originCoor_Y: e.clientY}, docMove);
				}
			});
		},

		managing: function() {
			var $doc = $(document);
			var $drop_btn = $('.more-oper', '#lofterheadbar');
			var $more_opt_list = $drop_btn.next('.a-w-sel-do').children('.w-sel-4');
			var more_opt_list_h = -$more_opt_list.height()-12;

			function list_hide() {
				$more_opt_list.removeClass('appear').animate({'margin-top': more_opt_list_h+'px'}, 10);
			}

			$drop_btn.on('click', function(e) {
				e.stopPropagation();

				if (!$more_opt_list.hasClass('appear')) {
					$more_opt_list.addClass('appear').animate({'margin-top': 0}, 10);
				}
				else {
					list_hide();
				}
			});

			$doc.on('click', function() {
				list_hide();
			});
		},

		ta_avatar_hover: function() {
			var $drop_btn = $('.mlistimg', '.m-mlist');

			$drop_btn.hover(function() {
				$(this).find('.w-sel-7').removeClass('s-hide');
			},function() {
				$(this).find('.w-sel-7').addClass('s-hide');
			});
		},

		loginRig_tip: function($where, tip) {
			var $etip = $(['<div class="alert alert-error">',
								'<a class="close" data-dismiss="alert">×</a>',
								'<strong>警告！</strong> '+tip,
							'</div>'].join(''));
			var time = null;

			//显示错误tip
			$etip.insertBefore($where);

			//手动关闭tip
			$etip.children('.close').on('click', function() {
				$etip.remove();
				clearTimeout(time);
			});

			//1秒后自动关闭tip
			time = setTimeout(function() {
				$etip.remove();
			}, 2000);
		},

		content_tip: function(type, tip) {
			var $body = $('body');
			var tiplayer = new EJS({url: '/templates/tiplayer.ejs'}).render({type: type, tip: tip});

			$body.append(tiplayer);
	
			var $tiplayer = $('.a-slide-tmsg', $body);
			var tiplayer_h = $tiplayer.height();
			
			$tiplayer.animate({'margin-top': 0}, 200);
			
			setTimeout(function() {
				$tiplayer.animate({'margin-top': '-'+tiplayer_h+'px'}, 200, function() {
					$tiplayer.parent().remove();
				});
			}, 2000);
		}
	};

	module.exports = baseFun;
});