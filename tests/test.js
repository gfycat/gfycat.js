var body = document.getElementsByTagName('body')[0];

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

function initGfyObject(gfyElem) {
  var newGfyObject = new gfyObject(gfyElem);
  newGfyObject.init();
  return newGfyObject;
}

describe('gfyEmbed:', function () {
  it('Element with class "gfyitem" created', function () {
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
      'customClassName', 'ReliableSparklingArcherfish'));
    gfyCollection.init('customClassName');
    expect(gfyCollection.get().length).toEqual(1);
  });

  it('data-id missing', function() {
    body.appendChild(createGfyHtmlElement("gfyitem"));
    var gfyTest = document.getElementsByClassName("gfyitem")[0];
    var newGfyObject = initGfyObject(gfyTest);
    expect(newGfyObject.getRootElement().innerHTML).toEqual("");
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
      var videoElem = gfyRootElement.getElementsByTagName('video');
      var gifElem = gfyRootElement.getElementsByTagName('img');
      // One of them should exist
      expect(videoElem.length || gifElem.length).toEqual(1);
      expect(gfyRootElement.getElementsByClassName('title').length).toEqual(0);
      expect(gfyRootElement.getElementsByClassName('controls').length).toEqual(0);
      expect(gfyRootElement.getElementsByClassName('play-button').length).toEqual(1);

      if (videoElem.length) {
        expect(videoElem[0].autoplay).toBeTruthy();
      }
      done();
    }, dataLoadTimeout);
  });

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
      var videoElem = gfyRootElement.getElementsByTagName('video');
      if (videoElem.length) {
        expect(videoElem[0].autoplay).toBeFalsy();
      }
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
      expect(gfyRootElement.getElementsByClassName('controls').length).toEqual(1);
      expect(gfyRootElement.getElementsByClassName('play-button').length).toEqual(0);
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
      expect(gfyRootElement.getElementsByClassName('title').length).toEqual(1);
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
      expect(gfyRootElement.getElementsByClassName('title').length).toEqual(0);
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
      var gif = gfyRootElement.getElementsByClassName('gif');
      expect(gif.length).toEqual(1);
      expect(gif[0].tagName).toEqual('IMG');
      expect(gfyRootElement.getElementsByClassName('controls').length).toEqual(0);
      expect(gfyRootElement.getElementsByClassName('play-button').length).toEqual(0);
      done();
    }, dataLoadTimeout);
  });

  it("data-expand=true", function(done) {
    var data = {
      expand: true
    };
    body.appendChild(createGfyHtmlElement(
      'gfyitem', 'ReliableSparklingArcherfish', data));
    var gfyRootElement = document.getElementsByClassName('gfyitem')[0];
    var newGfyObject = initGfyObject(gfyRootElement);
    setTimeout(function() {
      gfyRootElement = newGfyObject.getRootElement();
      var gifElem = gfyRootElement.getElementsByClassName('gif');
      var videoElem = gfyRootElement.getElementsByClassName('gfy-video');
      if (gifElem.length) {
        expect(gifElem[0].style.width).toMatch("100%");
      }
      if (videoElem.length) {
        expect(videoElem[0].style.width).toMatch("100%");
      }
      done();
    }, dataLoadTimeout);
  });
});
