var Art;

function cArt()
{
    
    //imagens
    this.logo = 1;
    this.title = 2;
    this.bg=0;    
	this.worldmap=3;
    
    var status=false;    
    var loaded=0;
    
    var srcs = [
                "img/bgsheet.png",
                "img/logo.png",
                "img/title.png",
                "img/worldmap.png"     
        ];
        
    var total=srcs.length;        
    this.img =[];    
    
    this.statusLoaded=function()
    {
        return status;
    };
    
    this.status=function()
    {
        return {l:loaded,t:total};
    };
    
    this.Load=function()
    {        
        for(var i=0;i<total;i++)
        {
          this.img[i]=new Image();
          this.img[i].onload = isLoaded();
          this.img[i].src=srcs[i];
        }        
    };
    
    this.cutImage=function(imgID, xSize, ySize)
    {
        var source = this.img[imgID];
        var images = [source.width / xSize];
        for (var x = 0; x < source.width/ xSize; x++)
        {
            images[x]=[source.height / ySize];
            for (var y = 0; y < source.height / ySize; y++)
            {
                var cv = document.createElement("canvas");
                cv.width=xSize;
                cv.height= ySize;
                var g = cv.getContext("2d");
                g.drawImage(
                    source,
                x * xSize,
                y * ySize,
                xSize,
                ySize,
                0,0,
                xSize,
                ySize);

                images[x][y] = cv;
            }
        }

        return images;
    };    
    
    this.treatImgs=function()
    {    
        this.img[this.bg]=this.cutImage(this.bg,32,32);
    };
    
    
    var isLoaded=function()
    {
        loaded++;
        if(loaded==total)
        {
            Art.treatImgs();
            status=true;
        }
    };
    
}

