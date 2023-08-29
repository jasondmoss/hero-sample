## A Sample Hero Carousel (Image/Video)

I worked on a project earlier in the year, where the client wanted a 'hero carousel' that would support both images and YouTube videos. The video would start playing (looped and muted) when the current slide is active, and pause when the active slide loses focus (slide change). They also wanted a play/pause button available when the video slide was active. My solution was to use the [Flickity](https://flickity.metafizzy.co/) library and by integrating the [YouTube Player API](https://developers.google.com/youtube).

This solution was implemented within the custom theme of the site in question, but would be trivial to export to a dedicated module for reuse...

**Note:** _This is example is not actually functional in this, it's current state._
