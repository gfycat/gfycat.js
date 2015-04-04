/*
 * gfyCollection:
 * Global object to be called on page load.
 * This runs through the page DOM for elements
 * with class "gfyitem" or class passed in and
 *  attempts to convertthem to gfycat embeds by
 *  creatinga new gfyObject with the element.
 * Can also be used _after_ page load by calling
 * gfyCollection.get() to get the collection
 * of gfycat objects on the page and re-initialize
 * them or interact with them as desired.
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
    }

}();
