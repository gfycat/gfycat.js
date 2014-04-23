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
    var overlayCanvas;
    var titleDiv;

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

    // overlayCanvas used to display a play button overlay if
    // video is not on "autoplay"
    function createOverlayCanvas() {
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.style.position = "absolute";
        overlayCanvas.style.left = "0";
        overlayCanvas.style.top = "0";
        overlayCanvas.onclick = pauseClick;
        overlayCanvas.onmouseout = gfyMouseOut;
        overlayCanvas.onmouseover = gfyMouseOver;
        gfyRootElem.appendChild(overlayCanvas);
    }

    function createVidTag() {
        vid = document.createElement('video');
        vid.className = 'gfyVid';
        if (optAutoplay)
            vid.autoplay = true;
        vid.loop = true;
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
        loadJSONP("http://gfycat.com/cajax/get/" + gfyId, function (data) {
            if (data) {
                gfyItem = data.gfyItem;
                gfyMp4Url = gfyItem.mp4Url;
                gfyWebmUrl = gfyItem.webmUrl;
                gfyFrameRate = gfyItem.frameRate;
                if (document.createElement('video').canPlayType) {
                    createVidTag();
                    createTitle();
                    createOverlayCanvas();
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
                    createTitle();
                    gif.onload = function () {
                        var ua = navigator.userAgent.toLowerCase();
                        if (ua.indexOf("msie") > -1)
                            titleDiv.style.width = gif.clientWidth + 'px';
                        else
                            titleDiv.style.width = gif.clientWidth - 20 + 'px';
                    }
                }
            } else {}
        });

    }

    function loadJSONP(url, callback, context) {
        var unique = 0;
        // INIT
        var name = "_jsonp_" + unique++;
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
        overlayCanvas.width = gfyWidth;
        overlayCanvas.height = gfyHeight;
        // subtract padding of titleDiv
        titleDiv.style.width = gfyWidth - 20 + 'px';
    }

    function vidLoaded() {
        setSize();
        if (!ctrlBox) {
            setWrapper();
            createCtrlBox();
        }
        if (!optAutoplay)
            drawPlayOverlay();
    }

    function clearPlayOverlay() {
        var ctx = overlayCanvas.getContext("2d");
        if (gfyWidth)
            ctx.clearRect(0, 0, gfyWidth, gfyHeight);
    }
    // When video is set to load paused, or when no playback controls are present, show a large Play button overlay.
    function drawPlayOverlay() {
        var ctx = overlayCanvas.getContext("2d");
        ctx.clearRect(0, 0, gfyWidth, gfyHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 5;
        var pWidth = 70;
        var pHeight = 80;
        var pRad = 5;
        if (gfyHeight < 160 || gfyWidth < 200) {
            pHeight = pHeight * gfyHeight / 240;
            pWidth = pWidth * gfyHeight / 240;
            pRad = 3;
        }
        drawPolygon(ctx, [
            [gfyWidth / 2 - pWidth / 2, gfyHeight / 2 - pHeight / 2],
            [gfyWidth / 2 + pWidth / 2, gfyHeight / 2],
            [gfyWidth / 2 - pWidth / 2, gfyHeight / 2 + pHeight / 2]
        ], pRad);
        ctx.stroke();
        ctx.fill();
    }

    function drawPolygon(ctx, pts, radius) {
        if (radius > 0) {
            pts = getRoundedPoints(pts, radius);
        }
        var i, pt, len = pts.length;
        ctx.beginPath();
        for (i = 0; i < len; i++) {
            pt = pts[i];
            if (i == 0) {
                ctx.moveTo(pt[0], pt[1]);
            } else {
                ctx.lineTo(pt[0], pt[1]);
            }
            if (radius > 0) {
                ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
            }
        }
        ctx.closePath();
    }

    function getRoundedPoints(pts, radius) {
        var i1, i2, i3, p1, p2, p3, prevPt, nextPt,
            len = pts.length,
            res = new Array(len);
        for (i2 = 0; i2 < len; i2++) {
            i1 = i2 - 1;
            i3 = i2 + 1;
            if (i1 < 0) {
                i1 = len - 1;
            }
            if (i3 == len) {
                i3 = 0;
            }
            p1 = pts[i1];
            p2 = pts[i2];
            p3 = pts[i3];
            prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
            nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
            res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
        }
        return res;
    };

    function getRoundedPoint(x1, y1, x2, y2, radius, first) {
        var total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
            idx = first ? radius / total : (total - radius) / total;
        return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
    };

    function setCtrlsPaused() {
        if (!optCtrls) {
            drawPlayOverlay();
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
        clearPlayOverlay();
        if (!optCtrls)
            return;
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

    function gfyMouseOver() {
        if (!optTitle || !gfyItem.title)
            return;
        titleDiv.style.display = 'block';
    }

    function gfyMouseOut() {
        if (!optTitle)
            return;
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
    }
}
