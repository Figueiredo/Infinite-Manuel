function WinScene(compJogo)
{
    
    var jogo=compJogo;
    var tick=0;
    var scrollMessage = "Thank you for saving me, Manuel!";    

    //array de input da cena
    var teclas = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

    //função para mudar o estado de teclas de input na cena
    this.toggleKey=function(key,isPressed)
    {
        teclas[key]=isPressed;   
    };

    //inicializa a cena
    this.init=function()
    {
        
    };

    //actualiza a cena
    this.update = function()
    {
        tick++;
        if (teclas[manuelC.KEY_JUMP])
        {
            jogo.toTitle();
        }
    };

    //desenha a cena  
    this.render= function(ctx,alfa)
    {
        ctx.fillStyle = '#8080a0';
        ctx.fillRect(0, 0, 320, 240);           
        ctx.drawImage(Art.img[Art.end][Math.floor((tick/24)%2)][0],0,0,96,96, 160-48, 100-48, 96,96);
        drawString(ctx, scrollMessage, 160-scrollMessage.length*4, 160, 0);        
        
    };
    
}