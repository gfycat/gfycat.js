/**
 * Copyright 2014-2016 Gfycat, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/*
 * A new gfyObject is created for each
 * gfycat embed on the page.  This object
 * creates all video/control elements
 * and is self-contained with all functions
 * for interacting with its own gfycat video.
 */

var gfyObject = function (gfyElem) {
    var gfyRootElem = gfyElem;
    var gfyId;
    var optDataset; // data- attributes from init

    var opt = {
      expand: false, // Option: will video grow to fill space
      title: false, // Option: display title on hover over
      controls: false, // Option: display title on hover over
      autoplay: true, // Option: automatically play video when loaded
      optimize: true, // Option: play video only when in viewport and lazy load for .gif
      gif: false // Option: gif is loaded instead of video
    };

    // references to each html element
    var ctrlBox;
    var ctrlPausePlay;
    var ctrlSlower;
    var ctrlFaster;
    var vid;
    var gif;
    var overlay;
    var titleDiv;
    var isMobile;
    var isReverse = false;
    var self = this;
    var gfyItem;
    var inView = false;

    var isVideoSourcesSet = false;

    var bool = {
      "true": true,
      "false": false
    };

    // Helper function -- only required because some browsers do not have get by class name
    function byClass(className, obj) {
        if (obj.getElementsByClassName) {
            return obj.getElementsByClassName(className);
        } else {
            var retnode = [];
            var elem = obj.getElementsByTagName('*');
            for (var i = 0; i < elem.length; i++) {
                if ((' ' + elem[i].className + ' ').indexOf(' ' + className + ' ') > -1) retnode.push(elem[i]);
            }
            return retnode;
        }
    }

    function createTitle() {
        if (!opt.title || !gfyItem.title) return;
        titleDiv = document.createElement('div');
        titleDiv.className = "title";
        titleDiv.style.position = "absolute";
        try {
            titleDiv.style.backgroundColor = "rgba(0,0,0,0.4)";
        } catch (e) {
            // IE does not have rgba
            titleDiv.style.backgroundColor = "#000";
            // Allow non-IE browsers without rgba to carry on
            try {
                titleDiv.style.filter = 'alpha(opacity=60)';
            } catch (e) {}
        }
        titleDiv.style.color = "#fff";
        titleDiv.style.fontFamily = "Arial,sans-serif";
        titleDiv.style.fontSize = "20px";
        titleDiv.style.padding = "10px";
        titleDiv.innerHTML = gfyItem.title;
        titleDiv.style.width = "100%";
        titleDiv.style.left = "0";
        titleDiv.style.top = "0";
        titleDiv.style.boxSizing = "border-box";
        titleDiv.style.display = "none";
        gfyRootElem.appendChild(titleDiv);
        overlay.onmouseout = gfyMouseOut;
        overlay.onmouseover = gfyMouseOver;
    }

    // overlay used to display a play button overlay if
    // video is not on "autoplay"
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = "overlay";
        overlay.style.position = "absolute";
        overlay.style.width = "100%";
        if (opt.controls) {
          overlay.style.height = "calc(100% - 22px)";
        } else {
          overlay.style.height = "100%";
        }
        overlay.style.left = "0";
        overlay.style.top = "0";
        overlay.style.boxSizing = "border-box";
        overlay.style.cursor = "pointer";
        overlay.style.textAlign = "center";
        overlay.onclick = pauseClick;
        if (!opt.controls) overlay.button = createPlayButton();
        gfyRootElem.appendChild(overlay);
    }

    function createPlayButton() {
        var playButton = document.createElement('div');
        playButton.className = "play-button";
        playButton.style.color = "#fff";
        playButton.style.fontSize = "40px";
        playButton.style.lineHeight = "60px";
        playButton.style.marginTop = "-39px";
        playButton.style.position = "relative";
        playButton.style.top = "50%";
        playButton.style.border = "1px solid rgba(100, 100, 100, .3)";
        playButton.style.borderRadius = "50%";
        playButton.style.boxSizing = "border-box";
        playButton.style.width = "75px";
        playButton.style.height = "75px";
        playButton.style.padding = "9px 0 0 7px";
        playButton.style.backgroundColor = "rgba(255,255,255,.3)";
        playButton.style.textShadow = "#333 0px 0px 1px";
        playButton.innerHTML = "&#9654;";
        playButton.style.display = "none";
        overlay.appendChild(playButton);
        return playButton;
    }

    function createVidTag() {
        vid = document.createElement('video');
        vid.className = 'gfy-video';
        if (opt.autoplay) vid.autoplay = true;
        vid.loop = true;
        vid.controls = isMobile ? true : false;
        vid.style.width = '100%';
        vid.style.height = 'auto';
        // poster url gfyName is case sensitive
        vid.setAttribute('poster', 'https://thumbs.gfycat.com/' + gfyItem.gfyName + '-poster.jpg');
        gfyRootElem.appendChild(vid);
        if (vid.addEventListener) {
          vid.addEventListener("loadedmetadata", vidLoaded, false);
        } else {
          vid.attachEvent("onloadedmetadata", vidLoaded);
        }
    }

    function setVideoSources() {
      if (vid && !isVideoSourcesSet) {
        source2 = document.createElement('source');
        source2.src = gfyItem.webmUrl;
        source2.type = 'video/webm';
        source2.className = "webmsource";
        vid.appendChild(source2);
        source = document.createElement('source');
        source.src = gfyItem.mp4Url;
        source.type = 'video/mp4';
        source.className = "mp4source";
        vid.appendChild(source);
        isVideoSourcesSet = true;
      }
    }

    // from mobiledetect.com
    function mobilecheck() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|android|ipad|playbook|silk|blackberry|htc|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    function createGifTag() {
        gif = document.createElement('img');
        gif.className = "gif";
        gif.src = opt.optimize ? '' : gfyItem.gifUrl;
        if (opt.expand) {
          gif.style.width = '100%';
        } else {
          gif.style.maxWidth = gfyItem.width + 'px';
        }
        gif.style.height = 'auto';
        gif.onmouseout = gfyMouseOut;
        gif.onmouseover = gfyMouseOver;
        gfyRootElem.appendChild(gif);
    }

    function setWrapper() {
        if (!opt.expand) {
            gfyRootElem.style.display = 'inline-block';
            gfyRootElem.style.overflow = 'hidden';
            gfyRootElem.style.boxSizing = 'border-box';
            gfyRootElem.style.MozBoxSizing = 'border-box';
            gfyRootElem.style.webkitBoxSizing = 'border-box';
        }
    }

    function createCtrlBox() {
        if (!opt.controls || ctrlBox)
            return;
        ctrlBox = document.createElement('div');
        ctrlBox.className = "controls";
        ctrlBox.style.position = 'relative';
        ctrlBox.style.display = "flex";
        ctrlBox.style.justifyContent = "flex-end";
        ctrlBox.style.padding = '5px';
        ctrlBox.style.margin = '0';
        ctrlBox.style.width = '100%';
        ctrlBox.style.boxSizing = "border-box";

        var ctrlIconsUrl = "https://assets.gfycat.com/img/gfycontrols.png";
        var innerHTML = '<div class="gfyCtrlPause" style="display:inline-block;width:12px;height:12px;' +
          'margin-right:5px;border-style:none;background-repeat:no-repeat;' +
          'background-image:url(\'' + ctrlIconsUrl + '\');cursor:pointer;"></div>' +
          '<div class="gfyCtrlReverse" style="display:inline-block;width:14px;height:12px;' +
            'margin-right:5px;border-style:none;background-repeat:no-repeat;' +
            'background-image:url(\'' + ctrlIconsUrl + '\');cursor:pointer;"></div>' +
          '<div class="gfyCtrlSlower" style="display:inline-block;width:14px;height:12px;' +
            'margin-right:5px;border-style:none;background-repeat:no-repeat;' +
            'background-image:url(\'' + ctrlIconsUrl + '\');cursor:pointer;"></div>' +
          '<div class="gfyCtrlFaster" style="display:inline-block;width:14px;height:12px;' +
            'margin-right:5px;border-style:none;background-repeat:no-repeat;' +
            'background-image:url(\'' + ctrlIconsUrl + '\');cursor:pointer;"></div>';

        ctrlBox.innerHTML = innerHTML;
        ctrlPausePlay = ctrlBox.getElementsByClassName('gfyCtrlPause')[0];
        ctrlPausePlay.onclick = pauseClick;
        ctrlReverse = ctrlBox.getElementsByClassName('gfyCtrlReverse')[0];
        ctrlReverse.onclick = reverse;
        ctrlReverse.style.backgroundPosition = '-46px 0';
        ctrlSlower = ctrlBox.getElementsByClassName('gfyCtrlSlower')[0];
        ctrlFaster = ctrlBox.getElementsByClassName('gfyCtrlFaster')[0];

        if (vid.paused) {
            setCtrlsPaused();
        } else {
            setCtrlsPlaying();
        }
        gfyRootElem.appendChild(ctrlBox);
    }

    function deleteVidTag() {
        gfyRootElem.removeChild(vid);
    }

    /**
    * @param {?Object} newData - can be passed to re-initialize gfy element
    */
    function init(newData) {
        isMobile = mobilecheck();
        initData(newData);
        var newElem = document.createElement('div');
        attrib_src = gfyRootElem.attributes;
        attrib_dest = newElem.attributes;
        for (var i = 0; i < attrib_src.length; i++) {
            var tst = attrib_src.item(i);
            var tst2 = tst.cloneNode();
            if (tst2.name == "style" && tst.value != 'null') {
                attrib_dest.setNamedItem(tst2);
            }
            //attrib_dest.setNamedItem(attrib_src.item(i).cloneNode());
        }
        gfyRootElem.parentNode.replaceChild(newElem, gfyRootElem);
        gfyRootElem = newElem;
        gfyRootElem.style.position = "relative";
        gfyRootElem.style.padding = 0;
        gfyRootElem.style.fontSize = 0;
        try {
          if (!gfyId) throw new Error("Gfyid is required!");
        } catch (err) {
          console.log(err);
          return;
        }
        // call gfycat API to get info for this gfycat
        loadJSONP("https://gfycat.com/cajax/get/" + gfyId, function (data) {
            if (data) {
                gfyItem = data.gfyItem;
                if (!opt.gif && document.createElement('video').canPlayType) {
                    createVidTag();
                    createCtrlBox();
                    if (opt.optimize) {
                      if (vid.poster) {
                          var image = new Image();
                          image.onload = function () {
                            watchVideoOptimization();
                          };
                          image.onerror = function() {
                            watchVideoOptimization();
                          };
                          image.src = vid.poster;
                      } else {
                        watchVideoOptimization();
                      }
                    } else {
                      setVideoSources();
                      if (opt.autoplay) vid.play();
                    }
                    setWrapper();
                    createOverlay();
                    createTitle();
                } else {
                    opt.gif = true;
                    createGifTag();
                    createTitle();
                    checkScrollGif();
                    watchElementInViewport(checkScrollGif);
                    gif.onload = function () {
                        if (!opt.title || !gfyItem.title) return;
                        var ua = navigator.userAgent.toLowerCase();
                        titleDiv.style.width = gif.clientWidth + 'px';
                    };
                }
            }
        });
    }

    function watchVideoOptimization() {
      checkScrollVideo();
      watchElementInViewport(checkScrollVideo);
    }

    /**
    * @param {?Object} newData - can be passed to re-initialize gfy element
    */
    function initData(newData) {
      if (!optDataset) optDataset = gfyRootElem.dataset;
      if (newData && newData.id) {
        gfyId = newData.id;
      } else if (!gfyId) {
        gfyId = optDataset.id;
      }
      updateOption("title", "true", newData);
      updateOption("expand", "true", newData);
      updateOption("controls", "true", newData);
      updateOption("autoplay", "false", newData);
      updateOption("optimize", "true", newData);
      updateOption("gif", "true", newData);

      optDataset = {}; // clear after the first init
    }

    function updateOption(optName, nonDefaultValue, newData) {
      var optValue;
      if (newData && newData.hasOwnProperty(optName)) {
        opt[optName] = bool[newData[optName]];
      } else if (optDataset[optName] === nonDefaultValue) {
        opt[optName] = bool[nonDefaultValue];
      }
    }

    // used to load ajax info for each gfycat on the page
    // callback functions must be setup and uniquely named for each
    function loadJSONP(url, callback, context) {
        var unique = Math.floor((Math.random()*10000000) + 1);
        // INIT
        var name = "_" + gfyId + "_" + unique++;
        if (url.match(/\?/)) url += "&callback=" + name;
        else url += "?callback=" + name;

        // Create script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Setup handler
        window[name] = function (data) {
            callback.call((context || window), data);
            document.getElementsByTagName('head')[0].removeChild(script);
            script = null;
            try {
                delete window[name];
            } catch (e) {}
        };

        // Load JSON
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function checkScrollVideo() {
        var checkInView = isElementInViewport(vid);
        if (checkInView && !inView) {
            setVideoSources();
            if (opt.autoplay) play();
            inView = true;
        } else if (!checkInView && inView) {
            pause();
            inView = false;
        }
    }

    function checkScrollGif() {
        var checkInView = isElementInViewport(gif);
        if (checkInView && !inView) {
            if (!gif.src || gif.src === window.location.href) {
                gif.src = gfyItem.gifUrl;
            }
            inView = true;
        }
    }

    /**
    * Returns 'true' if 50% of the element is in view in each direction
    */
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= -rect.height / 2 &&
            rect.bottom <= (window.innerHeight ||
                document.documentElement.clientHeight) + rect.height / 2 &&
            rect.left >= -rect.width / 2 &&
            rect.right <= (window.innerWidth ||
                document.documentElement.clientWidth) + rect.width / 2
        );
    }

    function watchElementInViewport(handler) {
        if (window.addEventListener) {
            addEventListener('DOMContentLoaded', handler, false);
            addEventListener('load', handler, false);
            addEventListener('scroll', handler, false);
            addEventListener('resize', handler, false);
        } else if (window.attachEvent)  {
            attachEvent('onDOMContentLoaded', handler); // IE9+ :(
            attachEvent('onload', handler);
            attachEvent('onscroll', handler);
            attachEvent('onresize', handler);
        }
    }

    function vidLoaded() {
        if (!opt.autoplay && !isMobile && !opt.controls) {
          showPlayButton();
        }

        //handle pause via closing full screen on iOS
        if (window.addEventListener) {
            vid.addEventListener('webkitendfullscreen', function () {
                pause();
            });
        } else if (window.attachEvent)  {
            vid.attachEvent('webkitendfullscreen', function () {
                pause();
            });
        }
    }

    function setCtrlsPaused() {
        if (!opt.controls) {
            showPlayButton();
            return;
        }
        ctrlPausePlay.style.backgroundPosition = '-71px 0';
        ctrlSlower.style.backgroundPosition = '0 0';
        ctrlSlower.style.marginLeft = "6px";
        ctrlFaster.style.backgroundPosition = '-192px 0';
        ctrlFaster.style.width = "8px";
        ctrlFaster.onclick = stepForward;
        ctrlSlower.onclick = stepBackward;
    }

    function setCtrlsPlaying() {
        if (!opt.controls) {
          hidePlayButton();
          return;
        }
        ctrlPausePlay.style.backgroundPosition = '-95px 0';
        ctrlFaster.style.backgroundPosition = '-20px 0';
        ctrlSlower.style.backgroundPosition = '-165px 0';
        ctrlFaster.style.width = "14px";
        ctrlSlower.style.marginLeft = "0px";
        ctrlFaster.onclick = faster;
        ctrlSlower.onclick = slower;
    }

    function pauseClick() {
        if (vid.paused) {
            play();
        } else {
            pause();
        }
    }

    function play() {
      vid.play();
      setCtrlsPlaying();
    }

    function pause() {
      vid.pause();
      setCtrlsPaused();
    }

    function showPlayButton() {
      if (overlay && overlay.button) {
        overlay.button.style.display = "inline-block";
      }
    }

    function hidePlayButton() {
       if (overlay && overlay.button) {
         overlay.button.style.display = "none";
       }
    }

    function gfyMouseOver() {
        if (!opt.title || !gfyItem.title) return;
        titleDiv.style.display = 'block';
    }

    function gfyMouseOut() {
        if (!opt.title || !gfyItem.title) return;
        titleDiv.style.display = 'none';
    }

    function reverse() {
        // Change controls over: reverse button to forward, and slower/faster to step forward/step back.
        ctrlPausePlay.style.backgroundPosition = '-95px 0';
        ctrlSlower.style.backgroundPosition = '0 0';
        ctrlSlower.style.marginLeft = "6px";
        ctrlFaster.style.backgroundPosition = '-192px 0';
        ctrlFaster.style.width = "8px";
        ctrlFaster.onclick = stepForward;
        ctrlSlower.onclick = stepBackward;
        vid.pause();
        setVideoSources();
        // Swap video source tags for reverse encoded files
        var mp4src = byClass("mp4source", vid)[0];
        var webmsrc = byClass("webmsource", vid)[0];
        if (isReverse) {
            mp4src.src = mp4src.src.replace(/-reverse\.mp4/g, ".mp4");
            mp4src.src = mp4src.src.replace(/-reverse\.webm/g, ".webm");
            webmsrc.src = webmsrc.src.replace(/-reverse\.webm/g, ".webm");
            ctrlReverse.style.backgroundPosition = '-46px 0';
            isReverse = false;
        } else {
            mp4src.src = mp4src.src.replace(/\.mp4/g, "-reverse.mp4");
            mp4src.src = mp4src.src.replace(/\.webm/g, "-reverse.webm");
            webmsrc.src = webmsrc.src.replace(/\.webm/g, "-reverse.webm");
            ctrlReverse.style.backgroundPosition = '-141px 0';
            isReverse = true;
        }
        vid.playbackRate = 1;
        vid.load();
        play();
    }

    function slower() {
        if (vid.playbackRate <= 1)
            vid.playbackRate = vid.playbackRate / 2;
        else
            vid.playbackRate--;
    }

    function faster() {
        if (vid.playbackRate <= 1) {
            vid.playbackRate = vid.playbackRate * 2;
        } else {
            vid.playbackRate++;
        }
    }

    function stepForward() {
        if (window.opera) {
            var storeFunc = vid.onplay;
            vid.onplay = function () {
                pause();
                vid.onplay = storeFunc;
            };
            play();
        } else {
            vid.currentTime += (1 / gfyItem.frameRate);
        }
    }

    function stepBackward() {
        vid.currentTime -= (1 / gfyItem.frameRate);
    }

    function refresh() {
        vid.load();
        play();
    }

    function getRootElement() {
      return gfyRootElem;
    }

    return {
        init: init,
        refresh: refresh,
        getRootElement: getRootElement
    };
};
