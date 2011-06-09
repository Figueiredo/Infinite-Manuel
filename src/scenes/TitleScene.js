function TitleScene(compJogo)
{
    this.jogo = compJogo;
    this.bgLayer0 = null;
    this.bgLayer1 = null;
}

TitleScene.prototype = new Scene();

//inicializa a cena
TitleScene.prototype.init = function()
{
    this.bgLayer0 = new BgRenderer(createBGLevel(2048, 15, false, LevelTypes.OVERGROUND), 320, 240, 1);
    this.bgLayer1 = new BgRenderer(createBGLevel(2048, 15, true, LevelTypes.OVERGROUND), 320, 240, 2);
};

//actualiza a cena
TitleScene.prototype.update = function()
{
    this.tick++;
    if (this.teclas[Manuel.KEY_JUMP])
    {
        this.jogo.startGame();
    }
};

//desenha a cena  
TitleScene.prototype.render = function(ctx, alpha)
{
    var yo = 16 - Math.abs(Math.floor(Math.sin((this.tick + alpha) / 6.0) * 8));
    ctx.clearRect(0, 0, 320, 240);

    this.bgLayer0.setCam(this.tick + 160, 0);
    this.bgLayer1.setCam(this.tick + 160, 0);
    this.bgLayer1.render(ctx, this.tick, alpha);
    this.bgLayer0.render(ctx, this.tick, alpha);

    ctx.drawImage(Art.logo, 0, 0, Art.logo.width, Art.logo.height, 0, yo, Art.logo.width, Art.logo.height);
    ctx.drawImage(Art.title, 0, 0, Art.title.width, Art.title.height, 0, 120, Art.title.width, Art.title.height);
};