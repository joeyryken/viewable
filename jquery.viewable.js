/*! Copyright (c) 2008-2015 Brandon Aaron (http://brandonaaron.net) and Joey Ryken (http://www.ryken.ca)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: @VERSION
 *
 * Requires: jQuery 1.2+
 */

(function($) {

var elements = [], timeout;			// Note that timeout is no longer being used.

$.fn.extend({
	viewable: function(callback) {
		this
			.bind('viewable', callback)
			.each(function() {
				elements.push(this);
			});
		if ( $.isReady ) checkVisibility();
		return this;
	},
	
	stopViewable: function() {
		return this.each(function() {
			var self = this;
			$.each( elements, function(i, element) {
				if ( self == element )
					delete elements[i];
			});
		});
	}
});

// Check the elements visibility
function checkVisibility() {
	
	// Get necessary viewport dimensions (Y)
	var winHeight = $(window).height(),
	    winTop    = self.pageYOffset || $.boxModel && document.documentElement.scrollTop || document.body.scrollTop,
	    winBottom = winHeight + winTop;

	// Get necessary viewport dimensions (X)
	var winWidth = $(window).width(),
	    winLeft   = self.pageXOffset || $.boxModel && document.documentElement.scrollLeft || document.body.scrollLeft,
	    winRight = winWidth + winLeft;
	
	// Loop through the elements and check to see if they are viewable
	$.each(elements, function(i, element) {
		if ( !element ) return;
		
		// Get element top offset and height
		var elTop      = $(element).offset().top, 
		    elHeight   = parseInt( $(element).css('height') ),
		    elBottom   = elTop + elHeight,
		    percentageY = 0, hiddenTop  = 0, hiddenBottom = 0;

		// Get element left offset and width
		var elLeft     = $(element).offset().left, 
		    elWidth    = parseInt( $(element).css('width') ),
		    elRight   = elLeft + elWidth,
		    percentageX = 0, hiddenLeft  = 0, hiddenRight = 0;

		// Return value
		var percentage = 0;
		
		// Get percentage of unviewable area (Y)
		if ( elTop < winTop )             // Area above the viewport
			hiddenTop = winTop-elTop;
		if ( elBottom > winBottom )       // Area below the viewport
			hiddenBottom = elBottom-winBottom;
		
		percentageY = 1 - ((hiddenTop + hiddenBottom)/elHeight);


		// Get percentage of unviewable area (X)
		if ( elLeft < winLeft )             // Area above the viewport
			hiddenLeft = winLeft-elLeft;
		if ( elRight > winRight )       // Area below the viewport
			hiddenRight = elRight-winRight;
		
		percentageX = 1 - ((hiddenLeft + hiddenRight)/elWidth);

		percentage = percentageX * percentageY;
		
		// Trigger viewable event along with percentage of viewable
		$(element).trigger('viewable', [ percentage ]);
	});
};

$(function() {
	
	// Bind scroll function to window when document is ready
	$(window)
		.bind('scroll.viewable', function() {

			// Commenting out this block because if the user slowly/continuously scrolls viewability could last several seconds but this code won't count it. 
				/*
					// Clear timeout if scrolling hasn't paused
					if ( timeout ) clearTimeout(timeout);
					// Create timeout to run actual calculations for once scrolling has paused
					timeout = setTimeout(checkVisibility, 100);
				*/
			// ... Now it simply counts during scroll...
			checkVisibility();
		});

	// Also bind to the browser window in case of resize
	$(window).bind('resize', function(){checkVisibility();});
	
	// Check to see if the element is already visible
	checkVisibility();
});

})(jQuery);
