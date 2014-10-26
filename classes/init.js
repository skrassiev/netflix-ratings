
function bindOnMainDisplay () {
	// Don't continue if the tooltip is hidden
	if ( jQuery(this).css('display') == 'none') {
		set_rating( '', 'imdb' );
		return false;
	}

	displayRating();
}

function bindOnBrowseDisplay () {
	// Don't continue if the tooltip is hidden
	if ( jQuery(this).attr('class') == '') {
		set_rating( '', 'imdb' );
		return false;
	}

	displayRating();
}

function displayRating () {

	if (jQuery('#imdb_rating').length == 0) {
		append_row('IMDB Rating:', 'imdb');
	}

	set_rating('Loading...', 'imdb');

	var title = get_title();
	var year = get_year();

	// Storage
	var imdb_rating = get_rating( title, 'imdb' );

	if ( imdb_rating ) {
		set_rating( imdb_rating, 'imdb' );
	} else {
		find_imdb_rating( title, year );
	}
}


function init() {
	jQuery('#BobMovie').watch('display', bindOnMainDisplay);
	jQuery('#bob-container').watch('class', bindOnBrowseDisplay);	
}

jQuery(document).ready(function() {
	init();
});
