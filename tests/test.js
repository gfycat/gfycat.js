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

var body = document.getElementsByTagName('body')[0];

// from mobiledetect.com
function mobilecheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|android|ipad|playbook|silk|blackberry|htc|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

var mobile = mobilecheck();

/**
* @param {String} className - class to search on a page
* @param {String} id - gfy id
* @param {?Object} data - options
*/
function createGfyHtmlElement(className, id, data) {
  var gfyElem = document.createElement('div');
  gfyElem.className = className;
  if (id) gfyElem.dataset.id = id;
  if (data) {
    var options = Object.keys(data);
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      gfyElem.dataset[option] = data[option];
    }
  }
  return gfyElem;
}

function initGfyObject(gfyElem, newData) {
  var newGfyObject = new gfyObject(gfyElem);
  if (newData) {
    newGfyObject.init(newData);
  } else {
    newGfyObject.init();
  }
  return newGfyObject;
}

describe('gfyEmbed:', function() {
  it('Element with class "gfyitem" created', function() {
    body.appendChild(createGfyHtmlElement("gfyitem", "ReliableSparklingArcherfish"));
    var gfyTest = document.getElementsByClassName("gfyitem")[0];
    expect(gfyTest.classList.contains('gfyitem')).toBe(true);
    body.removeChild(gfyTest);
  });

  it('data-id required', function() {
    body.appendChild(createGfyHtmlElement("gfyitem", "ReliableSparklingArcherfish"));
    var gfyTest = document.getElementsByClassName("gfyitem")[0];
    expect(gfyTest.dataset.id).not.toBeUndefined();
    body.removeChild(gfyTest);
  });

  it("Different init class name", function() {
    body.appendChild(createGfyHtmlElement(
      'customClassName', 'WeakGroundedHoneybadger'));
    gfyCollection.init('customClassName');
    expect(gfyCollection.get().length).toEqual(1);
  });

  it('data-id missing', function() {
    body.appendChild(createGfyHtmlElement("gfyitem"));
    var gfyTest = document.getElementsByClassName("gfyitem")[0];
    var newGfyObject = initGfyObject(gfyTest);
    expect(newGfyObject.getRootElement().innerHTML).toEqual("");
    body.removeChild(gfyTest);
  });
});

describe("Asynchronous tests:", function() {
  beforeEach(function(done) {
    setTimeout(function() {
      done();
    }, 1);
  });

  var dataLoadTimeout = 1000;

  it("Default", function(done) {
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish'));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      var videoElem = gfyRootElement.getElementsByTagName('video')[0];
      var gifElem = gfyRootElement.getElementsByTagName('img')[0];
      // One of them should exist
      expect(videoElem || gifElem).not.toBeUndefined();
      expect(gfyRootElement.getElementsByClassName('title')[0]).toBeUndefined();
      expect(gfyRootElement.getElementsByClassName('controls')[0]).toBeUndefined();
      var playButton = gfyRootElement.getElementsByClassName('play-button');
      if (gifElem) expect(playButton).toBeUndefined();
      if (videoElem) {
        expect(videoElem.autoplay).toBeTruthy();
        expect(playButton).toBeDefined();
      }
      done();
    }, dataLoadTimeout);
  });

  it("Reinit with new id", function(done) {
    reinitTest(done, {id: "ReliableSparklingArcherfish"},
      {id: "AdventurousPastelAddax"});
  });

  it("Reinit with controls=true && autoplay=false", function(done) {
    reinitTest(done, {id: 'ReliableSparklingArcherfish'}, {controls: true, autoplay: false});
  });

  it("Reinit with gif=true", function(done) {
    reinitTest(done, {id: 'ReliableSparklingArcherfish'}, {gif: true});
  });

  function reinitTest(done, initData, newData) {
    body.appendChild(createGfyHtmlElement(
      'gfyitem', initData.id));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      gfyDataTest(gfyRootElement, initData);

      newGfyObject.init(newData);
      setTimeout(function() {
        gfyRootElement = newGfyObject.getRootElement();
        gfyDataTest(gfyRootElement, newData);
        done();
      }, dataLoadTimeout);
    }, dataLoadTimeout);
  }

  function gfyDataTest(gfyRootElement, data) {
    var videoElem = gfyRootElement.getElementsByTagName('video')[0];
    var gifElem = gfyRootElement.getElementsByClassName('gif')[0];

    if (data && data.hasOwnProperty('id')) {
      if (videoElem) {
        var webmSource = videoElem.getElementsByClassName('webmsource')[0];
        var mp4Source = videoElem.getElementsByClassName('mp4source')[0];
        if (webmSource) expect(webmSource.src).toMatch(data.id);
        if (mp4Source) expect(mp4Source.src).toMatch(data.id);
        expect(videoElem.poster).toMatch(data.id);
      } else {
        expect(gifElem.src).toMatch(data.id);
      }
    }

    if (data && data.hasOwnProperty('autoplay')) {
      if (data.autoplay === false || !videoElem) {
        expect(videoElem.autoplay).toBeFalsy();
      } else {
        expect(videoElem.autoplay).toBeTruthy();
      }
    }

    if (data && data.hasOwnProperty('controls')) {
      var controls = gfyRootElement.getElementsByClassName('controls')[0];
      if (data.controls && videoElem) {
        expect(controls).toBeDefined();
      } else {
        expect(controls).toBeUndefined();
      }
    }

    if (data && data.hasOwnProperty('gif')) {
      if (data.gif === true) {
        expect(gifElem).toBeDefined();
      } else {
        expect(gifElem).toBeUndefined();
      }
    }

    if (data && data.hasOwnProperty('title')) {
      var title = gfyRootElement.getElementsByClassName('title')[0];
      if (data.title === true && !mobile) {
        expect(title).toBeDefined();
      } else {
        expect(title).toBeUndefined();
      }
    }
  }

  it("data-autoplay=false", function(done) {
    var data = {
      autoplay: false
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      var videoElem = gfyRootElement.getElementsByTagName('video')[0];
      if (videoElem) expect(videoElem.autoplay).toBeFalsy();
      done();
    }, dataLoadTimeout);
  });

  it("data-controls=true", function(done) {
    var data = {
      controls: true
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      expect(gfyRootElement.getElementsByClassName('controls')[0]).toBeDefined();
      expect(gfyRootElement.getElementsByClassName('gfyCtrlPause')[0]).toBeDefined();
      expect(gfyRootElement.getElementsByClassName('gfyCtrlReverse')[0]).toBeDefined();
      expect(gfyRootElement.getElementsByClassName('gfyCtrlSlower')[0]).toBeDefined();
      expect(gfyRootElement.getElementsByClassName('gfyCtrlFaster')[0]).toBeDefined();
      expect(gfyRootElement.getElementsByClassName('play-button')[0]).toBeUndefined();
      done();
    }, dataLoadTimeout);
  });

  it("data-title=true", function(done) {
    var data = {
      title: true
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      var titleElem = gfyRootElement.getElementsByClassName('title')[0];
      if (mobile) {
        expect(titleElem).toBeUndefined();
      } else {
        expect(titleElem).toBeDefined();
      }
      expect(gfyRootElement.getElementsByClassName('overlay')[0]).toBeDefined();
      done();
    }, dataLoadTimeout);
  });

  it("data-title=false", function(done) {
    var data = {
      title: false
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      expect(gfyRootElement.getElementsByClassName('title')[0]).toBeUndefined();
      done();
    }, dataLoadTimeout);
  });

  it("data-gif=true", function(done) {
    var data = {
      gif: true
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      var gif = gfyRootElement.getElementsByClassName('gif')[0];
      expect(gif).toBeDefined();
      expect(gif.tagName).toEqual('IMG');
      expect(gfyRootElement.getElementsByClassName('controls')[0]).toBeUndefined();
      expect(gfyRootElement.getElementsByClassName('play-button')[0]).toBeUndefined();
      done();
    }, dataLoadTimeout);
  });

  it("Paused controls", function(done) {
    var data = {
      autoplay: false,
      controls: true,
      optimize: false // video should be there
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      var gfyCtrlPause = gfyRootElement.getElementsByClassName('gfyCtrlPause')[0];
      var gfyCtrlSlower = gfyRootElement.getElementsByClassName('gfyCtrlSlower')[0];
      var gfyCtrlFaster = gfyRootElement.getElementsByClassName('gfyCtrlFaster')[0];
      expect(gfyCtrlPause.style.backgroundPosition).toEqual("-71px 0px");
      expect(gfyCtrlSlower.style.backgroundPosition).toEqual("0px 0px");
      expect(gfyCtrlFaster.style.backgroundPosition).toEqual("-192px 0px");
      done();
    }, dataLoadTimeout);
  });

  it("Playing controls", function(done) {
    var data = {
      autoplay: true,
      controls: true,
      optimize: false // video should be playing
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      var gfyCtrlPause = gfyRootElement.getElementsByClassName('gfyCtrlPause')[0];
      var gfyCtrlSlower = gfyRootElement.getElementsByClassName('gfyCtrlSlower')[0];
      var gfyCtrlFaster = gfyRootElement.getElementsByClassName('gfyCtrlFaster')[0];
      expect(gfyCtrlPause.style.backgroundPosition).toEqual("-95px 0px");
      expect(gfyCtrlSlower.style.backgroundPosition).toEqual("-165px 0px");
      expect(gfyCtrlFaster.style.backgroundPosition).toEqual("-20px 0px");
      done();
    }, dataLoadTimeout);
  });

  /**
  * Option 'expand' is deprecated. If value's provided it's used as 'responsive'
  * option value if 'responsive' is not provided for a backward compatibility.
  */
  it("data-expand=true", function(done) {
    var data = {
      expand: true
    };
    responsiveTest(data, done, dataLoadTimeout);
  });

  it("data-expand=true && data-responsive=true", function(done) {
    var data = {
      expand: true,
      responsive: true
    };
    responsiveTest(data, done, dataLoadTimeout);
  });

  it("data-expand=false && data-responsive=true", function(done) {
    var data = {
      expand: false,
      responsive: true
    };
    responsiveTest(data, done, dataLoadTimeout);
  });

  it("data-expand=true && data-responsive=false", function(done) {
    var data = {
      expand: true,
      responsive: false
    };
    responsiveTest(data, done, dataLoadTimeout);
  });

  it("data-responsive=true", function(done) {
    var data = {
      responsive: true
    };
    responsiveTest(data, done, dataLoadTimeout);
  });

  it("data-responsive=true && data-gif=true", function(done) {
    var data = {
      gif: true,
      responsive: true
    };
    responsiveTest(data, done, dataLoadTimeout);
  });

  it("data-responsive=true && data-max-height=400", function(done) {
    var data = {
      responsive: true,
      maxHeight: 400
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      expect(gfyRootElement.style.maxWidth).not.toEqual('');
      done();
    }, dataLoadTimeout);
  });

  it("data-responsive=true && data-max-height=400", function(done) {
    var data = {
      responsive: false,
      maxHeight: 400
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      expect(gfyRootElement.style.maxWidth).toEqual('');
      done();
    }, dataLoadTimeout);
  });
});

function responsiveTest(data, done, dataLoadTimeout) {
  body.appendChild(createGfyHtmlElement(
    'gfyitem', 'ReliableSparklingArcherfish', data));
  var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
  var newGfyObject = initGfyObject(gfyRootElement);
  setTimeout(function() {
    gfyRootElement = newGfyObject.getRootElement();
    var gifElem = gfyRootElement.getElementsByClassName('gif')[0];
    if (gifElem) {
      expect(gifElem.style.width).toEqual("100%");
    }
    var sizer = gfyRootElement.getElementsByClassName('sizer')[0];
    if (data.responsive === false) {
      expect(sizer).toBeUndefined();
    } else {
      expect(sizer).toBeDefined();
    }
    done();
  }, dataLoadTimeout);
}
