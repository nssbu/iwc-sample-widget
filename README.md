# iwc-sample-widgets

This repository contains some sample widgets that demonstrate the IWC
capabilities in full.

Below you'll find instructions on running the widgets
locally as well as links to the proper documentation for IWC.

## Developing

After cloning this repository, navigate to the top level of the project and
run `npm install`.  Once the project's dependencies are properly installed,
running `gulp serve` will run a Browsersync server hosting each of the
example widgets and launch the landing page from which you can navigate to the
Data API and Intents API widgets.

Any changes made to `index.html` or *any* file within the `data-api` and
`intents-api` directories will rebuild the project and reload your
browser automatically.

## Building

To compile a distribution build, run `gulp build --host [host] --port [port]`, 
where the `host` and `port` variables are the host and port of the IWC server
to which the sample widgets will connect.