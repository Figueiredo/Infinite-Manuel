/**
 * 
 */ 
function cArt()
{    
    this.status=false;    
    this.loaded=0;
    
    this.srcs = [
                "img/bgsheet.png",
                "img/logo.png",
                "img/title.png",
                "img/worldmap.png",
                "img/endscene.png",
                "img/font.png",
                "img/mapsheet.png",
                "img/manuelsheet.png",
                "img/smallmanuelsheet.png",
                "img/firemanuelsheet.png"
        ];
        
    this.total=this.srcs.length;        
    this.img =[];              
}

cArt.prototype.bg=null;
cArt.prototype.logo = null;
cArt.prototype.title = null;    
cArt.prototype.map=null;
cArt.prototype.end=null;
cArt.prototype.font=null;
cArt.prototype.level=null;
cArt.prototype.manuel=null;
cArt.prototype.pequenoManuel=null;
cArt.prototype.fogoManuel=null;

/**
 * checks if it has finished loading
 */ 
cArt.prototype.statusLoaded=function()
{
    return this.status;
};


/**
 * gives progress on loading
 */ 
cArt.prototype.getStatus=function()
{
    return {l:this.loaded,t:this.total};
};

/**
 * cuts imagens into image arrays of the specified size
 */ 
cArt.prototype.cutImage=function(imgID, xSize, ySize)
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

/**
 * final image treatments after loading has finished
 */ 
cArt.prototype.treatImgs = function()
{
    this.bg = this.cutImage(0, 32, 32);
    this.logo = this.img[1];
    this.title = this.img[2];
    this.map = this.cutImage(3, 16, 16);
    this.end = this.cutImage(4, 96, 96);
    this.font = this.cutImage(5, 8, 8);
    this.level = this.cutImage(6, 16, 16);
    this.manuel = this.cutImage(7, 32, 32);
    this.pequenoManuel = this.cutImage(8, 16, 16);
    this.fogoManuel = this.cutImage(9, 32, 32);
};

/**
 * finishes loading a resource and checks global loading status
 */ 
cArt.prototype.isLoaded=function()
{
    this.loaded++;
    if(this.loaded==this.total)
    {
        this.treatImgs();
        this.status=true;
    }
};

/**
 * requests the resource load
 */ 
cArt.prototype.Load=function()
{        
    var that=this;
    for(var i=0;i<this.total;i++)
    {
      this.img[i]=new Image();
      this.img[i].onload = function() { that.isLoaded(); };
      this.img[i].src=this.srcs[i];
    }        
};

var Art = new cArt();