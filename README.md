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
  
    <div class="gfyitem" data-title=true data-autoplay=false data-controls=true data-expand=false data-id="BestYellowishElephantseal" />  
    
The key which the embed script looks for is **class="gfyitem"**.  The options are:  
  
* data-id: the gfycat id (required)
* data-controls: whether or not to include controls for pause/speed/etc (default: false)
* data-title: whether or not to include the title on hover over (default: false)
* data-autoplay: whether or not to automatically start playback when the page loads (default: true)
* data-expand: whether or not the video element should expand to fill the space of its container (default: false)  
     

  
