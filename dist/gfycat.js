/*
 * gfyCollection:
 * Global object to be called on page load.
 * This runs through the page DOM for elements
 * with class "gfyitem" and attempts to convert
 * them to gfycat embeds by creating a new
 * gfyObject with the element.
 * Can also be used _after_ page load
 * by calling gfyCollection.get() to get
 * the collection of gfycat objects on the page
 * and re-initialize them or interact with them
 * as desired.
 */
var gfyCollection = function () {

    var collection = [],
        gfyClass = "gfyitem";

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

    function init(classname) {
        classname = typeof classname==="string" ? classname : gfyClass;
        scan(classname);
    }

    function scan(classname) {
        classname = typeof classname==="string" ? classname : gfyClass;

        // this can be run multiple times, so we'll add to any existing gfycats
        var last = collection.length;
        // find each gfycat on page and run its init
        elem_coll = byClass(classname, document);
        for (var i = 0; i < elem_coll.length; i++) {
            // don't need to worry about finding existing gfyitems - they are
            // replaced by gfyObject
            var gfyObj = new gfyObject(elem_coll[i]);
            collection.push(gfyObj);
        }
        // run init _after_ all are collected, because the init function deletes and recreates
        for (var i = last; i < collection.length; i++) {
            collection[i].init();
        }
    }

    function get() {
        // optional interface for an external script to interact with all objects on a page
        return collection;
    }

    return {
        init: init,
        get: get,
        scan: scan
    };

}();

if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", function() {
        gfyCollection.init();
    }, false);
else
    document.attachEvent("onreadystatechange", gfyCollection.init);

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
    // Options are set by data- attributes on tag
    var optExpand; // Option: will video grow to fill space
    var optTitle; // Option: display title on hover over
    var optCtrls; // Option: add controls to bottom right corner
    var optAutoplay = true; // Option: automatically play video when loaded
    // references to each html element
    var ctrlBox;
    var ctrlPausePlay;
    var ctrlSlower;
    var ctrlFaster;
    var vid;
    var gif;
    var overlay;
    var playButton;
    var titleDiv;
    var isMobile;
    var isReverse = false;
    var isGifOnly = false;
    var self = this;
    var gfyItem;
    var gfyWidth;
    var gfyHeight;


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
        titleDiv = document.createElement('div');
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
        titleDiv.style.left = "0";
        titleDiv.style.top = "0";
        titleDiv.style.display = "none";
        gfyRootElem.appendChild(titleDiv);
    }

    // overlay used to display a play button overlay if
    // video is not on "autoplay"
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.style.position = "absolute";
        overlay.style.width = "100%";
        overlay.style.height = "99%";
        overlay.style.left = "0";
        overlay.style.top = "0";
        overlay.style.boxSizing = "border-box";
        overlay.style.cursor = "pointer";
        overlay.style.textAlign = "center";
        overlay.onclick = pauseClick;
        overlay.onmouseout = gfyMouseOut;
        overlay.onmouseover = gfyMouseOver;
        overlay.button = createPlayButton();
        gfyRootElem.appendChild(overlay);
    }

    function createPlayButton() {
        playButton = document.createElement('div');
        playButton.className = "play-button";
        playButton.style.color = "#fff";
        playButton.style.fontSize = "40px";
        playButton.style.lineHeight = "60px";
        if (optCtrls) {
            playButton.style.marginTop = "-40px";
        } else {
            playButton.style.marginTop = "-39px";
        }
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
        vid.className = 'gfyVid';
        if (optAutoplay)
            vid.autoplay = true;
        vid.loop = true;
        if (isMobile)
            vid.controls = true;
        else
            vid.controls = false;
        vid.style.width = '100%';
        vid.style.height = 'auto';
        // poster url gfyName is case sensitive
        vid.setAttribute('poster', 'https://thumbs.gfycat.com/' + gfyItem.gfyName + '-poster.jpg');
        source2 = document.createElement('source');
        source2.src = gfyWebmUrl;
        source2.type = 'video/webm';
        source2.className = "webmsource";
        vid.appendChild(source2);
        source = document.createElement('source');
        source.src = gfyMp4Url;
        source.type = 'video/mp4';
        source.className = "mp4source";
        vid.appendChild(source);
        gfyRootElem.appendChild(vid);
    }

    // from mobiledetect.com
    function mobilecheck() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|android|ipad|playbook|silk|blackberry|htc|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    function createGifTag() {
        gif = document.createElement('img');
        gif.src = gfyItem.gifUrl;
        if (optExpand)
            gif.style.width = '100%';
        else
            gif.style.maxWidth = gfyItem.width + 'px';
        gif.style.height = 'auto';
        gif.onmouseout = gfyMouseOut;
        gif.onmouseover = gfyMouseOver;
        gfyRootElem.appendChild(gif);
        gfyRootElem.style.position = "relative";
        gfyRootElem.style.padding = 0;
    }

    function setWrapper() {
        gfyRootElem.style.position = "relative";
        gfyRootElem.style.padding = 0;
        if (!optExpand) {
            gfyRootElem.style.display = 'inline-block';
            gfyRootElem.style.overflow = 'hidden';
            gfyRootElem.style.boxSizing = 'border-box';
            gfyRootElem.style.MozBoxSizing = 'border-box';
            gfyRootElem.style.webkitBoxSizing = 'border-box';
        }
    }

    function createCtrlBox() {
        if (!optCtrls)
            return;
        ctrlRow = document.createElement('div');
        ctrlRow.style.position = 'relative';
        ctrlBox = document.createElement('div');
        ctrlBox.className = "CtrlBox";
        ctrlPausePlay = document.createElement('img');
        ctrlPausePlay.className = "gfyCtrlPause";
        ctrlPausePlay.src = "https://assets.gfycat.com/img/placeholder.png";
        ctrlPausePlay.style.backgroundImage = "url('https://assets.gfycat.com/img/gfycontrols.png')";
        ctrlPausePlay.style.cssFloat = 'right';
        ctrlPausePlay.style.marginRight = '5px';
        ctrlPausePlay.style.width = '12px';
        ctrlPausePlay.style.height = '12px';
        ctrlPausePlay.style.borderStyle = 'none';
        ctrlBox.appendChild(ctrlPausePlay);
        ctrlReverse = document.createElement('img');
        ctrlReverse.className = "gfyCtrlReverse";
        ctrlReverse.src = "https://assets.gfycat.com/img/placeholder.png";
        ctrlReverse.style.backgroundImage = "url('https://assets.gfycat.com/img/gfycontrols.png')";
        ctrlReverse.style.cssFloat = 'right';
        ctrlReverse.style.marginRight = '5px';
        ctrlReverse.style.width = '14px';
        ctrlReverse.style.height = '12px';
        ctrlReverse.style.backgroundPosition = '-46px 0';
        ctrlReverse.style.borderStyle = 'none';
        ctrlSlower = document.createElement('img');
        ctrlSlower.className = "gfyCtrlSlower";
        ctrlSlower.src = "https://assets.gfycat.com/img/placeholder.png";
        ctrlSlower.style.backgroundImage = "url('https://assets.gfycat.com/img/gfycontrols.png')";
        ctrlSlower.style.marginRight = '5px';
        ctrlSlower.style.width = '14px';
        ctrlSlower.style.height = '12px';
        ctrlSlower.style.cssFloat = 'right';
        ctrlSlower.style.borderStyle = 'none';
        ctrlFaster = document.createElement('img');
        ctrlFaster.className = "gfyCtrlFaster";
        ctrlFaster.src = "https://assets.gfycat.com/img/placeholder.png";
        ctrlFaster.style.backgroundImage = "url('https://assets.gfycat.com/img/gfycontrols.png')";
        ctrlFaster.style.width = '14px';
        ctrlFaster.style.height = '12px';
        ctrlFaster.style.cssFloat = 'right';
        ctrlFaster.style.marginRight = '5px';
        ctrlFaster.style.borderStyle = 'none';
        if (vid.paused)
            setCtrlsPaused();
        else
            setCtrlsPlaying();
        ctrlBox.style.position = 'relative';
        ctrlBox.style.cssFloat = 'right';
        ctrlBox.style.width = '100px';
        ctrlBox.style.padding = '5px';
        ctrlBox.style.margin = '0';
        ctrlBox.setAttribute("id", "ctr" + gfyId);
        ctrlPausePlay.onclick = pauseClick;
        ctrlReverse.onclick = reverse;
        ctrlBox.appendChild(ctrlFaster);
        ctrlBox.appendChild(ctrlSlower);
        ctrlBox.appendChild(ctrlReverse);
        ctrlBox.appendChild(ctrlPausePlay);
        ctrlRow.appendChild(ctrlBox);
        gfyRootElem.appendChild(ctrlRow);
    }

    function deleteVidTag() {
        gfyRootElem.removeChild(vid);
    }

    function init() {
        isMobile = mobilecheck();
        gfyId = gfyRootElem.getAttribute('data-id');
        if (gfyRootElem.getAttribute('data-title') == "true")
            optTitle = true;
        if (gfyRootElem.getAttribute('data-expand') == "true")
            optExpand = true;
        if (gfyRootElem.getAttribute('data-controls') == "true")
            optCtrls = true;
        if (gfyRootElem.getAttribute('data-autoplay') == "false")
            optAutoplay = false;
        var newElem = document.createElement('div');
        attrib_src = gfyRootElem.attributes;
        attrib_dest = newElem.attributes;
        for (var i = 0; i < attrib_src.length; i++) {
            var tst = attrib_src.item(i);
            var tst2 = tst.cloneNode();
            if (tst2.name == "style" && tst.value != 'null') {
                attrib_dest.setNamedItem(tst2);
            } else {}
            //attrib_dest.setNamedItem(attrib_src.item(i).cloneNode());
        }
        gfyRootElem.parentNode.replaceChild(newElem, gfyRootElem);
        gfyRootElem = newElem;
        // call gfycat API to get info for this gfycat
        loadJSONP("https://gfycat.com/cajax/get/" + gfyId, function (data) {
            if (data) {
                gfyItem = data.gfyItem;
                gfyMp4Url = gfyItem.mp4Url;
                gfyWebmUrl = gfyItem.webmUrl;
                gfyFrameRate = gfyItem.frameRate;
                if (document.createElement('video').canPlayType) {
                    createVidTag();
                    setWrapper();
                    if (optTitle) createTitle();
                    createOverlay();
                    // Can't grab the width/height until video loaded
                    if (vid.addEventListener)
                        vid.addEventListener("loadedmetadata", vidLoaded, false);
                    else
                        vid.attachEvent("onloadedmetadata", vidLoaded);
                    if (optAutoplay)
                        vid.play();
                } else {
                    isGifOnly = true;
                    createGifTag();
                    if (optTitle) createTitle();
                    gif.onload = function () {
                        if (!optTitle) return;
                        var ua = navigator.userAgent.toLowerCase();
                        if (ua.indexOf("msie") > -1)
                            titleDiv.style.width = gif.clientWidth + 'px';
                        else
                            titleDiv.style.width = gif.clientWidth - 20 + 'px';
                    };
                }
            }
        });

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

    function setSize() {
        gfyWidth = vid.offsetWidth;
        gfyHeight = vid.offsetHeight;
        // vid.videoWidth is the native size of the video. This stays the same even if the element is resized.
        // if optExpand is not set, then the video will never expand larger than videoWidth, so we need to choose this.
        if (!optExpand && gfyWidth > vid.videoWidth) {
            gfyWidth = vid.videoWidth;
            gfyHeight = vid.videoHeight;
        }
    }

    function vidLoaded() {
        setSize();
        if (!ctrlBox) {
            createCtrlBox();
        }
        if (!optAutoplay && !isMobile && !optCtrls)
            showPlayButton();
    }

    function setCtrlsPaused() {
        if (!optCtrls) {
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
        hidePlayButton();
        if (!optCtrls) return;
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
            vid.play();
            setCtrlsPlaying();
        } else {
            vid.pause();
            setCtrlsPaused();
        }
    }

    function showPlayButton() {
      overlay.button.style.display = "inline-block";
    }

    function hidePlayButton() {
       overlay.button.style.display = "none";
    }

    function gfyMouseOver() {
        if (!optTitle || !gfyItem.title) return;
        titleDiv.style.display = 'block';
    }

    function gfyMouseOut() {
        if (!optTitle) return;
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
        vid.play();
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
                vid.pause();
                vid.onplay = storeFunc;
            };
            vid.play();
        } else {
            vid.currentTime += (1 / gfyFrameRate);
        }
    }

    function stepBackward() {
        vid.currentTime -= (1 / gfyFrameRate);
    }

    function refresh() {
        vid.load();
        vid.play();
    }

    return {
        init: init,
        refresh: refresh
    };
};
