function Sprite()
{
    this.spriteContext = null; //SpriteContext
    this.xOld = 0.0;
    this.yOld = 0.0;
    this.x = 0.0;
    this.y = 0.0;
    this.xa = 0.0;
    this.ya = 0.0; //float
    this.xPic = 0;
    this.yPic = 0; //int
    this.wPic = 32;
    this.hPic = 32;
    this.xPicO = 0;
    this.yPicO = 0;
    this.xFlipPic = false; //boolean
    this.yFlipPic = false; //boolean
    this.sheet = null; //image[][]
    this.visible = true; //bolean
    this.layer = 1; //int
    this.spriteTemplate = null; //SpriteTemplate
}

Sprite.prototype.move = function()
{
    this.x += this.xa;
    this.y += this.ya;
};

Sprite.prototype.render = function( /*Graphics*/ og, /*float*/ alpha)
{
    if (!this.visible) return;

    var xPixel = Math.floor((this.xOld + (this.x - this.xOld) * alpha) - this.xPicO);
    var yPixel = Math.floor((this.yOld + (this.y - this.yOld) * alpha) - this.yPicO);

    og.drawImage(this.sheet[this.xPic][this.yPic], xPixel + (this.xFlipPic ? this.wPic : 0), yPixel + (this.yFlipPic ? this.hPic : 0), this.xFlipPic ? -this.wPic : this.wPic, this.yFlipPic ? -this.hPic : this.hPic, null);
};

Sprite.prototype.tick = function()
{
    this.xOld = this.x;
    this.yOld = this.y;
    this.move();
};

Sprite.prototype.tickNoMove = function()
{
    this.xOld = this.x;
    this.yOld = this.y;
};

Sprite.prototype.getX = function( /*float*/ alpha)
{
    return (this.xOld + (this.x - this.xOld) * alpha) - this.xPicO;
};

Sprite.prototype.getY = function( /*float*/ alpha)
{
    return (this.yOld + (this.y - this.yOld) * alpha) - this.yPicO;
};

Sprite.prototype.collideCheck = function()
{};

Sprite.prototype.bumpCheck = function( /*int*/ xTile, /*int*/ yTile)
{};

Sprite.prototype.shellCollideCheck = function( /*Shell*/ shell) //boolean
{
    return false;
};

Sprite.prototype.release = function( /*Manuel*/ manuel)
{};

Sprite.prototype.fireballCollideCheck = function( /*Fireball*/ fireball) //boolean
{
    return false;
};