Pugpig CSS Regression Tester
==========

This is a standalone tool designed to compare snapshots of Pugpig / HTML articles and then compare these pages to a modified version. It will then output snapshots displaying the differences between the two pages.

### Why?

There are several reasons why you may wish to do this. Consider this scenario:

A Front End Dev passes a static edition to someone to implement as CMS templates. At some point, we want to confirm that the templates have been implemented correctly. Typically this would be a manual case of comparing the static template to the output of the CMS. This is fine for a few templates but it may be that there are many templates that require testing and automating this would be preferable. This tool allows us to do this.

Another scenario and possibly the most valuable is as follows:

You're tasked to work on a project that you've never worked on and do not know very well. You modify the templates as requested and need to confirm that you have only changed exactly what was requested of you. With a site that has very well maintained HTML and CSS this might be simple, but as we know due to the nature of CSS it is quite easy to accidentally change an elements styling.

### Initial Setup

The first thing you should do is modify snapshot.js. You will need to enter your static edition details as well as the details for your CMS version of this edition. It's important to note that the CMS version of the edition should be identical in content to the static one or this tool will not work as expected.

```javascript
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
  }
```

### Comparing static to CMS

cd into the pugpig-css-regression folder.

```
phantomjs snapshot.js static
```

This will snapshot your static and generate your base snapshots into a snapshots folder.

```
phantomjs snapshot.js cms
```

This will snapshot your CMS edition and generate snapshots to compare with the static ones. It will then perform this comparison and generate any differences into a failures folder.

### Comparing CMS to CMS

Before you start your modifications, cd into the pugpig-css-regression folder.

```
phantomjs snapshot.js cms
```

Make your modifications and when you are ready to check what you have changed, run:

```
phantomjs snapshot.js cms
```

We are expecting failures and we will use these to confirm exactly what our changes have been across an entire edition.


### Testing different viewport sizes

By default the tool will take snapshots at 1024x768 however this is configurable. To modify the viewport dimensions, you can use the tool like so:

```
phantomjs snapshot.js static 320 480
```

This will generate snapshots at 320x480. These dimensions are completely configurable allowing you to test any viewport size you wish.