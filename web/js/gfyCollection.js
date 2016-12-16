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


/**
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
var gfyCollection = function() {

    var collection = [],
        gfyClass = "gfyitem",
        scrollTop;

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
        if (typeof GfyAnalytics !== 'undefined') GfyAnalytics.initGA();
        classname = typeof classname==="string" ? classname : gfyClass;
        scan(classname);
        attachEventListeners();
    }

    var scrollTimer;

    function scrollHandler() {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(function() {
        scrollTop = document.body.scrollTop;
        for (var i = 0; i < collection.length; i++) {
          collection[i].checkScroll(scrollTop);
        }
      }, 100);
    }

    function onPageUpdate() {
      scrollTop = document.body.scrollTop;
      var windowHeight = window.innerHeight;
      for (var i = 0; i < collection.length; i++) {
        collection[i].onPageUpdate(windowHeight, scrollTop);
      }
    }

    function attachEventListeners() {
      if (window.addEventListener) {
        addEventListener('DOMContentLoaded', onPageUpdate, false);
        addEventListener('load', onPageUpdate, false);
        addEventListener('resize', onPageUpdate, false);
        addEventListener('scroll', scrollHandler, false);
      } else if (window.attachEvent) {
        attachEvent('DOMContentLoaded', onPageUpdate, false);
        attachEvent('load', onPageUpdate, false);
        attachEvent('resize', onPageUpdate, false);
        attachEvent('scroll', scrollHandler, false);
      }
    }

    function scan(classname) {
        classname = typeof classname==="string" ? classname : gfyClass;

        // this can be run multiple times, so we'll add to any existing gfycats
        var last = collection.length;
        // find each gfycat on page and run its init
        var elem_coll = byClass(classname, document);
        for (var i = 0; i < elem_coll.length; i++) {
            // don't need to worry about finding existing gfyitems - they are
            // replaced by gfyObject
            var gfyObj = new gfyObject(elem_coll[i], classname);
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

    init();

    return {
        init: init,
        get: get,
        scan: scan
    };
}();

if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", function() {
      gfyCollection.init();
  }, false);
} else {
  document.attachEvent("onreadystatechange", gfyCollection.init);
}
