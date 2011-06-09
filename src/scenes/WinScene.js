function WinScene(compJogo)
{    
    this.jogo=compJogo;
    this.scrollMessage = "Thank you for saving me, Manuel!";    
}

WinScene.prototype = new Scene();

/**
 * actualiza a cena
 */
WinScene.prototype.update = function()
{
    this.tick++;
    if (this.teclas[Manuel.KEY_JUMP])
    {
        this.jogo.toTitle();
    }
};
 
/**
 * desenha a cena
 */
WinScene.prototype.render= function(ctx,alfa)
{
    ctx.fillStyle = '#8080a0';
    ctx.fillRect(0, 0, 320, 240);           
    ctx.drawImage(Art.end[Math.floor((this.tick/24)%2)][0],0,0,96,96, 160-48, 100-48, 96,96);
    drawString(ctx, this.scrollMessage, 160-this.scrollMessage.length*4, 160, 0);                
}; 
