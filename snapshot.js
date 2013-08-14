phantom.casperPath = 'CasperJs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');
phantom.injectJs('jquery.js');

var system = require('system'),
  config = {
    mode: system.args[ 1 ],
    cms: {
      base: '', // e.g. http://which.dev/editions/edition_W1212-20130121151059/
      feed: '' // e.g. content.xml
    },
    'static': {
      base: '', // e.g. http://localhost/which-static/
      feed: '' // e.g. static.xml
    }
  },
  fs = require('fs'),
  casper = require('casper').create({
    viewportSize: {
      width: system.args[ 2 ] ? system.args[ 2 ] : 1024,
      height: system.args[ 3 ] ? system.args[ 3 ] : 768
    }
  }),
  css = require('./phantomcss.js'),
  url = initPageOnServer(),
  links = [],
  baseUrl = config[ config.mode ].base,
  feedUrl = config[ config.mode ].feed;

css.init({
  screenshotRoot: './snapshots',
  failedComparisonsRoot: './failures',
  testRunnerUrl: 'http://localhost:1337/empty'
});

function getLinks( baseUrl ) {
  var links = document.querySelectorAll('[rel="alternate"]');
  return [].map.call( links, function( link ) {
    return baseUrl + link.getAttribute('href');
  });
}

function snapshotLinks( links ) {
  links.forEach(function( link ) {
    casper.thenOpen(link, function() {
      casper.echo( '\nSnapshotting ' + link, 'INFO' );
      css.screenshot( 'html' );
    });
  });
}

function initPageOnServer() {

  var server = require('webserver').create();

  var service = server.listen(1337, function(request, response) {
    response.statusCode = 200;

    response.write('<html><body>This blank page is used for processing the images with HTML5 magics</body></html>');

    response.close();

  });

  return {
    testPage: 'http://localhost:1337',
    emptyPage: 'http://localhost:1337/empty'
  };
}

casper.start( baseUrl + feedUrl );

casper.then( function get_and_snapshot_links() {
  links = this.evaluate( getLinks, baseUrl );
  snapshotLinks( links );
});

casper.then( function now_check_the_snapshots(){
  css.compareAll();
});

casper.run( function end_it(){
  casper.echo('\nSuccessfully snapshotted ' + links.length + ' articles.', 'INFO' );
  phantom.exit( css.getExitStatus() );
});