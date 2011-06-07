function Manuel(/*LevelScene*/ _world) /*extends Sprite*/
{
    this.spriteContext=null; //SpriteContext
    
    this.xOld=0.0;
    this.yOld=0.0;
    this.x=0.0;
    this.y=0.0;
    this.xa=0.0;
    this.ya=0.0; //float
    
    this.xPic=0;
    this.yPic=0;//int
    this.wPic=32;
    this.hPic = 32;
    this.xPicO=0;
    this.yPicO=0;
    this.xFlipPic = false; //boolean
    this.yFlipPic = false; //boolean
    this.sheet=Art.img[Art.pequenoManuel]; //image[][]
    this.visible = true; //bolean
    
    this.layer = 1; //int

    this.spriteTemplate=null; //SpriteTemplate    
    
    
    this.large = false; //boolean
    this.fire = false; //boolean
    this.coins = 0; //int
    this.lives = 3; //int
    this.levelString = "none"; //string


    this.resetStatic=function()
    {
        Manuel.large = false;
        Manuel.fire = false;
        Manuel.coins = 0;
        Manuel.lives = 3;
        Manuel.levelString = "none";
    };


    this.GROUND_INERTIA = 0.89; //float
    this.AIR_INERTIA = 0.89; //float

    this.keys=[];
    var runTime=0.0; //float
    var wasOnGround = false; //boolean
    var onGround = false;
    var mayJump = false;
    var ducking = false;
    var sliding = false;
    var jumpTime = 0; //int
    var xJumpSpeed=0.0; //float
    var yJumpSpeed=0.0; //float
    var canShoot = false;

    var width = 4; //int
    var height = 24; //int

    
    this.facing=0;
    var powerUpTime = 0;

    this.xDeathPos=0;
    this.yDeathPos=0;

    this.deathTime = 0;
    this.winTime = 0;
    var invulnerableTime = 0;

    this.carried = null; //Sprite
    var instance; //Manuel
    
    var lastLarge=false; //boolean
    var lastFire=false;
    var newLarge=false;
    var newFire=false;
    
    var calcPic=function()
    {
        var runFrame = 0;

        if (Manuel.large)
        {
            runFrame = (Math.floor (runTime / 20)) % 4;
            if (runFrame == 3) runFrame = 1;
            if (this.carried == null && Math.abs(this.xa) > 10) runFrame += 3;
            if (this.carried != null) runFrame += 10;
            if (!onGround)
            {
                if (carried != null) runFrame = 12;
                else if (Math.abs(this.xa) > 10) runFrame = 7;
                else runFrame = 6;
            }
        }
        else
        {
            runFrame = (Math.floor (runTime / 20)) % 2;
            if (this.carried == null && Math.abs(this.xa) > 10) runFrame += 2;
            if (this.carried != null) runFrame += 8;
            if (!onGround)
            {
                if (this.carried != null) runFrame = 9;
                else if (Math.abs(this.xa) > 10) runFrame = 5;
                else runFrame = 4;
            }
        }

        if (onGround && ((facing == -1 && xa > 0) || (facing == 1 && xa < 0)))
        {
            if (xa > 1 || xa < -1) runFrame = large ? 9 : 7;

            if (xa > 3 || xa < -3)
            {
                for (var i = 0; i < 3; i++)
                {
                    world.addSprite(new Sparkle((int) (x + Math.random() * 8 - 4), Math.floor (y + Math.random() * 4), (Math.random() * 2 - 1), Math.random() * -1, 0, 1, 5));
                }
            }
        }

        if (Manuel.large)
        {
            if (ducking) runFrame = 14;
            height = ducking ? 12 : 24;
        }
        else
        {
            height = 12;
        }

        xPic = runFrame;
    };    
    
    var blink=function(/*boolean*/ on)
    {
        
        this.large = on?newLarge:lastLarge;
        this.fire = on?newFire:lastFire;
        
        if (this.large)
        {
            this.sheet = Art.img[Art.manuel];
            if (this.fire)
                this.sheet = Art.img[Art.fireManuel];

            this.xPicO = 16;
            this.yPicO = 31;
            wPic = hPic = 32;
  
        }
        else
        {
            //alert(Art.img[Art.pequenoManuel]);
            this.sheet = Art.img[Art.pequenoManuel];

            this.xPicO = 8;
            this.yPicO = 15;
            wPic = hPic = 16;
        }

        calcPic();

    };    
    
    var setLarge=function(/*boolean*/ large, /*boolean*/ fire)
    {
        if (fire) large = true;
        if (!large) fire = false;
        
        lastLarge = Manuel.large;
        lastFire = Manuel.fire;
        
        Manuel.large = large;
        Manuel.fire = fire;

        newLarge = Manuel.large;
        newFire = Manuel.fire;
        
        blink(true);
    };    
    
    Manuel.instance = this;
    var world = _world;
    //keys = Scene.keys;
    x = 32;
    y = 0;

    facing = 1;
    setLarge(this.large,this.fire);    

    this.move=function()
    {
        if (winTime > 0)
        {
            winTime++;

            xa = 0;
            ya = 0;
            return;
        }

        if (deathTime > 0)
        {
            deathTime++;
            if (deathTime < 11)
            {
                xa = 0;
                ya = 0;
            }
            else if (deathTime == 11)
            {
                ya = -15;
            }
            else
            {
                ya += 2;
            }
            x += xa;
            y += ya;
            return;
        }

        if (powerUpTime != 0)
        {
            if (powerUpTime > 0)
            {
                powerUpTime--;
                blink(((powerUpTime / 3) & 1) == 0);
            }
            else
            {
                powerUpTime++;
                blink(((-powerUpTime / 3) & 1) == 0);
            }

            if (powerUpTime == 0) world.paused = false;

            calcPic();
            return;
        }

        if (invulnerableTime > 0) invulnerableTime--;
        visible = ((invulnerableTime / 2) & 1) == 0;

        wasOnGround = onGround;
        var sideWaysSpeed = keys[manuelC.KEY_RUN] ? 1.2 : 0.6;
        //        float sideWaysSpeed = onGround ? 2.5f : 1.2f;

        if (onGround)
        {
            if (keys[KEY_DOWN] && large)
            {
                ducking = true;
            }
            else
            {
                ducking = false;
            }
        }

        if (xa > 2)
        {
            facing = 1;
        }
        if (xa < -2)
        {
            facing = -1;
        }

        if (keys[manuelC.KEY_JUMP] || (jumpTime < 0 && !onGround && !sliding))
        {
            if (jumpTime < 0)
            {
                xa = xJumpSpeed;
                ya = -jumpTime * yJumpSpeed;
                jumpTime++;
            }
            else if (onGround && mayJump)
            {
                //world.sound.play(Art.samples[Art.SAMPLE_MARIO_JUMP], this, 1, 1, 1);
                xJumpSpeed = 0;
                yJumpSpeed = -1.9;
                jumpTime = 7;
                ya = jumpTime * yJumpSpeed;
                onGround = false;
                sliding = false;
            }
            else if (sliding && mayJump)
            {
                //world.sound.play(Art.samples[Art.SAMPLE_MARIO_JUMP], this, 1, 1, 1);
                xJumpSpeed = -facing * 6.0;
                yJumpSpeed = -2.0;
                jumpTime = -6;
                xa = xJumpSpeed;
                ya = -jumpTime * yJumpSpeed;
                onGround = false;
                sliding = false;
                facing = -facing;
            }
            else if (jumpTime > 0)
            {
                xa += xJumpSpeed;
                ya = jumpTime * yJumpSpeed;
                jumpTime--;
            }
        }
        else
        {
            jumpTime = 0;
        }

        if (keys[manuelC.KEY_LEFT] && !ducking)
        {
            if (facing == 1) sliding = false;
            xa -= sideWaysSpeed;
            if (jumpTime >= 0) facing = -1;
        }

        if (keys[manuelC.KEY_RIGHT] && !ducking)
        {
            if (facing == -1) sliding = false;
            xa += sideWaysSpeed;
            if (jumpTime >= 0) facing = 1;
        }

        if ((!keys[manuelC.KEY_LEFT] && !keys[manuelC.KEY_RIGHT]) || ducking || ya < 0 || onGround)
        {
            sliding = false;
        }
        
        if (keys[manuelC.KEY_RUN] && canShoot && Manuel.fire && world.fireballsOnScreen<2)
        {
            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_FIREBALL], this, 1, 1, 1);
            world.addSprite(new Fireball(world, x+facing*6, y-20, facing));
        }
        
        canShoot = !keys[manuelC.KEY_RUN];

        mayJump = (onGround || sliding) && !keys[manuelC.KEY_JUMP];

        xFlipPic = facing == -1;

        runTime += (Math.abs(xa)) + 5;
        if (Math.abs(xa) < 0.5)
        {
            runTime = 0;
            xa = 0;
        }

        calcPic();

        if (sliding)
        {
            for (var i = 0; i < 1; i++)
            {
                world.addSprite(new Sparkle((int) (x + Math.random() * 4 - 2) + facing * 8, (int) (y + Math.random() * 4) - 24, (float) (Math.random() * 2 - 1), Math.random() * 1, 0, 1, 5));
            }
            ya *= 0.5;
        }

        onGround = false;
        move(xa, 0);
        move(0, ya);

        if (y > world.level.height * 16 + 16)
        {
            die();
        }

        if (x < 0)
        {
            x = 0;
            xa = 0;
        }

        if (x > world.level.xExit * 16)
        {
            win();
        }

        if (x > world.level.width * 16)
        {
            x = world.level.width * 16;
            xa = 0;
        }

        ya *= 0.85;
        if (onGround)
        {
            xa *= GROUND_INERTIA;
        }
        else
        {
            xa *= AIR_INERTIA;
        }

        if (!onGround)
        {
            ya += 3;
        }

        if (carried != null)
        {
            carried.x = x + facing * 8;
            carried.y = y - 2;
            if (!keys[manuelC.KEY_RUN])
            {
                carried.release(this);
                carried = null;
            }
        }
    };

    var move=function(/*float*/ xa, /*float*/ ya) //boolean
    {
        while (xa > 8)
        {
            if (!move(8, 0)) return false;
            xa -= 8;
        }
        while (xa < -8)
        {
            if (!move(-8, 0)) return false;
            xa += 8;
        }
        while (ya > 8)
        {
            if (!move(0, 8)) return false;
            ya -= 8;
        }
        while (ya < -8)
        {
            if (!move(0, -8)) return false;
            ya += 8;
        }

        var collide = false;
        if (ya > 0)
        {
            if (isBlocking(x + xa - width, y + ya, xa, 0)) collide = true;
            else if (isBlocking(x + xa + width, y + ya, xa, 0)) collide = true;
            else if (isBlocking(x + xa - width, y + ya + 1, xa, ya)) collide = true;
            else if (isBlocking(x + xa + width, y + ya + 1, xa, ya)) collide = true;
        }
        if (ya < 0)
        {
            if (isBlocking(x + xa, y + ya - height, xa, ya)) collide = true;
            else if (collide || isBlocking(x + xa - width, y + ya - height, xa, ya)) collide = true;
            else if (collide || isBlocking(x + xa + width, y + ya - height, xa, ya)) collide = true;
        }
        if (xa > 0)
        {
            sliding = true;
            if (isBlocking(x + xa + width, y + ya - height, xa, ya)) collide = true;
            else sliding = false;
            if (isBlocking(x + xa + width, y + ya - height / 2, xa, ya)) collide = true;
            else sliding = false;
            if (isBlocking(x + xa + width, y + ya, xa, ya)) collide = true;
            else sliding = false;
        }
        if (xa < 0)
        {
            sliding = true;
            if (isBlocking(x + xa - width, y + ya - height, xa, ya)) collide = true;
            else sliding = false;
            if (isBlocking(x + xa - width, y + ya - height / 2, xa, ya)) collide = true;
            else sliding = false;
            if (isBlocking(x + xa - width, y + ya, xa, ya)) collide = true;
            else sliding = false;
        }

        if (collide)
        {
            if (xa < 0)
            {
                x = (int) ((x - width) / 16) * 16 + width;
                this.xa = 0;
            }
            if (xa > 0)
            {
                x = (int) ((x + width) / 16 + 1) * 16 - width - 1;
                this.xa = 0;
            }
            if (ya < 0)
            {
                y = (int) ((y - height) / 16) * 16 + height;
                jumpTime = 0;
                this.ya = 0;
            }
            if (ya > 0)
            {
                y = (int) ((y - 1) / 16 + 1) * 16 - 1;
                onGround = true;
            }
            return false;
        }
        else
        {
            x += xa;
            y += ya;
            return true;
        }
    };

    var isBlocking=function(/*float*/ _x, /*float*/ _y, /*float*/ xa, /*float*/ ya) //boolean
    {
        var x = Math.floor (_x / 16);
        var y = Math.floor (_y / 16);
        if (x == Math.floor (this.x / 16) && y == Math.floor (this.y / 16)) return false;

        var blocking = world.level.isBlocking(x, y, xa, ya);

        var block = world.level.getBlock(x, y);

        if (((Level.TILE_BEHAVIORS[block & 0xff]) & Level.BIT_PICKUPABLE) > 0)
        {
            Manuel.getCoin();
            world.sound.play(Art.samples[Art.SAMPLE_GET_COIN], new FixedSoundSource(x * 16 + 8, y * 16 + 8), 1, 1, 1);
            world.level.setBlock(x, y, 0);
            for (var xx = 0; xx < 2; xx++)
                for (var yy = 0; yy < 2; yy++)
                    world.addSprite(new Sparkle(x * 16 + xx * 8 +  Math.floor(Math.random() * 8), y * 16 + yy * 8 + Math.floor (Math.random() * 8), 0, 0, 0, 2, 5));
        }

        if (blocking && ya < 0)
        {
            world.bump(x, y, large);
        }

        return blocking;
    };

    this.stomp=function(/*Enemy*/ enemy)
    {
        if (deathTime > 0 || world.paused) return;

        var targetY = enemy.y - enemy.height / 2;
        move(0, targetY - y);

        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_KICK], this, 1, 1, 1);
        xJumpSpeed = 0;
        yJumpSpeed = -1.9;
        jumpTime = 8;
        ya = jumpTime * yJumpSpeed;
        onGround = false;
        sliding = false;
        invulnerableTime = 1;
    };

    this.stomp=function(/*Shell*/ shell)
    {
        if (deathTime > 0 || world.paused) return;

        if (keys[manuelC.KEY_RUN] && shell.facing == 0)
        {
            carried = shell;
            shell.carried = true;
        }
        else
        {
            var targetY = shell.y - shell.height / 2;
            move(0, targetY - y);

            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_KICK], this, 1, 1, 1);
            xJumpSpeed = 0;
            yJumpSpeed = -1.9;
            jumpTime = 8;
            ya = jumpTime * yJumpSpeed;
            onGround = false;
            sliding = false;
            invulnerableTime = 1;
        }
    };

    this.getHurt=function()
    {
        if (deathTime > 0 || world.paused) return;
        if (invulnerableTime > 0) return;

        if (large)
        {
            world.paused = true;
            powerUpTime = -3 * 6;
            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_POWER_DOWN], this, 1, 1, 1);
            if (fire)
            {
                world.manuel.setLarge(true, false);
            }
            else
            {
                world.manuel.setLarge(false, false);
            }
            invulnerableTime = 32;
        }
        else
        {
            die();
        }
    };

    var win=function()
    {
        xDeathPos = Math.floor( x);
        yDeathPos = Math.floor( y);
        world.paused = true;
        winTime = 1;
        //Art.stopMusic();
        //world.sound.play(Art.samples[Art.SAMPLE_LEVEL_EXIT], this, 1, 1, 1);
    };

    this.die=function()
    {
        xDeathPos = Math.floor( x);
        yDeathPos = Math.floor(y);
        world.paused = true;
        deathTime = 1;
        //Art.stopMusic();
        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_DEATH], this, 1, 1, 1);
    };


    this.getFlower=function()
    {
        if (deathTime > 0 || world.paused) return;

        if (!fire)
        {
            world.paused = true;
            powerUpTime = 3 * 6;
            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_POWER_UP], this, 1, 1, 1);
            world.manuel.setLarge(true, true);
        }
        else
        {
            Manuel.getCoin();
            //world.sound.play(Art.samples[Art.SAMPLE_GET_COIN], this, 1, 1, 1);
        }
    };

    this.getMushroom=function()
    {
        if (deathTime > 0 || world.paused) return;

        if (!large)
        {
            world.paused = true;
            powerUpTime = 3 * 6;
            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_POWER_UP], this, 1, 1, 1);
            world.manuel.setLarge(true, false);
        }
        else
        {
            Manuel.getCoin();
            //world.sound.play(Art.samples[Art.SAMPLE_GET_COIN], this, 1, 1, 1);
        }
    };

    this.kick=function(/*Shell*/ shell)
    {
        if (deathTime > 0 || world.paused) return;

        if (keys[manuelC.KEY_RUN])
        {
            carried = shell;
            shell.carried = true;
        }
        else
        {
            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_KICK], this, 1, 1, 1);
            invulnerableTime = 1;
        }
    };

    this.stomp=function(/*BulletBill*/ bill)
    {
        if (deathTime > 0 || world.paused) return;

        var targetY = bill.y - bill.height / 2;
        move(0, targetY - y);

        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_KICK], this, 1, 1, 1);
        xJumpSpeed = 0;
        yJumpSpeed = -1.9;
        jumpTime = 8;
        ya = jumpTime * yJumpSpeed;
        onGround = false;
        sliding = false;
        invulnerableTime = 1;
    };

    this.getKeyMask=function() //byte
    {
        var mask = 0;
        for (var i = 0; i < 7; i++)
        {
            if (keys[i]) mask |= (1 << i);
        }
        return  mask;
    };

    this.setKeys=function(/*byte*/ mask)
    {
        for (var i = 0; i < 7; i++)
        {
            keys[i] = (mask & (1 << i)) > 0;
        }
    };

    this.get1Up=function()
    {
        //instance.world.sound.play(Art.samples[Art.SAMPLE_MARIO_1UP], instance, 1, 1, 1);
        lives++;
        if (lives==99)
        {
            lives = 99;
        }
    };
    
    this.getCoin=function()
    {
        coins++;
        if (coins==100)
        {
            coins = 0;
            get1Up();
        }
    };
    
    this.render=function(/*Graphics*/ og, /*float*/ alpha)
    {
        if (!this.visible) return;
        
        var xPixel = Math.floor((this.xOld+(this.x-this.xOld)*alpha)-this.xPicO);
        var yPixel = Math.floor((this.yOld+(this.y-this.yOld)*alpha)-this.yPicO);
        //og.drawImage(sheet[xPic][yPic], xPixel+(xFlipPic?wPic:0), yPixel+(yFlipPic?hPic:0), xFlipPic?-wPic:wPic, yFlipPic?-hPic:hPic, null);
        og.drawImage(this.sheet[this.xPic][this.yPic],0,0,sheet[this.xPic][this.yPic].width,sheet[this.xPic][this.yPic].height,xPixel+(this.xFlipPic?this.wPic:0), yPixel+(this.yFlipPic?this.hPic:0), this.xFlipPic?-this.wPic:this.wPic, this.yFlipPic?-this.hPic:this.hPic,this.sheet[this.xPic][this.yPic].width,this.sheet[this.xPic][this.yPic].height);

    };    
    
    this.tick=function()
    {
        this.xOld = this.x;
        this.yOld = this.y;
        this.move();
    };

    this.tickNoMove=function()
    {
        this.xOld = this.x;
        this.yOld = this.y;
    };

    this.getX=function(/*float*/ alpha)
    {
        return (xOld+(x-xOld)*alpha)-xPicO;
    };

    this.getY=function(/*float*/ alpha)
    {
        return (yOld+(y-yOld)*alpha)-yPicO;
    };

    this.collideCheck=function()
    {
    };

    this.bumpCheck=function(/*int*/ xTile, /*int*/ yTile)
    {
    };

    this.shellCollideCheck=function(/*Shell*/ shell) //boolean
    {
        return false;
    };

    this.release=function(/*Manuel*/ manuel)
    {
    };

    this.fireballCollideCheck=function(/*Fireball*/ fireball) //boolean
    {
        return false;
    };    
    
    this.move=function()
    {
        this.x+=this.xa;
        this.y+=this.ya;
    };    
}