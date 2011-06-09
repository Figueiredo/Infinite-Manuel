/**
 * 
 */ 
function LevelScene (compJogo,seed, difficulty,type)
{
    //private List<Sprite> sprites = new ArrayList<Sprite>();
    //private List<Sprite> spritesToAdd = new ArrayList<Sprite>();
    //private List<Sprite> spritesToRemove = new ArrayList<Sprite>();
    this.sprites=[];
    this.spritesToAdd=[];
    this.spritesToRemove=[];

    this.level=null; //Level
    this.manuel=null; //Manuel
    this.xCam=0.0;
    this.yCam=0.0;
    this.xCamO=0.0;
    this.yCamO=0.0; //float
    this.tmpImage=null; //image

    this.layer=null; //LevelRenderer
    this.bgLayer = [2];//BgRenderer[2];

    //private GraphicsConfiguration graphicsConfiguration;

    this.paused = false; //bool
    this.startTime = 0; //int
    this.timeLeft=0; //int

    this.levelSeed = seed;
    this.renderer = compJogo;
    this.levelType = type;
    this.levelDifficulty = difficulty;
    
    this.fireballsOnScreen = 0; //int

    //List<Shell> shellsToCheck = new ArrayList<Shell>();
    //List<Fireball> fireballsToCheck = new ArrayList<Fireball>();

    //private DecimalFormat df = new DecimalFormat("00");
    //private DecimalFormat df2 = new DecimalFormat("000");
}

LevelScene.prototype = new Scene();

/**
 * 
 */ 
LevelScene.prototype.init=function()
{
    /* TODO:DARN TRICKY PART NEEDED?
    try
    {
        Level.loadBehaviors(new DataInputStream(LevelScene.class.getResourceAsStream("/tiles.dat")));
    }
    catch (IOException e)
    {
        e.printStackTrace();
        System.exit(0);
    }
    */

    this.level = CreateLevel(320, 15, this.levelSeed, this.levelDifficulty, this.levelType);

/*
    if (levelType==LevelGenerator.TYPE_OVERGROUND)
        Art.startMusic(1);
    else if (levelType==LevelGenerator.TYPE_UNDERGROUND)
        Art.startMusic(2);
    else if (levelType==LevelGenerator.TYPE_CASTLE)
        Art.startMusic(3);
*/        

    this.paused = false;
    //Sprite.spriteContext = this;
    this.sprites=[];
    this.layer = new LevelRenderer(this.level, 320, 240);
    for (var i = 0; i < 2; i++)
    {
        var scrollSpeed = 4 >> i;
        var w = Math.floor( ((this.level.width * 16) - 320) / scrollSpeed + 320);
        var h = Math.floor( ((this.level.height * 16) - 240) / scrollSpeed + 240);
        var bgLevel = createBGLevel(w / 32 + 1, h / 32 + 1, i === 0, this.levelType);
        this.bgLayer[i] = new BgRenderer(bgLevel,  320, 240, scrollSpeed);
    }
    this.manuel = Manuel;
    this.manuel.setWorld(this);
    this.sprites.push(this.manuel);
    this.startTime = 1;
    
    this.timeLeft = 200*15;

    this.tick = 0;
};

/**
 * 
 */
LevelScene.prototype.checkShellCollide =function(shell)
{
    //shellsToCheck.add(shell);
};

/**
 * 
 */
LevelScene.prototype.checkFireballCollide=function(fireball)
{
    //fireballsToCheck.add(fireball);
};

/**
 * 
 */
LevelScene.prototype.update=function()
{
    //especial
    if(this.teclas[Manuel.SPACE])
    {
        this.renderer.levelWon();
    }        
    
    this.timeLeft--;
    if (this.timeLeft===0)
    {
        this.manuel.die();
    }
    this.xCamO = this.xCam;
    this.yCamO = this.yCam;

    if (this.startTime > 0)
    {
        this.startTime++;
    }

    var targetXCam = this.manuel.x - 160; //foat

    this.xCam = targetXCam;

    if (this.xCam < 0) this.xCam = 0;
    if (this.xCam > this.level.width * 16 - 320) this.xCam = this.level.width * 16 - 320;


    this.fireballsOnScreen = 0;

    for (var sprite in this.sprites)
    {
        if (sprite != this.manuel)
        {
            var xd = sprite.x - this.xCam;
            var yd = sprite.y - this.yCam;
            if (xd < -64 || xd > 320 + 64 || yd < -64 || yd > 240 + 64)
            {
                this.removeSprite(sprite);
            }
            else
            {
              /*  if (sprite instanceof Fireball)
                {
                    fireballsOnScreen++;
                }
                */
            }
        }
    }

    if (this.paused)
    {
        for (var sprite in this.sprites)
        {
            if (sprite == this.manuel)
            {
                sprite.tick();
            }
            else
            {
                sprite.tickNoMove();
            }
        }
    }
    else
    {
        this.tick++;
        this.level.update();

        var hasShotCannon = false; //bool
        var xCannon = 0; //int

        for (var x = Math.floor( this.xCam / 16 - 1); x <= Math.floor( (this.xCam + this.layer.width) / 16 + 1); x++)
            for (var y = Math.floor( this.yCam / 16 - 1); y <= Math.floor( (this.yCam + this.layer.height) / 16 + 1); y++)
            {
                var dir = 0; //int

                if (x * 16 + 8 > this.manuel.x + 16) dir = -1;
                if (x * 16 + 8 < this.manuel.x - 16) dir = 1;

                var st = this.level.getSpriteTemplate(x, y);

               if (st !== null)
                {
                    if (st.lastVisibleTick != this.tick - 1)
                    {
                        if (st.sprite === null || !sprites.contains(st.sprite))
                        {
                            st.spawn(this, x, y, dir);
                        }
                    }

                    st.lastVisibleTick = this.tick;
                }

                if (dir !== 0)
                {
                    var b = this.level.getBlock(x, y); //byte
                  /*  if (((Level.TILE_BEHAVIORS[b & 0xff]) & Level.BIT_ANIMATED) > 0)
                    {
                        if ((b % 16) / 4 == 3 && b / 16 == 0)
                        {
                            if ((tick - x * 2) % 100 == 0)
                            {
                                xCannon = x;
                                for (var i = 0; i < 8; i++)
                                {
                                    //addSprite(new Sparkle(x * 16 + 8, y * 16 + (int) (Math.random() * 16), (float) Math.random() * dir, 0, 0, 1, 5));
                                }
                                //addSprite(new BulletBill(this, x * 16 + 8 + dir * 8, y * 16 + 15, dir));
                                hasShotCannon = true;
                            }
                        }
                    }
                */}
            }

        if (hasShotCannon)
        {
            //sound.play(Art.samples[Art.SAMPLE_CANNON_FIRE], new FixedSoundSource(xCannon * 16, yCam + 120), 1, 1, 1);
        }

        for (var sprite in this.sprites)
        {
            if(sprite.tick)
                sprite.tick();
        }

        for (var sprite in this.sprites)
        {
            if(sprite.collideCheck)
                sprite.collideCheck();
        }

/*            for (Shell shell : shellsToCheck)
        {
            for (Sprite sprite : sprites)
            {
                if (sprite != shell && !shell.dead)
                {
                    if (sprite.shellCollideCheck(shell))
                    {
                        if (manuel.carried == shell && !shell.dead)
                        {
                            manuel.carried = null;
                            shell.die();
                        }
                    }
                }
            }
        }*/
        //shellsToCheck.clear();

    /*    for (Fireball fireball : fireballsToCheck)
        {
            for (Sprite sprite : sprites)
            {
                if (sprite != fireball && !fireball.dead)
                {
                    if (sprite.fireballCollideCheck(fireball))
                    {
                        fireball.die();
                    }
                }
            }
        }*/
        //fireballsToCheck.clear();
    }

    //sprites.addAll(0, spritesToAdd);
    //sprites.removeAll(spritesToRemove);
    this.spritesToAdd=[];
    this.spritesToRemove=[];
    
}; 

/**
 * 
 */ 
LevelScene.prototype.render=function(g, alpha)
{
    var xCam = Math.floor( (this.manuel.xOld + (this.manuel.x - this.manuel.xOld) * alpha) - 160); //int
    var yCam = Math.floor( (this.manuel.yOld + (this.manuel.y - this.manuel.yOld) * alpha) - 120); //int
    //var xCam=0;
    //var yCam=0;

    if (xCam < 0) xCam = 0;
    if (yCam < 0) yCam = 0;
    if (xCam > this.level.width * 16 - 320) xCam = this.level.width * 16 - 320;
    if (yCam > this.level.height * 16 - 240) yCam = this.level.height * 16 - 240;

    
    for (var i = 0; i < 2; i++)
    {
        this.bgLayer[i].setCam(xCam, yCam);
        this.bgLayer[i].render(g, this.tick, alpha);
    }

    g.translate(-xCam, -yCam);
    for (var sprite in this.sprites)
    {
        if (sprite.layer === 0)
        {            
            sprite.render(g, alpha);
        }
    }
    g.translate(xCam, yCam);

    this.layer.setCam(xCam, yCam);
    this.layer.render(g, this.tick, this.paused?0:alpha);
    this.layer.renderExit0(g, this.tick, this.paused?0:alpha, this.manuel.winTime===0);

    g.translate(-xCam, -yCam);
    //for (var sprite in sprites)
    for(var sp=0;sp<this.sprites.length;sp++)
    {
        if (this.sprites[sp].layer == 1)
        {
            this.sprites[sp].render(g, alpha);
        }
    }

    g.translate(xCam, yCam);
    //g.setColor(Color.BLACK);
    this.layer.renderExit1(g, this.tick, this.paused?0:alpha);
    
    drawStringDropShadow(g, "MANUEL " +this. manuel.lives, 0, 0, 7);
    drawStringDropShadow(g, "00000000", 0, 1, 7);
    
    drawStringDropShadow(g, "COIN", 14, 0, 7);
    drawStringDropShadow(g, " "+this.manuel.coins, 14, 1, 7);

    drawStringDropShadow(g, "WORLD", 24, 0, 7);
    drawStringDropShadow(g, " "+this.manuel.levelString, 24, 1, 7);

    drawStringDropShadow(g, "TIME", 35, 0, 7);
    var time = Math.floor((this.timeLeft+15-1)/15);
    if (time<0) time = 0;
    drawStringDropShadow(g, " "+time, 35, 1, 7);//df2.format(time), 35, 1, 7);

    if (this.startTime > 0)
    {
        var t = this.startTime + alpha - 2;
        t = t * t * 0.6;
        this.renderBlackout(g, 160, 120, Math.floor(t));
    }


    if (this.manuel.winTime > 0)
    {
        var t = this.manuel.winTime + alpha;
        t = t * t * 0.2;

        if (t > 900)
        {
            this.renderer.levelWon();
            //replayer = new Replayer(recorder.getBytes());
            //init();
        }

        this.renderBlackout(g, Math.floor(this.manuel.xDeathPos - xCam), Math.floor(this.manuel.yDeathPos - yCam), Math.floor(320 - t));
    }

    if (this.manuel.deathTime > 0)
    {
        var t = this.manuel.deathTime + alpha;
        t = t * t * 0.4;

        if (t > 1800)
        {
            this.renderer.levelFailed();
            //replayer = new Replayer(recorder.getBytes());
            //init();
        }

        this.renderBlackout(g, Math.floor(this.manuel.xDeathPos - xCam), Math.floor(this.manuel.yDeathPos - yCam), Math.floor(320 - t));
    }
};
 
/**
 * 
 */
LevelScene.prototype.renderBlackout=function( g, x, y, radius)
{
/*       if (radius > 320) return;

    var xp = [20]; //int[]
    var yp = [20]; //int[]
    for (var i = 0; i < 16; i++)
    {
        xp[i] = x + Math.floor( (Math.cos(i * Math.PI / 15) * radius));
        yp[i] = y + Math.floor( (Math.sin(i * Math.PI / 15) * radius));
    }
    xp[16] = 320;
    yp[16] = y;
    xp[17] = 320;
    yp[17] = 240;
    xp[18] = 0;
    yp[18] = 240;
    xp[19] = 0;
    yp[19] = y;
    g.fillPolygon(xp, yp, xp.length);

    for (var i = 0; i < 16; i++)
    {
        xp[i] = x - Math.floor( (Math.cos(i * Math.PI / 15) * radius));
        yp[i] = y - Math.floor( (Math.sin(i * Math.PI / 15) * radius));
    }
    xp[16] = 320;
    yp[16] = y;
    xp[17] = 320;
    yp[17] = 0;
    xp[18] = 0;
    yp[18] = 0;
    xp[19] = 0;
    yp[19] = y;

    g.fillPolygon(xp, yp, xp.length);*/
};

/**
 * 
 */ 
LevelScene.prototype.addSprite=function( sprite)
{
    this.spritesToAdd.add(sprite);
    sprite.tick();
};

/**
 * 
 */ 
LevelScene.prototype.removeSprite=function( sprite)
{
    this.spritesToRemove.add(sprite);
};

/**
 * 
 */ 
LevelScene.prototype.getX=function( alpha)
{
    var xCam = Math.floor( (this.manuel.xOld + (this.manuel.x - this.manuel.xOld) * alpha) - 160);
    //        int yCam = (int) (manuel.yOld + (manuel.y - manuel.yOld) * alpha) - 120;
    //int xCam = (int) (xCamO + (this.xCam - xCamO) * alpha);
    //        int yCam = (int) (yCamO + (this.yCam - yCamO) * alpha);
    if (xCam < 0) xCam = 0;
    //        if (yCam < 0) yCam = 0;
    //        if (yCam > 0) yCam = 0;
    return xCam + 160;
};

/**
 * 
 */ 
LevelScene.prototype.getY=function(alpha)
{
    return 0;
};

/**
 * 
 */
LevelScene.prototype.bump=function( x, y, canBreakBricks)
{
    var block = this.level.getBlock(x, y); //byte

    if ((this.Level.TILE_BEHAVIORS[block & 0xff] & this.Level.BIT_BUMPABLE) > 0)
    {
        this.bumpInto(x, y - 1);
        this.level.setBlock(x, y, 4);
        this.level.setBlockData(x, y, 4);
/*
        if (((Level.TILE_BEHAVIORS[block & 0xff]) & Level.BIT_SPECIAL) > 0)
        {
            sound.play(Art.samples[Art.SAMPLE_ITEM_SPROUT], new FixedSoundSource(x * 16 + 8, y * 16 + 8), 1, 1, 1);
            if (!Manuel.large)
            {
                addSprite(new Mushroom(this, x * 16 + 8, y * 16 + 8));
            }
            else
            {
                addSprite(new FireFlower(this, x * 16 + 8, y * 16 + 8));
            }
        }
        else
        {
            Manuel.getCoin();
            sound.play(Art.samples[Art.SAMPLE_GET_COIN], new FixedSoundSource(x * 16 + 8, y * 16 + 8), 1, 1, 1);
            addSprite(new CoinAnim(x, y));
        }*/
    }

/*
    if ((Level.TILE_BEHAVIORS[block & 0xff] & Level.BIT_BREAKABLE) > 0)
    {
        bumpInto(x, y - 1);
        if (canBreakBricks)
        {
            sound.play(Art.samples[Art.SAMPLE_BREAK_BLOCK], new FixedSoundSource(x * 16 + 8, y * 16 + 8), 1, 1, 1);
            level.setBlock(x, y, (byte) 0);
            for (int xx = 0; xx < 2; xx++)
                for (int yy = 0; yy < 2; yy++)
                    addSprite(new Particle(x * 16 + xx * 8 + 4, y * 16 + yy * 8 + 4, (xx * 2 - 1) * 4, (yy * 2 - 1) * 4 - 8));
        }
        else
        {
            level.setBlockData(x, y, (byte) 4);
        }
    }*/
}; 

/**
 * 
 */
LevelScene.prototype.bumpInto=function( x, y)
{
    var block = this.level.getBlock(x, y);//byte
/*        if (((Level.TILE_BEHAVIORS[block & 0xff]) & Level.BIT_PICKUPABLE) > 0)
    {
        Manuel.getCoin();
        sound.play(Art.samples[Art.SAMPLE_GET_COIN], new FixedSoundSource(x * 16 + 8, y * 16 + 8), 1, 1, 1);
        level.setBlock(x, y, (byte) 0);
        addSprite(new CoinAnim(x, y + 1));
    }

    for (Sprite sprite : sprites)
    {
        sprite.bumpCheck(x, y);
    }
*/
}; 
