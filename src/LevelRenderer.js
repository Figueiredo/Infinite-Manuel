function LevelRenderer ( lvl, largura, altura)
{
    
    var width =largura;
    var height =altura;    
    var xCam =0; //int
    var yCam=0; //int
    var image= document.createElement("canvas");
    image.width=width;
    image.height=height;
    var g = image.getContext("2d");
    
    var tmpcv=document.createElement("canvas");
    tmpcv.width=width;
    tmpcv.height=height;
    var tmpg=tmpcv.getContext("2d");    
    
    var transparent = 'rgba(0,0,0,0)';
    var level=lvl;

    var renderBehaviors = false;

    var updateArea=function(x0, y0, w, h)
    {        
        //g.setBackground(transparent);
        g.clearRect(x0, y0, w, h);
        var xTileStart = (x0 + xCam) / 16;
        var yTileStart = (y0 + yCam) / 16;
        var xTileEnd = (x0 + xCam + w) / 16;
        var yTileEnd = (y0 + yCam + h) / 16;

        for (var x = xTileStart; x <= xTileEnd; x++)
        {            
            for (var y = yTileStart; y <= yTileEnd; y++)
            {
                var b = level.getBlock(x, y) & 0xff;
            //    if (((Level.TILE_BEHAVIORS[b]) & Level.BIT_ANIMATED) == 0)
             //   {                
                    //g.drawImage(Art.level[b % 16][b / 16], (x << 4) - xCam, (y << 4) - yCam, null);
                    var tile=Art.img[Art.level][b % 16][Math.floor(b / 16)];                
                    g.drawImage(tile, 0,0,tile.width,tile.height, (x << 4) - xCam, (y << 4) - yCam,tile.width,tile.height);
              //  }
            }
        }
    };

    updateArea(0, 0, width, height);
    
    this.setCam=function(xC, yC)
    {
        var xCamD = xCam - xC; 
        var yCamD = yCam - yC;
        xCam = Math.floor(xC);
        yCam = yC;
        
        //g.copyArea(0, 0, width, height, xCamD, yCamD);
        tmpg.clearRect(0,0,width,height);
        tmpg.drawImage(image, 0,0,width,height, 0, 0,width,height);
        g.clearRect(0,0,width,height);
        g.drawImage(tmpcv, 0,0,width,height, xCamD, yCamD,width,height);

        if (xCamD < 0)
        {
            if (xCamD < -width) xCamD = -width;
            updateArea(width + xCamD, 0, -xCamD, height);
        }
        else if (xCamD > 0)
        {
            if (xCamD > width) xCamD = width;
            updateArea(0, 0, xCamD, height);
        }
        

        if (yCamD < 0)
        {
            if (yCamD < -width) yCamD = -width;
            updateArea(0, height + yCamD, width, -yCamD);
        }
        else if (yCamD > 0)
        {
            if (yCamD > width) yCamD = width;
            updateArea(0, 0, width, yCamD);
        }
        //g.drawImage(image, 0,0,width,height, xCamD, yCamD,width,height);
    };    


    this.render=function( g, tick, alpha)
    {
        g.drawImage(image, 0, 0,image.width,image.height,0, 0,image.width,image.height );

        for (var x = xCam / 16; x <= (xCam + width) / 16; x++)
            for (var y = yCam / 16; y <= (yCam + height) / 16; y++)
            {
                var b = level.getBlock(x, y);

                //if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_ANIMATED) > 0)
                if ( Level.BIT_ANIMATED > 0)
                {
                    var animTime = (tick / 3) % 4;

                    if ((b % 16) / 4 == 0 && b / 16 == 1)
                    {
                        animTime = (tick / 2 + (x + y) / 8) % 20;
                        if (animTime > 3) animTime = 0;
                    }
                    if ((b % 16) / 4 == 3 && b / 16 == 0)
                    {
                        animTime = 2;
                    }
                    var yo = 0;
                    if (x >= 0 && y >= 0 && x < level.width && y < level.height) yo = level.data[x][y];
                    
                    if (yo > 0) 
                    yo = Math.floor ( Math.sin((yo - alpha) / 4.0 * Math.PI) * 8);
                    var tile = Art.img[Art.level][(b % 16) / 4 * 4 + animTime][b / 16];
                    g.drawImage(tile,0,0,tile.width,tile.height, (x << 4) - xCam, (y << 4) - yCam - yo, tile.width,tile.height);
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

    this.repaint=function( x, y, w, h)
    {
        updateArea(x * 16 - xCam, y * 16 - yCam, w * 16, h * 16);
    };

    this.setLevel=function(lvll)
    {
        level = lvll;
        updateArea(0, 0, width, height);
    };

    this.renderExit0=function( g, tick, alpha, bar)
    {
        for (var y = level.yExit - 8; y < level.yExit; y++)
        {
            //g.drawImage(Art.level[12][y == level.yExit - 8 ? 4 : 5], (level.xExit << 4) - xCam - 16, (y << 4) - yCam, null);
            var tile=Art.img[Art.level][12][y == level.yExit - 8 ? 4 : 5];
            g.drawImage(tile,0,0,tile.width,tile.height, (level.xExit << 4) - xCam - 16, (y << 4) - yCam, tile.width,tile.height);
        }
        var yh = level.yExit * 16 - Math.floor((Math.sin((tick + alpha) / 20) * 0.5 + 0.5) * 7 * 16) - 8;
        if (bar)
        {
            var tile = Art.img[Art.level][12][3];
            g.drawImage(tile,0,0,tile.width,tile.height, (level.xExit << 4) - xCam - 16, yh - yCam, tile.width,tile.height);
            tile = Art.img[Art.level][13][3];
            g.drawImage(tile,0,0,tile.width,tile.height, (level.xExit << 4) - xCam, yh - yCam, tile.width,tile.height);
        }
    };


    this.renderExit1=function( g, tick, alpha)
    {
        for (var y = level.yExit - 8; y < level.yExit; y++)
        {
            var tile=Art.img[Art.level][13][y == level.yExit - 8 ? 4 : 5];
            g.drawImage(tile,0,0,tile.width,tile.height, (level.xExit << 4) - xCam - 16, (y << 4) - yCam, tile.width,tile.height);                        
        }
    };
}