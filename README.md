Rideshare Simulator
=============

Ridesharing simulator built on the Google Maps API and AngularJS

The goal of this project is to answer the questions:

  - Would it be economically viable to offer a collective consumption taxi  service *a la* Uber or Lyft that offers **car pooling** in addition to  single-passenger rides?
  - At what portion of a regular fare would this model be financially viable?
  - Would it be an acceptable experience for a passenger to detour for and  wait for other passengers in the process of their ride?
  - What would the expected additional wait time be?  How would this vary by  *n* and *m*, where *n* is the maximum number of passengers per ride and *m*  is the maximum threshold of expected detour time to pick up a new  passenger in an already occupied car vs. dispatching a new car?


The methodology is to create a simple simulator with naive routing and passenger-location density models.  Distances, wait times, and fares can be generated using varying models (number of passengers per car, rate of ride requests, etc.)  If the naive estimations (which error toward inefficiency) prove viable, this would suggest a business model worth investigating.


Getting it running
------------------

is pretty simple.  `python -m SimpleHTTPServer` does the trick.  Any other static-file-serving HTTP server should work as well.  The currently committed Google Maps API key will only support localhost as the referring domain.

If you plan to spend any non-trivial amount of time with this, in `scripts/services/config.js` please add your own Google Maps API key instead of using mine (which is currently committed.)

There's an extensive TODO list in scripts/controllers/main.js 