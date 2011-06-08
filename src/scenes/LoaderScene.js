function LoaderScene(compJogo)
{
    this.jogo = compJogo;
    this.estado = {
        t: -1,
        l: -1
    };
    this.tick = 0;
    this.pontos = 1;
    this.texto = 'A Carregar... (X/X)';
}

LoaderScene.prototype = new Scene();

//inicializa a cena
LoaderScene.prototype.init = function()
{
    Art = new cArt();
    Art.Load();
};

//actualiza a cena
LoaderScene.prototype.update = function()
{
    if (Art.statusLoaded())
    {
        this.jogo.toTitle();
    }
    this.estado = Art.status();
    this.tick++;
    if (this.tick % 20 === 0)
    {
        this.pontos++;
        if (this.pontos > 3)
        {
            this.pontos = 1;
        }
        this.texto = 'A Carregar';
        for (var i = 0; i < 3; i++)
        {
            if (i < this.pontos)
            {
                this.texto += '.';
            }
            else
            {
                this.texto += ' ';
            }
        }
        this.texto += ' (' + this.estado.l + '/' + this.estado.t + ')';
    }
};

//desenha a cena  
LoaderScene.prototype.render = function(ctx, alfa)
{
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 320, 240);
    ctx.fillStyle = '#00f';
    ctx.font = 'italic 12px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(this.texto, 160, 120);
};