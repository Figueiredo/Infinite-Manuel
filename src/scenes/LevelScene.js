function LevelScene (compJogo,seed, difficulty,type)
{
    //private List<Sprite> sprites = new ArrayList<Sprite>();
    //private List<Sprite> spritesToAdd = new ArrayList<Sprite>();
    //private List<Sprite> spritesToRemove = new ArrayList<Sprite>();
    var sprites=[];
    var spritesToAdd=[];
    var spritesToRemove=[];

    var level; //Level
    this.manuel=null; //Manuel
    var xCam=0.0, yCam=0.0, xCamO=0.0, yCamO=0.0; //float
    var tmpImage; //image
    var tick=0; //int

    var layer; //LevelRenderer
    var bgLayer = [2];//BgRenderer[2];

    //private GraphicsConfiguration graphicsConfiguration;

    var paused = false; //bool
    var startTime = 0; //int
    var timeLeft=0; //int

    var levelSeed = seed;
    var renderer = compJogo;
    var levelType = type;
    var levelDifficulty = difficulty;
    
    //array de input da cena
    var teclas = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];    


    this.init=function()
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

        level = CreateLevel(320, 15, levelSeed, levelDifficulty, levelType);

/*
        if (levelType==LevelGenerator.TYPE_OVERGROUND)
            Art.startMusic(1);
        else if (levelType==LevelGenerator.TYPE_UNDERGROUND)
            Art.startMusic(2);
        else if (levelType==LevelGenerator.TYPE_CASTLE)
            Art.startMusic(3);
*/        

        paused = false;
        //Sprite.spriteContext = this;
        sprites=[];
        layer = new LevelRenderer(level, 320, 240);
        for (var i = 0; i < 2; i++)
        {
            var scrollSpeed = 4 >> i;
            var w = Math.floor( ((level.width * 16) - 320) / scrollSpeed + 320);
            var h = Math.floor( ((level.height * 16) - 240) / scrollSpeed + 240);
            var bgLevel = createBGLevel(w / 32 + 1, h / 32 + 1, i == 0, levelType);
            bgLayer[i] = new BgRenderer(bgLevel,  320, 240, scrollSpeed);
        }
        manuel = new Manuel(this);
        sprites.push(manuel);
        startTime = 1;
        
        timeLeft = 200*15;

        tick = 0;
    };

    var fireballsOnScreen = 0; //int

    //List<Shell> shellsToCheck = new ArrayList<Shell>();

    this.checkShellCollide =function(shell)
    {
        //shellsToCheck.add(shell);
    };

    //List<Fireball> fireballsToCheck = new ArrayList<Fireball>();

    this.checkFireballCollide=function(fireball)
    {
        //fireballsToCheck.add(fireball);
    };

    this.update=function()
    {
        //especial
        if(teclas[manuelC.SPACE])
        {
            renderer.levelWon();
        }        
        
        timeLeft--;
        if (timeLeft==0)
        {
            manuel.die();
        }
        xCamO = xCam;
        yCamO = yCam;

        if (startTime > 0)
        {
            startTime++;
        }

        var targetXCam = manuel.x - 160; //foat

        xCam = targetXCam;

        if (xCam < 0) xCam = 0;
        if (xCam > level.width * 16 - 320) xCam = level.width * 16 - 320;


        fireballsOnScreen = 0;

        for (var sprite in sprites)
        {
            if (sprite != manuel)
            {
                var xd = sprite.x - xCam;
                var yd = sprite.y - yCam;
                if (xd < -64 || xd > 320 + 64 || yd < -64 || yd > 240 + 64)
                {
                    removeSprite(sprite);
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

        if (paused)
        {
            for (var sprite in sprites)
            {
                if (sprite == manuel)
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
            tick++;
            level.update();

            var hasShotCannon = false; //bool
            var xCannon = 0; //int

            for (var x = Math.floor( xCam / 16 - 1); x <= Math.floor( (xCam + layer.width) / 16 + 1); x++)
                for (var y = Math.floor( yCam / 16 - 1); y <= Math.floor( (yCam + layer.height) / 16 + 1); y++)
                {
                    var dir = 0; //int

                    if (x * 16 + 8 > manuel.x + 16) dir = -1;
                    if (x * 16 + 8 < manuel.x - 16) dir = 1;

                    var st = level.getSpriteTemplate(x, y);

                   if (st != null)
                    {
                        if (st.lastVisibleTick != tick - 1)
                        {
                            if (st.sprite == null || !sprites.contains(st.sprite))
                            {
                                st.spawn(this, x, y, dir);
                            }
                        }

                        st.lastVisibleTick = tick;
                    }

                    if (dir != 0)
                    {
                        var b = level.getBlock(x, y); //byte
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

            for (var sprite in sprites)
            {
                if(sprite.tick)
                    sprite.tick();
            }

            for (var sprite in sprites)
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
        spritesToAdd=[];
        spritesToRemove=[];
        
    };
    
    //private DecimalFormat df = new DecimalFormat("00");
    //private DecimalFormat df2 = new DecimalFormat("000");

    this.render=function(g, alpha)
    {
        var xCam = Math.floor( (manuel.xOld + (manuel.x - manuel.xOld) * alpha) - 160); //int
        var yCam = Math.floor( (manuel.yOld + (manuel.y - manuel.yOld) * alpha) - 120); //int
        //var xCam=0;
        //var yCam=0;

        if (xCam < 0) xCam = 0;
        if (yCam < 0) yCam = 0;
        if (xCam > level.width * 16 - 320) xCam = level.width * 16 - 320;
        if (yCam > level.height * 16 - 240) yCam = level.height * 16 - 240;

        
        for (var i = 0; i < 2; i++)
        {
            bgLayer[i].setCam(xCam, yCam);
            bgLayer[i].render(g, tick, alpha);
        }

        g.translate(-xCam, -yCam);
        for (var sprite in sprites)
        {
            if (sprite.layer == 0)
            {
                alert("bla");
                sprite.render(g, alpha);
            }
        }
        g.translate(xCam, yCam);

        layer.setCam(xCam, yCam);
        layer.render(g, tick, paused?0:alpha);
        layer.renderExit0(g, tick, paused?0:alpha, manuel.winTime==0);

        g.translate(-xCam, -yCam);
        //for (var sprite in sprites)
        for(var sp=0;sp<sprites.length;sp++)
        {
            if (sprites[sp].layer == 1)
            {
                sprites[sp].render(g, alpha);
            }
        }

        g.translate(xCam, yCam);
        //g.setColor(Color.BLACK);
        layer.renderExit1(g, tick, paused?0:alpha);
        
        drawStringDropShadow(g, "MANUEL " + manuel.lives, 0, 0, 7);
        drawStringDropShadow(g, "00000000", 0, 1, 7);
        
        drawStringDropShadow(g, "COIN", 14, 0, 7);
        drawStringDropShadow(g, " "+manuel.coins, 14, 1, 7);

        drawStringDropShadow(g, "WORLD", 24, 0, 7);
        drawStringDropShadow(g, " "+manuel.levelString, 24, 1, 7);

        drawStringDropShadow(g, "TIME", 35, 0, 7);
        var time = Math.floor((timeLeft+15-1)/15);
        if (time<0) time = 0;
        drawStringDropShadow(g, " "+time, 35, 1, 7);//df2.format(time), 35, 1, 7);


        if (startTime > 0)
        {
            var t = startTime + alpha - 2;
            t = t * t * 0.6;
            renderBlackout(g, 160, 120, Math.floor(t));
        }
        

        

/*        if (manuel.winTime > 0)
        {
            float t = manuel.winTime + alpha;
            t = t * t * 0.2f;

            if (t > 900)
            {
                renderer.levelWon();
                //              replayer = new Replayer(recorder.getBytes());
//                init();
            }

            renderBlackout(g, (int) (manuel.xDeathPos - xCam), (int) (manuel.yDeathPos - yCam), (int) (320 - t));
        }

        if (manuel.deathTime > 0)
        {
            float t = manuel.deathTime + alpha;
            t = t * t * 0.4f;

            if (t > 1800)
            {
                renderer.levelFailed();
                //              replayer = new Replayer(recorder.getBytes());
//                init();
            }

            renderBlackout(g, (int) (manuel.xDeathPos - xCam), (int) (manuel.yDeathPos - yCam), (int) (320 - t));
        }
*/    };

    
    var renderBlackout=function( g, x, y, radius)
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


    this.addSprite=function( sprite)
    {
        spritesToAdd.add(sprite);
        sprite.tick();
    };

    this.removeSprite=function( sprite)
    {
        spritesToRemove.add(sprite);
    };

    this.getX=function( alpha)
    {
        var xCam = Math.floor( (manuel.xOld + (manuel.x - manuel.xOld) * alpha) - 160);
        //        int yCam = (int) (manuel.yOld + (manuel.y - manuel.yOld) * alpha) - 120;
        //int xCam = (int) (xCamO + (this.xCam - xCamO) * alpha);
        //        int yCam = (int) (yCamO + (this.yCam - yCamO) * alpha);
        if (xCam < 0) xCam = 0;
        //        if (yCam < 0) yCam = 0;
        //        if (yCam > 0) yCam = 0;
        return xCam + 160;
    };

    this.getY=function(alpha)
    {
        return 0;
    };

    this.bump=function( x, y, canBreakBricks)
    {
        var block = level.getBlock(x, y); //byte

        if ((Level.TILE_BEHAVIORS[block & 0xff] & Level.BIT_BUMPABLE) > 0)
        {
            bumpInto(x, y - 1);
            level.setBlock(x, y, 4);
            level.setBlockData(x, y, 4);
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

    this.bumpInto=function( x, y)
    {
        var block = level.getBlock(x, y);//byte
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
  */  };
  
    //função para mudar o estado de teclas de input na cena
    this.toggleKey=function(key,isPressed)
    {
        teclas[key]=isPressed;   
    };  
}