function BgRenderer(lvl,largura,altura,dist)
{
    var xCam=0;
    var yCam=0;
    var transparent = 'rgba(0,0,0,0)';
    var level=lvl;

    this.renderBehaviors = false;

    var width=largura;
    var height=altura;
    var distance=dist;
    var image= document.createElement("canvas");
    image.width=width;
    image.height=height;
    var g = image.getContext("2d");
    
    var tmpcv=document.createElement("canvas");
    tmpcv.width=width;
    tmpcv.height=height;
    var tmpg=tmpcv.getContext("2d");

    var updateArea=function(x0, y0, w, h)
    {        
        //g.setBackground(transparent);
        g.clearRect(x0, y0, w, h);
        var xTileStart = (x0 + xCam) / 32;
        var yTileStart = (y0 + yCam) / 32;
        var xTileEnd = (x0 + xCam + w) / 32;
        var yTileEnd = (y0 + yCam + h) / 32;

        for (var x = xTileStart; x <= xTileEnd; x++)
        {            
            for (var y = yTileStart; y <= yTileEnd; y++)
            {
                var b = level.getBlock(x, y) & 0xff;                
                //g.drawImage(Art.bg[b % 8][b / 8], (x << 5) - xCam, (y << 5) - yCam-16, null);
                var tile=Art.img[Art.bg][b % 8][Math.floor(b / 8)];
                g.drawImage(tile, 0,0,tile.width,tile.height, (x << 5) - xCam, (y << 5) - yCam-16,tile.width,tile.height);
            }
        }
    };

    updateArea(0, 0, width, height);


    this.setCam=function(xC, yC)
    {
        xC /= distance;
        yC /= distance;
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



    this.render=function(gg, tick, alpha)
    {
        gg.drawImage(image, 0, 0, image.width,image.height, 0, 0, image.width,image.height);
    };

    this.setLevel=function(lv)
    {
        level = lv;
        updateArea(0, 0, width, height);
    };
}