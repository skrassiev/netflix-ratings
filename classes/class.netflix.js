var ratings = chrome.storage.sync.get('netflix_ratings');

function append_row( title, id ) {
	$('div.info dl').append('<dt>' + title + '</dt><dd id="' + id + '_rating"></dd>')
}

function set_rating(rating, id) {
	$('#' + id + '_rating').html(rating);
}

function get_year() {
	var year = $('.bobMovieHeader > span.year').text();
	if ( year.length != 4 ) {
		year = year.substring( 0, 4 );
	}

	return year;
}

function get_type() {
	return $('.mpaaRating').text();
}

function get_duration() {
	return $('.duration').text();
}

function get_title() {
	var title = $('.bobMovieHeader > span.title').text();
	title = title.replace('(U.K.)', '');
	title = title.replace('(U.S.)', '');

	return title;
}

function save_rating( type, title, rating ) {
	if ( ! ratings.hasOwnProperty(type) ){
		ratings[type] = {}
	}

	ratings[type][title] = rating;

	chrome.storage.sync.set({'netflix_ratings': ratings});
}