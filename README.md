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


# gfycat.js

#### Version History:

- 0.1: Initial revision
- 1.0: Fixes to initialization, cleaned up UI, support for mobile browsers
- 1.1: Support for autoplaying looping MP4 on iOS 10, GIF view count analytics
- 1.2: New options: data-hd, data-playback-speed; Custom classes can be added to root element before init


Embed script to generate gfycat embeds on 3rd party websites.

The intent of this Javascript file is to provide a simple way for web publishers to include Gfycat embeds on their websites.

This code is provided on Github, so users can request changes, contribute code, or fork a branch. Please contribute to the project to help improve it with actual real world needs.  

### Usage:  

**Include this script on your webpage right after the opening \<body\> tag**

```html
<script>
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://assets.gfycat.com/gfycat.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'gfycat-js'));
</script>
```

**Include an embed tag(s)**

Example:

```html
<div class="gfyitem" data-title=true data-autoplay=false data-controls=true data-id="BestYellowishElephantseal"></div>
```

**The options are:**
* `data-id`: the Gfycat id (required)
* `data-controls`: include controls for pause/speed/etc (default: false)
* `data-title`: show the title on hover (default: false)
* `data-autoplay`: automatically start playback on page load (default: true)
* `data-expand` (DEPRECATED, please use `data-responsive`): expand video element to fill the space of its container (default: false)
* `data-responsive`: expand video element to fill the space of its container (default: false)
* `data-max-height` (works **only** together with `data-responsive=true`): set height upper bound for a responsive video
* `data-optimize`: play videos when they're 50% visible, and lazy loads gifs (default: true)
* `data-gif`: load .gif file instead of video (default: false)
* `data-hd`: load high quality video (default: true)
* `data-playback-speed`: set video playback speed, values from the interval \[0.125, 8\] (default: 1)

### Source code

The code is broken down into two files:

* **gfyCollection.js**: `gfyCollection` calls `gfyCollection.init()` after the script is loaded.  Its function is to find every Gfycat embed on the page and create a gfyObject for it.
* **gfyObject.js**:  a `new gfyObject` instance is created for each gfycat embed.  It contains all of the functions to generate the DOM and manipulate the video.

`gfyCollection.init` should be called on `gfyitem` elements which appear on the page after the page load.

The default key the embed script looks for is `class="gfyitem"`, or the class specificed in `gfyCollection.init('classname')`.

Each instance of `gfyObject` has an `init` method. It's possible to initialize an object with new data.

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

### Build

```
npm install
gulp build
```

### Testing
`gulp test` - runs all the tests once

`gulp tdd` - watching for file changes and runs all the tests
