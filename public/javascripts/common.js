define(function(require, exports, module) {
	var $ = require('jquery.min');
	var common = {
		setCookie: function(c_name, value, expiredays) {
			var exdate = new Date();

			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + '=' +escape(value) + ((expiredays==null) ? '' : ';expires=' + exdate.toGMTString());
		},
		
		getCookie: function(c_name) {
			if(document.cookie.length > 0) {
				var c_start = document.cookie.indexOf(c_name + '=');
				var	c_end = document.cookie.indexOf(';',c_start);

				if (c_start != -1) { 
					c_start = c_start + c_name.length + 1;

					if (c_end == -1) {
						c_end = document.cookie.length;
					}

					return unescape(document.cookie.substring(c_start,c_end));
				} 
			}

			return '';
		},

		dialogMove: function(obj, dragObj) {
			var $doc = $(document);
			var	moveKey = false;

			dragObj = (dragObj == undefined)? obj : dragObj;

			dragObj.on('mousedown',function(e) {
				var theX = e.clientX;
				var	theY = e.clientY;
				var	ofLt = parseInt(obj.css('left'));
				var	ofTp = parseInt(obj.css('top'));

				moveKey = true;
				//鼠标按下时，改变鼠标样式
	            dragObj.css({cursor: 'move'});

				$doc.on('mousemove', function(e) {
					var nowX = e.clientX;
					var	nowY = e.clientY;
					var	left = ofLt + nowX - theX;
					var	top = ofTp + nowY - theY;

					if (moveKey) {
						obj.css({left: left+'px', top: top+'px'});
					}

					e.preventDefault();

				}).on('mouseup', function(){
					moveKey = false;
					//鼠标抬起时，还原鼠标样式
	                dragObj.css({cursor: 'default'});
				});

				e.preventDefault();
			});
		},

		loading: function(hasIcon, zIndex) {
			var $win = $(window);
			var	$doc = $(document);
			var	$body = $('body');
			var	$misk = $('.misk', $body);
			var	winW = parseInt($win.width());
			var	winH = parseInt($win.height());
			var	docH = parseInt($doc.height());
			var	scrollLeft = parseInt($win.scrollLeft());
			var	scrollTop = parseInt($win.scrollTop());
			var	maxW = winW;
			var	maxH = Math.max(winH,docH);
			var	left = scrollLeft+(winW-80)/2;
			var	top = scrollTop+(winH-80)/2;
			var	background = '#000 url(../images/loading.gif) no-repeat '+left+'px '+top+'px';

			if (!hasIcon) {
				background = '#000';
			}

			$misk.remove();
			$body.append('<div class="misk"></div>');

			$('.misk',$body).css({
				position: 'absolute',
				top: 0,
				left: 0,
				background: background,
				opacity: 0.25,
				filter: 'alpha(opacity=25)',
				width: maxW + 'px',
				height: maxH + 'px',
				'z-index': zIndex
			});
		},

		unloading: function() {
			var $body = $('body');
			$('.misk', $body).remove();
		},
	
		dialogCenter: function(obj, zIndex, pos, callback) {
			var $win = $(window);
			var	winW = parseInt($win.width());
			var	winH = parseInt($win.height());
			var	scrollTop = parseInt($win.scrollTop());
			var	scrollLeft = parseInt($win.scrollLeft());
			var	objW = obj.outerWidth(true);
			var	objH = obj.outerHeight(true);
			var	objL = scrollLeft + (winW-objW)/2;
			var	objT = scrollTop + (winH-objH)/2;
			var	top = (pos && typeof pos.top != 'undefined') ? pos.top : objT;
			var	left = (pos && typeof pos.left != 'undefined') ? pos.left : objL;

			common.loading(false, zIndex);

			obj.css({
				position: 'absolute',
				top: top + 'px',
				left: left + 'px',
				'z-index': zIndex + 1
			});

			if (typeof callback == 'function') {
				callback(obj);
			}
		}
	};

	module.exports = common;
});