function scene_basic()
{
    var cor = 'cornflowerblue';

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
        if(teclas[manuelC.SPACE])
        {
            cor = 'rgb('+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255)+')';            
        }
    };

    //desenha a cena  
    this.render= function(ctx,alfa)
    {
        ctx.fillStyle = cor;
        ctx.fillRect(0, 0, 320, 240);   
    };
    
}