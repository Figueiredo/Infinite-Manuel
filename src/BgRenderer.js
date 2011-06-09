function BgRenderer(lvl,largura,altura,dist)
{
    this.xCam=0;
    this.yCam=0;
    this.level=lvl;

    this.renderBehaviors = false;

    this.width=largura;
    this.height=altura;
    this.distance=dist;
    this.image= document.createElement("canvas");
    this.image.width=this.width;
    this.image.height=this.height;
    this.g = this.image.getContext("2d");
    
    this.tmpcv=document.createElement("canvas");
    this.tmpcv.width=this.width;
    this.tmpcv.height=this.height;
    this.tmpg=this.tmpcv.getContext("2d");

    this.updateArea(0, 0, this.width, this.height);
}

/**
 * 
 */ 
BgRenderer.prototype.updateArea=function(x0, y0, w, h)
{        
    this.g.clearRect(x0, y0, w, h);
    var xTileStart = (x0 + this.xCam) / 32;
    var yTileStart = (y0 + this.yCam) / 32;
    var xTileEnd = (x0 + this.xCam + w) / 32;
    var yTileEnd = (y0 + this.yCam + h) / 32;

    for (var x = xTileStart; x <= xTileEnd; x++)
    {            
        for (var y = yTileStart; y <= yTileEnd; y++)
        {
            var b = this.level.getBlock(x, y) & 0xff;                
            var tile=Art.bg[b % 8][Math.floor(b / 8)];
            this.g.drawImage(tile, (x << 5) - this.xCam, (y << 5) - this.yCam-16);
        }
    }
};

/**
 * 
 */ 
BgRenderer.prototype.setCam=function(xC, yC)
{
    xC /= this.distance;
    yC /= this.distance;
    var xCamD = this.xCam - xC; 
    var yCamD = this.yCam - yC;
    this.xCam = Math.round(xC);
    this.yCam = yC;

    this.tmpg.clearRect(0,0,this.width,this.height);
    this.tmpg.drawImage(this.image, 0,0);
    this.g.clearRect(0,0,this.width,this.height);
    this.g.drawImage(this.tmpcv, Math.floor(xCamD), Math.floor(yCamD));

    if (xCamD < 0)
    {
        if (xCamD < -this.width) xCamD = -this.width;
        this.updateArea(this.width + xCamD, 0, -xCamD, this.height);
    }
    else if (xCamD > 0)
    {
        if (xCamD > this.width) xCamD = this.width;
        this.updateArea(0, 0, xCamD, this.height);
    }
    
    if (yCamD < 0)
    {
        if (yCamD < -this.width) yCamD = -this.width;
        this.updateArea(0, this.height + yCamD, this.width, -yCamD);
    }
    else if (yCamD > 0)
    {
        if (yCamD > this.width) yCamD = this.width;
        this.updateArea(0, 0,this.width, yCamD);
    }
};

/**
 * 
 */ 
BgRenderer.prototype.render=function(g, tick, alpha)
{
    g.drawImage(this.image, 0, 0);
};

/**
 * 
 */ 
BgRenderer.prototype.setLevel=function(lv)
{
    this.level = lv;
    this.updateArea(0, 0, this.width, this.height);
};
 