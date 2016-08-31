<!---
Copyright 2014-2016 Gfycat, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->


#gfycat.js

####Version History:

- 0.1: Initial revision
- 1.0: Fixes to initialization, cleaned up UI, support for mobile browsers


Embed script to generate gfycat embeds on 3rd party websites.

The intent of this javascript is to provide a simple self cotained file that web publishers can use to easily include gfycat embeds on their websites.  

By hosting it on github, users can request changes, contribute code, or fork a branch so that the embed process is adapted to actual real world needs.  

###Usage:  

**Include this script on your website**

      <script type="text/javascript" src="https://assets.gfycat.com/gfycat.js"></script>

**Include an embed tag(s)**

Example:

    <div class="gfyitem" data-title=true data-autoplay=false data-controls=true data-id="BestYellowishElephantseal"></div>

**The options are:**
* `data-id`: the gfycat id (required)
* `data-controls`: whether or not to include controls for pause/speed/etc (default: false)
* `data-title`: whether or not to include the title on hover over (default: false)
* `data-autoplay`: whether or not to automatically start playback when the page loads (default: true)
* `data-expand` (DEPRECATED, use `data-responsive`): whether or not the video element should expand to fill the space of its container (default: false)
* `data-responsive`: whether or not the video element should expand to fill the space of its container (default: false)
* `data-max-height` (works **only** together with `data-responsive=true`): sets height upper bound for a responsive video
* `data-optimize`: only plays videos when they're in view (~50% in) and lazy loads gifs (default: true)

###Source code

The code is broken down into two files:

* **gfyCollection.js**: `gfyCollection` calls `gfyCollection.init()` on page load.  Its function is to find every gfycat embed on the page and create a gfyObject for it.
* **gfyObject.js**:  a `new gfyObject` instance is created for each gfycat embed.  It contains all of the functions to generate the DOM and manipulate the video.  

`gfyCollection.init` should be called on page load or after gfy elements appear on the page:  

    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", gfyCollection.init, false);
    } else {
        document.attachEvent("onreadystatechange", gfyCollection.init);
    }

The default key the embed script looks for is `class="gfyitem"`, or the class specificed in `gfyCollection.init('classname')`.

Each instance of `gfyObject` has an `init` method. It's possible to initialize an object with a new data.

**html:**
```html
<div class="gfyitem" id="BestYellowishElephantseal"></div>
```

**js:**
```javascript
gfyCollection.init();
var collection = gfyCollection.get();
collection[0].init({id: "BareSecondaryFlamingo"});
```

###Build

```
npm install
gulp build
```

###Testing
`gulp test` - runs all the tests once

`gulp tdd` - watching for file changes and runs all the tests
