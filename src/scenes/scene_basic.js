function scene_basic()
{
    this.cor = 'cornflowerblue';
}

scene_basic.prototype = new Scene();

//actualiza a cena
scene_basic.prototype.update = function()
{
    if (this.teclas[Manuel.SPACE])
    {
        this.cor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
    }
};

//desenha a cena  
scene_basic.prototype.render = function(ctx, alfa)
{
    ctx.fillStyle = this.cor;
    ctx.fillRect(0, 0, ctx.width, ctx.height);
};