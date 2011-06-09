function LevelRenderer ( lvl, largura, altura)
{    
    this.width = largura;
    this.height =altura;    
    this.xCam =0; //int
    this.yCam=0; //int
    this.image= document.createElement("canvas");
    this.image.width=this.width;
    this.image.height=this.height;
    this.g = this.image.getContext("2d");
    
    this.tmpcv=document.createElement("canvas");
    this.tmpcv.width=this.width;
    this.tmpcv.height=this.height;
    this.tmpg=this.tmpcv.getContext("2d");    
    
    this.level=lvl;

    this.renderBehaviors = false;
    
    this.updateArea(0, 0, this.width, this.height);
}

/**
 * 
 */ 
LevelRenderer.prototype.updateArea=function(x0, y0, w, h)
{        
    this.g.clearRect(x0, y0, w, h);
    var xTileStart = (x0 + this.xCam) / 16;
    var yTileStart = (y0 + this.yCam) / 16;
    var xTileEnd = (x0 + this.xCam + w) / 16;
    var yTileEnd = (y0 + this.yCam + h) / 16;

    for (var x = xTileStart; x <= xTileEnd; x++)
    {            
        for (var y = yTileStart; y <= yTileEnd; y++)
        {
            var b = this.level.getBlock(x, y) & 0xff;
        //    if (((Level.TILE_BEHAVIORS[b]) & Level.BIT_ANIMATED) == 0)
         //   {                
                var tile=Art.level[b % 16][Math.floor(b / 16)];                
                this.g.drawImage(tile, (x << 4) - this.xCam, (y << 4) - this.yCam);
          //  }
        }
    }
};

/**
 * 
 */ 
LevelRenderer.prototype.setCam=function(xC, yC)
{
    var xCamD = this.xCam - xC; 
    var yCamD = this.yCam - yC;
    this.xCam = Math.floor(xC);
    this.yCam = yC;
    
    this.tmpg.clearRect(0,0,this.width,this.height);
    this.tmpg.drawImage(this.image, 0,0);
    this.g.clearRect(0,0,this.width,this.height);
    this.g.drawImage(this.tmpcv, xCamD, yCamD);

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
        this.updateArea(0, 0, this.width, yCamD);
    }
};    

/**
 * 
 */ 
LevelRenderer.prototype.render=function( g, tick, alpha)
{
    g.drawImage(this.image, 0, 0);

    for (var x = this.xCam / 16; x <= (this.xCam + this.width) / 16; x++)
        for (var y = this.yCam / 16; y <= (this.yCam +this.height) / 16; y++)
        {
            var b = this.level.getBlock(x, y);

            //if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_ANIMATED) > 0)
            if ( this.level.BIT_ANIMATED > 0)
            {
                var animTime = (tick / 3) % 4;

                if ((b % 16) / 4 === 0 && b / 16 == 1)
                {
                    animTime = (tick / 2 + (x + y) / 8) % 20;
                    if (animTime > 3) animTime = 0;
                }
                if ((b % 16) / 4 == 3 && b / 16 === 0)
                {
                    animTime = 2;
                }
                var yo = 0;
                if (x >= 0 && y >= 0 && x < this.level.width && y < this.level.height) 
                {
                    yo = this.level.data[x][y];
                }
                
                if (yo > 0) 
                {
                    yo = Math.floor ( Math.sin((yo - alpha) / 4.0 * Math.PI) * 8);
                }

                //var tile = Art.level[(b % 16) / 4 * 4 + animTime][Math.floor(b / 16)];
                //g.drawImage(tile,(x << 4) - this.xCam, (y << 4) - this.yCam - yo);
            }
/*
            if (renderBehaviors)
            {
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_BLOCK_UPPER) > 0)
                {
                    g.setColor(Color.RED);
                    g.fillRect((x << 4) - xCam, (y << 4) - yCam, 16, 2);
                }
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_BLOCK_ALL) > 0)
                {
                    g.setColor(Color.RED);
                    g.fillRect((x << 4) - xCam, (y << 4) - yCam, 16, 2);
                    g.fillRect((x << 4) - xCam, (y << 4) - yCam + 14, 16, 2);
                    g.fillRect((x << 4) - xCam, (y << 4) - yCam, 2, 16);
                    g.fillRect((x << 4) - xCam + 14, (y << 4) - yCam, 2, 16);
                }
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_BLOCK_LOWER) > 0)
                {
                    g.setColor(Color.RED);
                    g.fillRect((x << 4) - xCam, (y << 4) - yCam + 14, 16, 2);
                }
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_SPECIAL) > 0)
                {
                    g.setColor(Color.PINK);
                    g.fillRect((x << 4) - xCam + 2 + 4, (y << 4) - yCam + 2 + 4, 4, 4);
                }
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_BUMPABLE) > 0)
                {
                    g.setColor(Color.BLUE);
                    g.fillRect((x << 4) - xCam + 2, (y << 4) - yCam + 2, 4, 4);
                }
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_BREAKABLE) > 0)
                {
                    g.setColor(Color.GREEN);
                    g.fillRect((x << 4) - xCam + 2 + 4, (y << 4) - yCam + 2, 4, 4);
                }
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_PICKUPABLE) > 0)
                {
                    g.setColor(Color.YELLOW);
                    g.fillRect((x << 4) - xCam + 2, (y << 4) - yCam + 2 + 4, 4, 4);
                }
                if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_ANIMATED) > 0)
                {
                }
            }
*/
        }
};

/**
 * 
 */ 
LevelRenderer.prototype.repaint=function( x, y, w, h)
{
    this.updateArea(x * 16 - this.xCam, y * 16 - this.yCam, w * 16, h * 16);
};

/**
 * 
 */ 
LevelRenderer.prototype.setLevel=function(lvl)
{
    this.level = lvl;
    this.updateArea(0, 0, this.width, this.height);
};

/**
 * 
 */ 
LevelRenderer.prototype.renderExit0=function( g, tick, alpha, bar)
{
    for (var y = this.level.yExit - 8; y < this.level.yExit; y++)
    {
        var tile=Art.level[12][y == this.level.yExit - 8 ? 4 : 5];
        g.drawImage(tile,(this.level.xExit << 4) - this.xCam - 16, (y << 4) - this.yCam);
    }
    
    var yh = this.level.yExit * 16 - Math.floor((Math.sin((tick + alpha) / 20) * 0.5 + 0.5) * 7 * 16) - 8;
    
    if (bar)
    {
        var tile = Art.level[12][3];
        g.drawImage(tile,(this.level.xExit << 4) - this.xCam - 16, yh - this.yCam);
        tile = Art.level[13][3];
        g.drawImage(tile,(this.level.xExit << 4) - this.xCam, yh - this.yCam);
    }
};

/**
 * 
 */ 
LevelRenderer.prototype.renderExit1=function( g, tick, alpha)
{
    for (var y = this.level.yExit - 8; y < this.level.yExit; y++)
    {
        var tile=Art.level[13][y == this.level.yExit - 8 ? 4 : 5];
        g.drawImage(tile, (this.level.xExit << 4) - this.xCam - 16, (y << 4) - this.yCam);                        
    }
};