/**
 * Flickity carousel SVG 'arrow in circle' path string.
 *
 * @type {String}
 */
const arrowShape = "m50.001 99.999c-27.613 0-49.999-22.385-49.999-49.999 0-27.613 22.385-49.999 49.999-49.999 27.613 0 49.999 22.385 49.999 49.999 0 27.613-22.385 49.999-49.999 49.999zm0-7.4998c23.471 0 42.498-19.027 42.498-42.498s-19.027-42.498-42.498-42.498-42.498 19.027-42.498 42.498 19.027 42.498 42.498 42.498zm1.7647-20.265-.36308.42058c-1.3313 1.3313-3.4144 1.4523-4.8826.36308l-.42058-.36308-20.003-20.003c-1.3314-1.3314-1.4523-3.4151-.36267-4.8829l.36317-.42058 20.007-19.999c1.4647-1.4641 3.839-1.4637 5.3031.001 1.331 1.3315 1.4517 3.4147.36214 4.8826l-.36314.42054-13.609 13.603 33.457-.0015c1.8984 0 3.4673 1.4107 3.7155 3.2409l.03423.50884c0 1.8984-1.4107 3.4673-3.2409 3.7155l-.50884.03424-33.447.0015 13.596 13.596c1.3313 1.3313 1.4523 3.4144.36308 4.8826l-.36308.42058z";

/**
 * Flickity carousel options.
 *
 * @type {Object}
 */
const heroCarouselOptions = {
    cellAlign: "center",
    draggable: true,
    adaptiveHeight: true,
    imagesLoaded: true,
    lazyLoad: true,
    prevNextButtons: true,
    pageDots: false,
    accessibility: false,
    wrapAround: true,
    autoPlay: 8000,
    pauseAutoPlayOnHover: true
};


/**
 * YouTube Player API callback function when loaded.
 *
 * @module {YT}
 * @method onYouTubeIframeAPIReady
 */
function onYouTubeIframeAPIReady()
{
    if (typeof youtubePlayerInfo === "undefined") {
        return false;
    }

    let controls = [];
    let ytPlayButton = [];
    let ytPauseButton = [];

    // Multiple video players.
    youtubePlayerInfo.forEach((playerInfo, index) => {
        ytPlayer[index] = new YT.Player(playerInfo.playerId, {
            height: playerInfo.height,
            width: playerInfo.width,
            videoId: playerInfo.videoId,
            playerVars: playerInfo.params,
            events: {

                /**
                 * Callback function for YouTube API 'onReady' state.
                 *
                 * @param {Event} event
                 */
                onReady: (event) => {
                    controls = document.querySelector(
                        ".controller--" + playerInfo.videoId
                    );
                    ytPlayButton = controls.querySelector(".button--play");
                    ytPlayButton.addEventListener("click", () => {
                        ytPlayer[index].playVideo()
                    });

                    ytPauseButton = controls.querySelector(".button--pause");
                    ytPauseButton.addEventListener("click", () => {
                        ytPlayer[index].pauseVideo()
                    });
                },

                /**
                 * Callback function for YouTube API 'onStateChange' state.
                 *
                 * @param {Event} event
                 */
                onStateChange: (event) => {
                    var ytdone = false;

                    if (event.data == YT.PlayerState.PLAYING && ! ytdone) {
                        ytPlayButton.disabled = true;
                        ytPauseButton.disabled = false;
                        ytdone = true;
                    } else {
                        ytPlayButton.disabled = false;
                        ytPauseButton.disabled = true;
                        ytdone = false;
                    }
                }

            }
        });
    });
}


/**
 * Has (Object|Node) been defined? Does (Object|Node) exist?
 *
 * @param {object|array|string} thing
 */
function exists(thing)
{
    "use strict";

    return ! (
        typeof thing === "undefined" ||
        thing === null ||
        thing === false ||
        thing.length < 1
    );
}


/**
 * Hero Carousel with Video controls.
 *
 * @param {NodeElement} container
 *
 * @method Hero
 * @uses {Module} Flickity
 * @see https://github.com/metafizzy/flickity
 */
const Hero = (container) => {
    "use strict";

    hero = new Flickity(container, heroCarouselOptions);

    // -- On slide change.
    hero.on("change", (index) => {
        let videoCells = [];
        hero.cells.forEach((cell, i) => {
            if (cell.element.classList.contains("has-video")) {
                videoCells.push(cell.element);
            }
        });

        if (videoCells.length > 0) {
            videoCells.forEach((vcell, index) => {
                // Pause all other videos.
                if (vcell.classList.contains("has-video")) {
                    if (vcell.classList.contains("youtube")) {
                        ytPlayer[index].pauseVideo();
                    } else if (vcell.classList.contains("vimeo")) {
                        vmPlayer.pause();
                    } else if (vcell.classList.contains("local")) {
                        localVideo.pause();
                    }
                }

                if (vcell == hero.selectedElement) {
                    // Play video if active slide contains one.
                    if (vcell.classList.contains("has-video")) {
                        if (vcell.classList.contains("youtube")) {
                            ytPlayer[index].playVideo();
                        } else if (vcell.classList.contains("vimeo")) {
                            vmPlayer.play();
                        } else if (vcell.classList.contains("local")) {
                            localVideo.play();
                        }
                    }

                    return;
                }
            });
        }
    });

    // Recalculate on window load and resize.
    window.addEventListener("load", () => hero.resize());
    window.addEventListener("resize", () => hero.resize());
};


(function () {
    "use strict";

    /**
     * Initialize Masthead Hero (if multiple).
     *
     * @type {NodeElement} heroSlider
     * @uses {Method} Hero
     */
    let heroSlider = document.querySelector(".hero.multiple");
    if (exists(Flickity) &&
        exists(heroSlider) &&
        heroSlider.querySelectorAll(".hero-item").length > 1
    ) {
        Hero(heroSlider);
    }
})();
