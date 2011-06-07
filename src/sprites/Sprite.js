function Sprite()
{
    this.spriteContext; //SpriteContext
    
    this.xOld=0.0;
    this.yOld=0.0;
    this.x=0.0;
    this.y=0.0;
    this.xa=0.0;
    this.ya=0.0; //float
    
    this.xPic=0;
    this.yPic=0;//int
    this.wPic=32;
    this.hPic = 32;
    this.xPicO=0;
    this.yPicO=0;
    this.xFlipPic = false; //boolean
    this.yFlipPic = false; //boolean
    this.sheet; //image[][]
    this.visible = true; //bolean
    
    this.layer = 1; //int

    this.spriteTemplate; //SpriteTemplate
    
    this.move=function()
    {
        x+=xa;
        y+=ya;
    };
    
    this.render=function(/*Graphics*/ og, /*float*/ alpha)
    {
        if (!visible) return;
        
        var xPixel = Math.floor((xOld+(x-xOld)*alpha)-xPicO);
        var yPixel = Math.floor((yOld+(y-yOld)*alpha)-yPicO);

        og.drawImage(sheet[xPic][yPic], xPixel+(xFlipPic?wPic:0), yPixel+(yFlipPic?hPic:0), xFlipPic?-wPic:wPic, yFlipPic?-hPic:hPic, null);
    };
    
    this.tick=function()
    {
        xOld = x;
        yOld = y;
        this.move();
    };

    this.tickNoMove=function()
    {
        xOld = x;
        yOld = y;
    };

    this.getX=function(/*float*/ alpha)
    {
        return (xOld+(x-xOld)*alpha)-xPicO;
    };

    this.getY=function(/*float*/ alpha)
    {
        return (yOld+(y-yOld)*alpha)-yPicO;
    };

    this.collideCheck=function()
    {
    };

    this.bumpCheck=function(/*int*/ xTile, /*int*/ yTile)
    {
    };

    this.shellCollideCheck=function(/*Shell*/ shell) //boolean
    {
        return false;
    };

    this.release=function(/*Manuel*/ manuel)
    {
    };

    this.fireballCollideCheck=function(/*Fireball*/ fireball) //boolean
    {
        return false;
    };
}