/**
 * Main game class
 */
function manuelcanvas()
{
    this.TICKS_PER_SECOND = 24;
    this.tela = document.getElementById("tela");
    this.ctx = this.tela.getContext("2d"); //contexto
    this.width = 320;
    this.height = 240; //largura e altura
    this.bbuffer = document.createElement("canvas");
    this.bbuffer.width = this.width;
    this.bbuffer.height = this.height;
    this.bbctx = this.bbuffer.getContext("2d");

    this.lastTick = -1;
    this.renderedFrames = 0;
    this.fps = 0;

    this.time = new Date().getTime() / 1000.0; //converter para segundos
    this.now = this.time;
    this.averagePassedTime = 0;

    //cria a cena inicial
    this.cena = null;
    this.mapScene = null; //world map    
}

/**
 * Função para ganhar o jogo
 */
manuelcanvas.prototype.win = function()
{
    this.cena = new WinScene(this);
    this.cena.init();
};

/**
 * sends game to the titlescreen
 */
manuelcanvas.prototype.toTitle = function()
{
    this.cena = new TitleScene(this);
    this.cena.init();
};

/**
 * starts the game and pushs to the map scene
 */
manuelcanvas.prototype.startGame = function()
{
    this.cena = this.mapScene;
    this.cena.init();
};

/**
 * Trata das teclas carregadas e passa-as para a cena corrente
 */
manuelcanvas.prototype.handlekeys = function(key, press)
{
    if (key == 32)
    {
        this.cena.toggleKey(Manuel.SPACE, press);
    }
    if (key == 37)
    {
        this.cena.toggleKey(Manuel.KEY_LEFT, press);
    }
    if (key == 38)
    {
        this.cena.toggleKey(Manuel.KEY_UP, press);
    }
    if (key == 39)
    {
        this.cena.toggleKey(Manuel.KEY_RIGHT, press);
    }
    if (key == 40)
    {
        this.cena.toggleKey(Manuel.KEY_DOWN, press);
    }
    if (key == 83)
    {
        this.cena.toggleKey(Manuel.KEY_JUMP, press);
    }
    if (key == 65)
    {
        this.cena.toggleKey(Manuel.KEY_RUN, press);
    }
};

/**
 * starts the game engine
 */
manuelcanvas.prototype.start = function()
{
    //loads resources
    this.cena = new LoaderScene(this);
    this.cena.init();

    //defines the world map
    this.mapScene = new MapScene(this);

    var that = this;
    //define as funções de controlo
    document.onkeydown = function(e)
    {
        that.handlekeys(e.keyCode, true);
        return false;
    };

    document.onkeyup = function(e)
    {
        that.handlekeys(e.keyCode, false);
        return false;
    };

    //main loop   
    this.time = new Date().getTime() / 1000.0; //converter para segundos
    this.now = this.time;
    this.mainloop();
};

/**
 * main game loop
 */
manuelcanvas.prototype.mainloop = function()
{
    var lastTime = this.time;
    this.time = new Date().getTime() / 1000.0; //convert para segundos
    this.now = this.time;

    var tick = Math.floor(this.now * this.TICKS_PER_SECOND);
    if (this.lastTick == -1) this.lastTick = tick;
    while (this.lastTick < tick)
    {
        this.cena.update();
        this.lastTick++;

        if (this.lastTick % this.TICKS_PER_SECOND === 0)
        {
            this.fps = this.renderedFrames;
            this.renderedFrames = 0;
        }
    }

    var alpha = (this.now * this.TICKS_PER_SECOND - tick) * 1.0;

    var x = Math.floor(Math.sin(this.now) * 16 + 160);
    var y = Math.floor(Math.cos(this.now) * 16 + 120);

    //faz resize e usa double buffer
    this.cena.render(this.bbctx, alpha);
    this.ctx.drawImage(this.bbuffer, 0, 0, this.width, this.height, 0, 0, this.tela.width, this.tela.height);

    this.renderedFrames++;

    var that = this;
    setTimeout(function()
    {
        that.mainloop();
    }, 5);
};

/**
 * Starts a new 2D level
 */
manuelcanvas.prototype.startLevel = function(seed, difficulty, type)
{
    this.cena = new LevelScene(this, seed, difficulty, type);
    //scene.setSound(sound);
    this.cena.init();
};

/**
 * lida com morrer num nível
 */
manuelcanvas.prototype.levelFailed = function()
{
    this.cena = this.mapScene;
    //mapScene.startMusic();
    //Mario.lives--;
    //if (Mario.lives == 0)
    //{
    //    lose();
    //}
};

/**
 * lida com passar um nível
 */
manuelcanvas.prototype.levelWon = function()
{
    this.cena = this.mapScene;
    //mapScene.startMusic();
    this.mapScene.levelWon();
};