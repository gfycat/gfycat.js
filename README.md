gfycat.js
=========

Embed script to generate gfycat embeds on 3rd party websites.

The intent of this javascript is to provide a simple self cotained file that web publishers can use to easily include gfycat embeds on their websites.  
  
By hosting it on github, users can request changes, contribute code, or fork a branch so that the embed process is adapted to actual real world needs.  
  
Usage:  
  
**Include the .js on your website**

Example(current file):
  
    <script type"text/javascript" src="http://test.gfycat.com/gfycat_test.js"></script>

**Include an embed tag**

Example: 
  
    <div class="gfyitem" data-title=true data-autoplay=false data-controls=true data-expand=false data-id="BestYellowishElephantseal" ></div> 
    
The key which the embed script looks for is **class="gfyitem"**.  The options are:  
  
* data-id: the gfycat id (required)
* data-controls: whether or not to include controls for pause/speed/etc (default: false)
* data-title: whether or not to include the title on hover over (default: false)
* data-autoplay: whether or not to automatically start playback when the page loads (default: true)
* data-expand: whether or not the video element should expand to fill the space of its container (default: false)  
     
The files in this repository are broken down into two objects:  
  
* **gfyCollection**: this object is called on page load --  gfyCollection.init().  Its function is to find every gfycat embed on the page and create a gfyObject for it.  
* **gfyObject**:  a new one of these is created for each gfycat embed.  It contains all of the functions to generate the DOM and manipulate the video.  

gfyCollection.init should be called on page load:  
  
    if(document.addEventListener)
        document.addEventListener("DOMContentLoaded",gfyCollection.init,false);
    else
        document.attachEvent("onreadystatechange",gfyCollection.init);
