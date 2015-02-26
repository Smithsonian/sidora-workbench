/**
 * Inspired by https://github.com/molant/jquery-seadragon
 * Adapted from jquery.ids.js by Andrew G.
 * Requires jQuery
 * Requirements (in order)
 * ==============
 * jquery-1.9.1.min.js
 * jquery-ui-1.9.2.custom.min.js
 * jquery.dynatree.min.js
 * scrollspy.js
 * jquery.jscroll.min.js
 * imagesloaded.pkgd.min.js
 * masonry.pkgd.min.js
 * jquery.ids.js
 * seadragon-min.js
 * ==============
 */

(function ($) {
	$.fn.ids = function(config) {
		// Does this make sense?
		if (!"Seadragon" in window) {
			try {
				console.error("Please include the seadragon script, e.g. ");
			} catch(e) {}
		}

		this.defaults = {
			'idsid': 'SIA-SIA2013-06898',
			'idsButtonPath': 'https://ids.si.edu/ids/img/',
			'fullscreen': false,
			'rotation': 0,
			'allowRotation': true,
			'onComplete': function() {},
			'customControls': {}
		};

		this.options = $.extend(this.defaults, config);
		this.viewer = null;

		this.idsLoad = function() {
			$.ajax({
				type: 'GET',
				url: "https://ids.si.edu/ids/dynamic?id=" + o.options.idsid + "&container.rotation=" + o.options.rotation,
				async: false,
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					filecode = data['filecode'];
					filew = data['filew'];
					fileh = data['fileh'];

					var dziObject = '{"url":"https://ids.si.edu/ids/viewTile/' + filecode + '/' + o.options.rotation + '", "width": ' + filew + ',"height": ' + fileh + ',"tileSize": 256,"tileOverlap": 1,"tileFormat":"jpg"}';
					var json = $.parseJSON(dziObject);

					o.viewer.openDzi(json);
				},
				error: function (e) {
					if (window.console) {
						console.log(e.message);
					}
				}
			});
		}

		this.idsRotateRight = function(evt) {
			o.options.rotation = o.options.rotation + 90;

			if (o.options.rotation > 270) {
				o.options.rotation = 0;
			}

			o.idsLoad();
		};

		this.idsNewButton = function(button) {
			var html = '<span style="background: none repeat scroll 0% 0% transparent; border: medium none; margin: 0px; padding: 0px; position: relative; display: inline-block;" title="' + button.title + '" class="trans-asset-tools">';
			html += '<img width="46px" height="46px" src="' + this.options.idsButtonPath + button.img + '"></span>';

			var newElement = $(html);
			//Seadragon.Utils.addEvent(newElement.get(0), "click", button.exec);
			Seadragon.Utils.addEvent(newElement.get(0), "click", function(){
				if (o.viewer.isFullPage() && button.closeFullScreen) {
					o.viewer.setFullPage(false);
				}

				button.exec();
			});
			return newElement;
		};

		this.log = function(str) {
			if (window.console) {
				window.console = { log: function(str){} }; // TODO: do something with str for IE (iOS?)
			}
			console.log(str);
		};

		var o = this;
		return this.each(function(t) {
			$(this).empty(); // necessary?

			Seadragon.Config.imagePath = o.options.idsButtonPath;
			if (!o.viewer) {
				o.viewer = new Seadragon.Viewer(this);
				o.viewer.removeControl(o.viewer.getNavControl()); // Removes the controls since we're adding them later
			}

			o.idsLoad();

			// Re-attach controls
			var htmlControl = o.viewer.getNavControl();

			// Attach rotation control
			if (o.options.allowRotation) {
				//$(htmlControl).append(o.idsButtonRotate());
				$(htmlControl).append(o.idsNewButton({img:'rotate.png', title:'Rotate', exec:o.idsRotateRight}));
			}

			// Attach custom controls
			$.each(o.options.customControls, function(key, val) {
				var _settings = $.extend({img: '', title: '', exec: {}, closeFullScreen: false}, val);
				$(htmlControl).append(o.idsNewButton(_settings));
			});

			// Add controls
			o.viewer.addControl(htmlControl, Seadragon.ControlAnchor.TOP_LEFT);

			if (o.options.fullscreen) {
				o.viewer.setFullPage(true);
			}

			// Fire onComplete event
			if ($.isFunction(o.options.onComplete)) {
				o.options.onComplete.call(o);
			}
		});
	}
})(jQuery);

