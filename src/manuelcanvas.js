function manuelcanvas()
{
    var TICKS_PER_SECOND = 24;
    var tela=document.getElementById("tela");
    var ctx=tela.getContext("2d"); //contexto
    var width=320, height=240; //largura e altura
    var bbuffer=document.createElement("canvas");
    bbuffer.width=width;
    bbuffer.height=height;
    var bbctx=bbuffer.getContext("2d");
    
    
    var lastTick = -1;
    var renderedFrames = 0;
    var fps = 0;

    var time = new Date().getTime() / 1000.0;  //converter para segundos
    var now = time;
    var averagePassedTime = 0;    
    
    //cria a cena inicial
    var cena = null;
    
    this.toTitle=function()
    {
        cena= new TitleScene(this);
        cena.init();
    };    
    
    this.startGame=function()
    {
        cena= new scene_basic();
        cena.init();        
    };
        
    this.start = function()
    {
        cena = new LoaderScene(this);
        cena.init();
        
        //define as funções de controlo
        document.onkeydown=function(e)
        {
            if(e.keyCode==32)
            {
                cena.toggleKey(manuelC.SPACE,true);
            }
        };
        
        document.onkeyup=function(e)
        {
            if(e.keyCode==32)
            {
                cena.toggleKey(manuelC.SPACE,false);
            }
        };

        //main loop   
        time = new Date().getTime() / 1000.0;  //converter para segundos
        now = time;        
        mainloop();
    
    };
    
    var mainloop=function()
    {
        
        var lastTime = time;    
        time = new Date().getTime() / 1000.0; //convert para segundos
        now = time;

        var tick = Math.floor (now * TICKS_PER_SECOND);
        if (lastTick == -1) lastTick = tick;
        while (lastTick < tick)
        {

            cena.update();
            lastTick++;

            if (lastTick % TICKS_PER_SECOND === 0)
            {
                fps = renderedFrames;
                renderedFrames = 0;
            }
        }

        var alpha = (now * TICKS_PER_SECOND - tick)*1.0;

        var x = Math.floor(Math.sin(now) * 16 + 160);
        var y = Math.floor(Math.cos(now) * 16 + 120);

        //cena.render(ctx,alpha);
        
        //experiência de resize
        cena.render(bbctx,alpha);
        ctx.drawImage(bbuffer,0,0,width,height,0,0,tela.width,tela.height);
        
/*
        if (!this.hasFocus() && tick/4%2==0)
        {
            String msg = "CLICK TO PLAY";

            drawString(og, msg, 160 - msg.length() * 4 + 1, 110 + 1, 0);
            drawString(og, msg, 160 - msg.length() * 4, 110, 7);
        }
        og.setColor(Color.BLACK);
*/           
        /*
        drawString(og, "FPS: " + fps, 5, 5, 0);
        drawString(og, "FPS: " + fps, 4, 4, 7);
        */
/*
        if (width != 320 || height != 240)
        {
            if (useScale2x)
            {
                g.drawImage(scale2x.scale(image), 0, 0, null);
            }
            else
            {
                g.drawImage(image, 0, 0, 640, 480, null);
            }
        }
        else
        {
            g.drawImage(image, 0, 0, null);
        }
*/
        renderedFrames++;

        setTimeout(mainloop,5);
    };
    
}