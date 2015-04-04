gfycat.js
=========

Embed script to generate gfycat embeds on 3rd party websites.

The intent of this javascript is to provide a simple self cotained file that web publishers can use to easily include gfycat embeds on their websites.  
  
By hosting it on github, users can request changes, contribute code, or fork a branch so that the embed process is adapted to actual real world needs.  

## Usage
  
**Include the .js on your website**

Example (current file):
  
    `<script type"text/javascript" src="build/gyfcat.min.js"></script>`

**Include an embed tag**

Example: 

    `<div class="gfyitem" data-id="BestYellowishElephantseal" data-title=true data-controls=true data-autoplay=false data-expand=false ></div>`

The deafult key  the embed script looks for is **class="gfyitem"**, or the class specificed in `gfyCollection.init('classname')`.

### Options 
  
* data-id: the gfycat id (required)
* data-title: whether or not to include the title on hover over (default: false)
* data-controls: whether or not to include controls for pause/speed/etc (default: false)
* data-autoplay: whether or not to automatically start playback when the page loads (default: true)
* data-expand: whether or not the video element should expand to fill the space of its container (default: false). Element will shrink to fit its container still when false, but will not expand beyond the file's original size.

### Initialize

`gfyCollection.init()` should be called on page load:  
  
    if(document.addEventListener)
        document.addEventListener("DOMContentLoaded",gfyCollection.init,false);
    else
        document.attachEvent("onreadystatechange",gfyCollection.init);

To scan for new gfycat Objects, run `gfyCollection.scan()`

Pass `gfyCollection.init()` or `gfyCollection.scan()` a string to change the classname used to find the gfy elements.

Example:
	`gfyCollection.init('gif');`

## Code
   
The source files are broken down into two objects:  
  
* **gfyCollection**: this object is called on page load --  gfyCollection.init().  Its function is to find every gfycat embed on the page and create a gfyObject for it.  
* **gfyObject**:  a new one of these is created for each gfycat embed.  It contains all of the functions to generate the DOM and manipulate the video.

To compile the script, run `grunt build`, to update the demo scripts run `grunt demo`, and to publish the demo to github pages run `grunt publish`. (`npm install` to setup Grunt before first use.)  

## Alternate method of embedding

**From [gfycat.com](http://gfycat.com/about#embed)

There are several ways to use gif hosting from gfycat.

* Use the raw .gif as standard pure gif hosting. Clink on the "Link" button to get the direct link embed codes for the <img> tag.
* Use the iframe embed code listed on each gfycat page (click the Links button on the top right corner).
* Use our embed code to embed a gfy object automatically. This method will choose video or gif format depending on the users capabilities, and we wrap a lot of other pixie dust around it too (shims for various unusual browser conditions to guarantee everyone gets the best experience).
To turn this into a gfycat, you will need to include the following javascript snippet. Just paste it anywhere in your page.

```
<script>
 (function(d, t) {
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = 'http://assets.gfycat.com/js/gfyajax-0.517d.js';
    s.parentNode.insertBefore(g, s);
}(document, 'script'));
</script>
```
With this bit of code, you can now use the following simple tag structure to embed a gfy anywhere on your page, just like you would a plain old gif (the data-id string is you unique gfy name):

`<img class="gfyitem" data-id="everyillchick" />`

The script will automatically fetch all of the data from our servers and construct the gfy objects for you!

There are three optional attributes you can specify for formatting:

* data-controls (default true): if the embed should include the pull down player controls.
* data-dot (default true): if the embed should include a loading indicator dot.
* data-perimeter (default false): if the embed should include a perimeter at the bottom to make space for the drop down controls. Otherwise the controls will overlap other content.

**Note:** Gfycat.com is still beta, but this embed feature is still in an early alpha stage. So if you do try it out please let us know any issues you encounter.