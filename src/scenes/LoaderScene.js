function LoaderScene(compJogo)
{
    var jogo=compJogo;
    var estado={t:-1,l:-1};
    var tick=0;
    var pontos=1;
    var texto='A Carregar';

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
        Art=new cArt();
        Art.Load();        
    };

    //actualiza a cena
    this.update = function()
    {
        if(Art.statusLoaded())
        {
            jogo.toTitle();
        }    
        estado = Art.status();
        tick++;
        if(tick%20==0)
        {
            pontos++;
            if(pontos>3)
            {
                pontos=1;
            }
            texto='A Carregar';
            for(var i=0;i<3;i++)
            {
                if(i<pontos)
                {
                    texto+='.';
                }
                else
                {
                    texto+=' ';
                }
            }
            texto+=' ('+estado.l+'/'+estado.t+')';
        }
    };

    //desenha a cena  
    this.render= function(ctx,alfa)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 320, 240); 
        //ctx.drawText('16pt Times New Roman','rgba(0,0,255,0.5)',3,30,'16pt Times');
        ctx.fillStyle    = '#00f';
        ctx.font         = 'italic 12px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText  (texto, 160, 120);        
    };
    
}