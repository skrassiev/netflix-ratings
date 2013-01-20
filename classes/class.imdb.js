var imdb_api = 'http://imdbapi.org/';

var imdb_params = {
	type: 'json',
	plot: 'simple',
	limit: 1,
	episode: 0,
};

function set_imdb_rating( title, year ) {
	set_imdb_title( title );
	set_imdb_year( year );
	set_imdb_type();

	// Storage
	var rating = get_rating(title, 'imdb');

	if ( rating ) {
		set_rating( rating, 'imdb' );
	} else {
		imdb_request( title );
	}
}

function imdb_request( title ) {
	var query = imdb_api + '?' + $.param(imdb_params);

	$.getJSON(query, function(data) {

		if ( !data[0] ) {
			// Attempt one more try with an empty year
			if ( !tries ) {
				tries++;
				set_imdb_year(false);
				imdb_request();
			} else {
				rating = 'Error. ' + get_imdb_search_link();
			}
		} else {
			rating = data[0].rating ? data[0].rating.toFixed(1) : 'Not yet rated';
			rating = '<a target="_TOP" href="' + data[0].imdb_url + '">' + rating + '</a> / 10';

			if ( tries ) {
				rating += '<br/><br/>(Tried twice to find IMDb rating. May be inaccurate. ' + get_imdb_search_link() + ' to confirm.)';
			}
			tries = 0;
		}

		set_rating( rating, 'imdb' );
		save_rating( title, rating, 'imdb' );
	});
}

function get_imdb_search_link() {
	return '<a target="_TOP" href="http://www.imdb.com/find?q=' + imdb_params.q + '">Search manually</a>';
}

function set_imdb_year( year ) {
	if ( year ) {
		imdb_params.yg = 1;
		imdb_params.year = year;
	} else {
		imdb_params.yg = 0;
	}
}

function set_imdb_title( title ) {
	imdb_params.q = title;
}

function set_imdb_type() {
	var rating = get_type();
	var duration = get_duration();

	imdb_params.mt = (rating.indexOf('TV') != -1 || duration.indexOf('Episode') != -1 || duration.indexOf('Season') != -1 || duration.indexOf('Serie') != -1 ) ? 'TVS' : 'M';
}