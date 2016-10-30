# metalsmith-feed-decaf

> A feed generator for metalsmith

Heavily based on the original [metalsmith-feed](https://github.com/hurrymaplelad/metalsmith-feed) module, but without using Coffee (hence the 'decaf'), and also changing a few more things like the XML formatting looking nicer and more human readable, also checking for values with ´defined´ rather than just with falsy values. Not totally compatible, as some options are missing.

Thanks to Adam Hull for the initial module!

## Usage

Using the [metalsmith-collections](https://github.com/segmentio/metalsmith-collections) plugin is mandatory, otherwise the feed plugin doesn't know what data to generate the feed from.

Using permalinks and path is also required, otherwise the feed will have relative urls and some readers might get 'confused'.

```javascript
var collections = require('metalsmith-collections');
var feed = require('metalsmith-feed');
var permalinks = require('metalsmith-permalinks');
var metalPaths = require('metalsmith-path');


Metalsmith('example')
	.metadata({
		site: {
			title: 'Example.com'
			url: 'http://example.com'
			author: 'Example author'
		}
	})
	.use(metalPaths())
	.use(permalinks({ relative: false }))
	.use(collections({
		posts: {
			pattern: 'posts/*/index.*',
			sortBy: 'date',
			reverse: true
		}
	})
	.use(feed({
		collection: 'posts',
		destination: 'feeds/posts.xml'
	}))
	// ... rest of Metalsmith calls;
```

