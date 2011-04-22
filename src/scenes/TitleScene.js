function TitleScene(compJogo)
{
    var tick=0;
    var jogo=compJogo;    
    var bgLayer0;
    var bgLayer1;

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
        bgLayer0 = new BgRenderer(createBGLevel(2048, 15, false, LevelTypes.OVERGROUND), 320, 240, 1);        
        bgLayer1 = new BgRenderer(createBGLevel(2048, 15, true, LevelTypes.OVERGROUND), 320, 240, 2);        
    };

    //actualiza a cena
    this.update = function()
    {
        tick++;
        if(teclas[manuelC.SPACE])
        {        
            jogo.startGame();
        }        
    };

    //desenha a cena  
    this.render= function(ctx,alpha)
    {        
        var yo = 16-Math.abs(Math.floor(Math.sin((tick+alpha)/6.0)*8));
        ctx.clearRect(0,0,320,240);
        
        bgLayer0.setCam(tick+160, 0);
        bgLayer1.setCam(tick+160, 0);
        bgLayer1.render(ctx, tick, alpha);
        bgLayer0.render(ctx, tick, alpha);
        
        ctx.drawImage(Art.img[Art.logo], 0, 0, Art.img[Art.logo].width, Art.img[Art.logo].height, 0, yo, Art.img[Art.logo].width, Art.img[Art.logo].height);
        ctx.drawImage(Art.img[Art.title], 0, 0, Art.img[Art.title].width, Art.img[Art.title].height, 0, 120, Art.img[Art.title].width, Art.img[Art.title].height);        
    };
    
}