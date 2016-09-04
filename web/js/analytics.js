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

var GfyAnalytics = function() {
  var utc = 0, stc = 0;

  function generateUUID() {
    var b = new Date().getTime();
    var a = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(e) {
      var d = (b + Math.random() * 16) % 16 | 0;
      b = Math.floor(b / 16);
      return (e == 'x' ? d : (d & 3 | 8)).toString(16);
    });

    return a;
  }

  function createCookie(c, d, e) {
    var a = '';
    if (e) {
      var b = new Date();
      b.setTime(b.getTime() + (e * 1000));
      a = '; expires=' + b.toGMTString();
    }

    document.cookie = c + '=' + d + a + ';domain=.gfycat.com;path=/';
  }

  function readCookie(b) {
    var e = b + '=';
    var a = document.cookie.split(';');
    for (var d = 0; d < a.length; d++) {
      var f = a[d];
      while (f.charAt(0) == ' ') {
        f = f.substring(1, f.length);
      }

      if (f.indexOf(e) === 0) {
        return f.substring(e.length, f.length);
      }
    }

    return null;
  }

  function generateUserSessionID() {
    if (!utc) {
      utc = readCookie('_utc');
      if (!utc) {
        utc = generateUUID();
        createCookie('_utc', utc, 31536000); // 1 year
      }
    }

    if (!stc) {
      stc = readCookie('_stc');
      if (!stc) {
        stc = generateUUID();
        createCookie('_stc', stc, 1800); // 0.5 hour
      }
    }
  }


  function sendViewCount(tx, data) {
    if (navigator.doNotTrack) return;
    generateUserSessionID();

    var _utc = encodeURIComponent(utc);
    var _stc = encodeURIComponent(stc);
    var _tx = tx;
    var viewDataString = "";
    for (var key in data) {
      if (data[key]) {
        viewDataString += ('&' + key + '=' + data[key]);
      }
    }

    var url = 'https://pixel.gfycat.com/pix.gif?tx=' + _tx + viewDataString +
      '&utc=' + _utc + '&stc=' + _stc + '&rand=' + Math.random()*100000;
    var xhr = createCORSRequest('GET', url);
    if (!xhr) throw new Error('CORS is not supported in your browser');

    xhr.onerror = function() {
      console.log('CORS Error');
    };
    xhr.send();

    if (ga) {
      ga('gfyTracker.send', 'pageview', location.href);
    }
  }

  function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      xhr.open(method, url, true);
    }
    /* IE support */
    else if (typeof XDomainRequest != 'undefined') {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    }
    /* CORS unsupported */
    else {
      xhr = null;
    }
    return xhr;
  }

  function encodeParameters(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }

  /*
    sendEvent({
      user: 'abc',
      video_id: 'some video'
    });
  */
  var sendEvent = function(kv) {
    if (navigator.doNotTrack) return;
    generateUserSessionID();

    var ref = 'https://www.gfycat.com';
    if (typeof document.referrer != 'undefined' && document.referrer.length > 1) {
      ref = document.referrer;
    }

    kv.utc = utc;
    kv.stc = stc;
    kv.ref = ref;

    var i = new Image();
    i.src = 'https://metrics.gfycat.com/pix.gif?' + encodeParameters(kv);


    if (ga && kv.hasOwnProperty('event')) {
      ga('gfyTracker.send', 'event', 'gfyEvent', kv.event);
    }
  };

  var sendEventWithCallback = function(kv, callback) {
    if (navigator.doNotTrack) return;
    generateUserSessionID();

    var ref = 'https://www.gfycat.com';
    if (typeof document.referrer != 'undefined' && document.referrer.length > 1) {
      ref = document.referrer;
    }

    kv.utc = utc;
    kv.stc = stc;
    kv.ref = ref;

    var i = new Image();
    i.src = 'https://metrics.gfycat.com/pix.gif?' + encodeParameters(kv);


    if (ga && kv.hasOwnProperty('event')) {
      ga('gfyTracker.send', 'event', 'gfyEvent', kv.event, {'hitCallback': callback});
    }
  };

  var initGA = function() {
    if (typeof ga !== 'undefined') {
      ga(function() {
        if (!ga.getByName('myTracker')) {
          ga('create', 'UA-40130883-1', 'auto', 'gfyTracker');
        }
      });
    } else {
      ga = undefined;
    }
  };

  return {
    sendEvent: sendEvent,
    sendEventWithCallback: sendEventWithCallback,
    sendViewCount: sendViewCount,
    initGA: initGA
  };
}();
