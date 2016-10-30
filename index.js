var url = require('url');
var RSS = require('rss');
var extend = require('extend');
var defined = require('defined');

// Heavily based on the original metalsmith-feed module
// https://github.com/hurrymaplelad/metalsmith-feed
module.exports = function(options) {
	options = options || {};

	var limit = defined(options.limit, 20);
	var destination = defined(options.destination, 'rss.xml');
	var collectionName = options.collection;
	var postDescription = defined(options.postDescription, function(file) {
		return defined(file.less, file.excerpt, file.contents);
	});
	var postCustomElements = options.postCustomElements;

	if(collectionName === undefined) {
		throw new Error('collection option is required');
	}

	return function(files, metalsmith, done) {

		var metadata = metalsmith.metadata();

		if(!metadata.collections) {
			return done(new Error('no collections configured - use metalsmith-collections'));
		}

		var collection = metadata.collections[collectionName];

		var feedOptions = {};
		[metadata.site, options].forEach((ob) => {
			Object.keys(ob).forEach((k) => {
				feedOptions[k] = ob[k];
			});
		});

		var siteURL = defined(feedOptions.site_url, feedOptions.url);

		if(!siteURL) {
			return done(new Error('either site_url or metadata.site.url must be configured'));
		}
		feedOptions.site_url = siteURL;

		feedOptions.feed_url = url.resolve(siteURL, destination);

		var feed = new RSS(feedOptions);
		
		if(limit) {
			collection = collection.slice(-limit);
		}

		collection.forEach((item) => {
			var data = extend({}, item, { description: postDescription(item) });
			
			if(postCustomElements) {
				data.custom_elements = postCustomElements(item);
			}

			if(!data.url && data.path) {
				data.url = url.resolve(siteURL, data.path);
			}

			feed.item(data);
		});

		files[destination] = { contents: new Buffer(feed.xml({ indent: true }), 'utf8') };
		
		done();

	};

};
