var imdb_api = 'http://www.omdbapi.com/?tomatoes=true';
var imdb_url = "http://www.imdb.com/title/"
var imdb_tries = 0;
var in_progress = null;

var imdb_params = {
	plot: 'short',
};

function find_imdb_rating( title, year ) {
	set_imdb_title( title );
	set_imdb_year( year );
	set_imdb_type();

	imdb_request( title );
}

function imdb_details (data) {
}

function imdb_request( title ) {
	if (in_progress == title) {
		return;
	}

	in_progress = title;
	var query = imdb_api + '&' + jQuery.param(imdb_params);


	jQuery.ajax({
		url: query,
		dataType: 'json',
		success: function( data ) {

			first_match = null;

			match = _.detect(data.Search, function (hit){
				if (!first_match) {
					first_match = hit;
				}
				return hit.Title == imdb_params.s;
			});


			if ( !match ) {
				if ( imdb_tries < 2 ) {

					// if multi-word
					var title_words = _.initial(_.compact(title.split(' ')));

					if (first_match != null) {
						var title_received_words = _.initial(_.compact(first_match.Title.split(' ')));

						if (title_received_words.length == (title_words.length + 1) && (title_received_words[0].toLowerCase() == "the" || title_received_words[0].toLowerCase() == "a" || title_received_words[0].toLowerCase() == "an")) {
							if (title_received_words.slice(1).join(' ') == title_received_words.slice(1).join(' ')) {
								query_rating(first_match, imdb_tries, query, title);
								imdb_tries = 0;								
								return;
							}
						}
					}

					if (title_words.length > 0) {
						console.debug("s=" + imdb_params.s + ", title=" + title + ", neq=" + (imdb_params.s != title));
						if (imdb_params.s != title) {
							//already queried shortened
							set_imdb_year(false);
						}
						set_imdb_title(title_words.join(' '));
					} else {
						// Attempt one more try with an empty year
						set_imdb_year(false);
						imdb_tries++;
					}
					imdb_request(title);
					imdb_tries++;

					return false;
				} else {
					rating = 'no match - ' + get_imdb_search_link();
					set_rating(rating, 'imdb' );
					imdb_tries = 0;
				}
			} else {

				query_rating(match, imdb_tries, query, title);
				// jQuery.ajax({
				// 	url : imdb_api + '&' + jQuery.param({i:match.imdbID}),
				// 	dataType: 'json',
				// 	success: function( match ) {
				// 		rating = match.imdbRating ? match.imdbRating : 'Not yet rated';
				// 		rating = '<a target="_TOP" href="' + imdb_url + match.imdbID + '">' + rating + '</a> / 10';

				// 		if ( imdb_tries ) {
				// 			rating += '<br/><br/>(Tried twice to find IMDb rating. May be inaccurate. ' + get_imdb_search_link() + ' to confirm.)';
				// 		}

				// 		set_rating( rating, 'imdb' );
				// 		save_rating( title, rating, 'imdb' );

				// 	},
				// 	error: function( data ) {
				// 		set_rating( 'The IMDb API appears to be offline :/. <a target="_TOP" href="' + query + '">You can confirm so here.</a><br/><br/>All you can do is wait until the API comes back online. Please don\'t hate the extension!', 'imdb' );
				// 	}
				// });

				imdb_tries = 0;
			}

		},
		error: function( data ) {
			set_rating( 'The IMDb API appears to be offline :/. <a target="_TOP" href="' + query + '">You can confirm so here.</a><br/><br/>All you can do is wait until the API comes back online. Please don\'t hate the extension!', 'imdb' );
		}
	});
}

function query_rating(match, imdb_tries, query, title) {
	jQuery.ajax({
		url : imdb_api + '&' + jQuery.param({i:match.imdbID}),
		dataType: 'json',
		success: function( match ) {
			rating = match.imdbRating ? match.imdbRating : 'Not yet rated';
			rating = '<a target="_TOP" href="' + imdb_url + match.imdbID + '">' + rating + '</a> / 10';

			if ( imdb_tries ) {
				rating += '<br/><br/>(Tried twice to find IMDb rating. May be inaccurate. ' + get_imdb_search_link() + ' to confirm.)';
			}

			set_rating( rating, 'imdb' );
			save_rating( title, rating, 'imdb' );

		},
		error: function( data ) {
			set_rating( 'The IMDb API appears to be offline :/. <a target="_TOP" href="' + query + '">You can confirm so here.</a><br/><br/>All you can do is wait until the API comes back online. Please don\'t hate the extension!', 'imdb' );
		}
	});	
}

function get_imdb_search_link() {
	return '<a target="_TOP" href="http://www.imdb.com/find?q=' + imdb_params.s + '">search manually</a>';
}

function set_imdb_year( year ) {
	if ( year ) {
		imdb_params.y = year;
	} else {
		imdb_params = _.omit(imdb_params, 'y');
	}
}

function set_imdb_title( title ) {
	imdb_params.s = title;
}

function set_imdb_type() {
	var rating = get_type();
	var duration = get_duration();

	imdb_params.mt = (rating.indexOf('TV') != -1 || duration.indexOf('Episode') != -1 || duration.indexOf('Season') != -1 || duration.indexOf('Serie') != -1 ) ? 'TVS' : 'M';
}