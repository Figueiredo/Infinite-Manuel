/**
 * 
 */
function cManuel() /*extends Sprite*/
{
    this.large = false; //boolean
    this.fire = false; //boolean
    this.coins = 0; //int
    this.lives = 3; //int
    this.levelString = "none"; //string
    this.keys = [];
    this.runTime = 0.0; //float
    this.wasOnGround = false; //boolean
    this.onGround = false;
    this.mayJump = false;
    this.ducking = false;
    this.sliding = false;
    this.jumpTime = 0; //int
    this.xJumpSpeed = 0.0; //float
    this.yJumpSpeed = 0.0; //float
    this.canShoot = false;

    this.width = 4; //int
    this.height = 24; //int
    this.facing = 0;
    this.powerUpTime = 0;

    this.xDeathPos = 0;
    this.yDeathPos = 0;

    this.deathTime = 0;
    this.winTime = 0;
    this.invulnerableTime = 0;

    this.carried = null; //Sprite
    this.lastLarge = false; //boolean
    this.lastFire = false;
    this.newLarge = false;
    this.newFire = false;

    this.x = 32;
    this.y = 0;

    this.facing = 1;
}

/**
 * 
 */
cManuel.prototype = new Sprite();

/**
 * 
 */
cManuel.prototype.init = function()
{
    //this.sheet = Art.pequenoManuel; //image[][]    
    this.setLarge(false, false);
};

/**
 * 
 */
cManuel.prototype.setWorld = function(_world)
{
    this.world = _world;
};

/**
 * 
 */
cManuel.prototype.GROUND_INERTIA = 0.89;

/**
 * 
 */
cManuel.prototype.AIR_INERTIA = 0.89;

/**
 * 
 */
cManuel.prototype.reset = function()
{
    this.large = false;
    this.fire = false;
    this.coins = 0;
    this.lives = 3;
    this.levelString = "none";
};

cManuel.prototype.KEY_LEFT = 0;
cManuel.prototype.KEY_RIGHT = 1;
cManuel.prototype.KEY_UP = 2;
cManuel.prototype.KEY_DOWN = 3;
cManuel.prototype.SPACE = 4;
cManuel.prototype.KEY_RUN = 5;
cManuel.prototype.KEY_JUMP = 6;
cManuel.prototype.SPEC = 7;

/**
 * 
 */
cManuel.prototype.calcPic = function()
{
    var runFrame = 0;

    if (this.large)
    {
        runFrame = (Math.floor(runTime / 20)) % 4;
        if (runFrame == 3) runFrame = 1;
        if (this.carried === null && Math.abs(this.xa) > 10) runFrame += 3;
        if (this.carried !== null) runFrame += 10;
        if (!this.onGround)
        {
            if (this.carried !== null) runFrame = 12;
            else if (Math.abs(this.xa) > 10) runFrame = 7;
            else runFrame = 6;
        }
    }
    else
    {
        runFrame = (Math.floor(this.runTime / 20)) % 2;
        if (this.carried === null && Math.abs(this.xa) > 10) runFrame += 2;
        if (this.carried !== null) runFrame += 8;
        if (!this.onGround)
        {
            if (this.carried !== null) runFrame = 9;
            else if (Math.abs(this.xa) > 10) runFrame = 5;
            else runFrame = 4;
        }
    }

    if (this.onGround && ((this.facing == -1 && this.xa > 0) || (this.facing == 1 && this.xa < 0)))
    {
        if (this.xa > 1 || this.xa < -1) runFrame = this.large ? 9 : 7;

        if (this.xa > 3 || this.xa < -3)
        {
            for (var i = 0; i < 3; i++)
            {
                //world.addSprite(new Sparkle((int) (x + Math.random() * 8 - 4), Math.floor (y + Math.random() * 4), (Math.random() * 2 - 1), Math.random() * -1, 0, 1, 5));
            }
        }
    }

    if (this.large)
    {
        if (this.ducking) runFrame = 14;
        this.height = this.ducking ? 12 : 24;
    }
    else
    {
        this.height = 12;
    }

    this.xPic = runFrame;
};

/**
 * 
 */
cManuel.prototype.blink = function( /*boolean*/ on)
{
    this.large = on ? this.newLarge : this.lastLarge;
    this.fire = on ? this.newFire : this.lastFire;

    if (this.large)
    {
        this.sheet = Art.manuel;
        if (this.fire) this.sheet = Art.fireManuel;

        this.xPicO = 16;
        this.yPicO = 31;
        this.wPic = this.hPic = 32;

    }
    else
    {
        this.sheet = Art.pequenoManuel;

        this.xPicO = 8;
        this.yPicO = 15;
        this.wPic = this.hPic = 16;
    }

    this.calcPic();
};

/**
 * 
 */
cManuel.prototype.setLarge = function( /*boolean*/ large, /*boolean*/ fire)
{
    if (fire) this.large = true;
    if (!large) this.fire = false;

    this.lastLarge = this.large;
    this.lastFire = this.fire;

    this.large = large;
    this.fire = fire;

    this.newLarge = this.large;
    this.newFire = this.fire;

    this.blink(true);
};

/**
 * 
 */
this.move = function()
{
    if (this.winTime > 0)
    {
        this.winTime++;

        this.xa = 0;
        this.ya = 0;
        return;
    }

    if (this.deathTime > 0)
    {
        this.deathTime++;
        if (this.deathTime < 11)
        {
            this.xa = 0;
            this.ya = 0;
        }
        else if (this.deathTime == 11)
        {
            this.ya = -15;
        }
        else
        {
            this.ya += 2;
        }
        this.x += this.xa;
        this.y += this.ya;
        return;
    }

    if (this.powerUpTime !== 0)
    {
        if (this.powerUpTime > 0)
        {
            this.powerUpTime--;
            this.blink(((this.powerUpTime / 3) & 1) === 0);
        }
        else
        {
            this.powerUpTime++;
            this.blink(((-this.powerUpTime / 3) & 1) === 0);
        }

        if (this.powerUpTime === 0) this.world.paused = false;

        this.calcPic();
        return;
    }

    if (this.invulnerableTime > 0) this.invulnerableTime--;
    this.visible = ((this.invulnerableTime / 2) & 1) === 0;

    this.wasOnGround = this.onGround;
    var keys = this.world.teclas;
    var sideWaysSpeed = keys[this.KEY_RUN] ? 1.2 : 0.6;
    //        float sideWaysSpeed = onGround ? 2.5f : 1.2f;
    if (this.onGround)
    {
        if (keys[this.KEY_DOWN] && this.large)
        {
            this.ducking = true;
        }
        else
        {
            this.ducking = false;
        }
    }

    if (this.xa > 2)
    {
        this.facing = 1;
    }
    if (this.xa < -2)
    {
        this.facing = -1;
    }

    if (keys[this.KEY_JUMP] || (this.jumpTime < 0 && !this.onGround && !this.sliding))
    {
        if (this.jumpTime < 0)
        {
            this.xa = this.xJumpSpeed;
            this.ya = -this.jumpTime * this.yJumpSpeed;
            this.jumpTime++;
        }
        else if (this.onGround && this.mayJump)
        {
            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_JUMP], this, 1, 1, 1);
            this.xJumpSpeed = 0;
            this.yJumpSpeed = -1.9;
            this.jumpTime = 7;
            this.ya = this.jumpTime * this.yJumpSpeed;
            this.onGround = false;
            this.sliding = false;
        }
        else if (this.sliding && this.mayJump)
        {
            //world.sound.play(Art.samples[Art.SAMPLE_MARIO_JUMP], this, 1, 1, 1);
            this.xJumpSpeed = -this.facing * 6.0;
            this.yJumpSpeed = -2.0;
            this.jumpTime = -6;
            this.xa = this.xJumpSpeed;
            this.ya = -this.jumpTime * this.yJumpSpeed;
            this.onGround = false;
            this.sliding = false;
            this.facing = -this.facing;
        }
        else if (this.jumpTime > 0)
        {
            this.xa += this.xJumpSpeed;
            this.ya = this.jumpTime * this.yJumpSpeed;
            this.jumpTime--;
        }
    }
    else
    {
        this.jumpTime = 0;
    }

    if (keys[this.KEY_LEFT] && !this.ducking)
    {
        if (this.facing == 1) this.sliding = false;
        this.xa -= this.sideWaysSpeed;
        if (this.jumpTime >= 0) this.facing = -1;
    }

    if (keys[this.KEY_RIGHT] && !this.ducking)
    {
        if (this.facing == -1) this.sliding = false;
        this.xa += this.sideWaysSpeed;
        if (this.jumpTime >= 0) this.facing = 1;
    }

    if ((!keys[this.KEY_LEFT] && !keys[this.KEY_RIGHT]) || this.ducking || this.ya < 0 || this.onGround)
    {
        this.sliding = false;
    }

    if (keys[this.KEY_RUN] && this.canShoot && this.fire && this.world.fireballsOnScreen < 2)
    {
        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_FIREBALL], this, 1, 1, 1);
        //this.world.addSprite(new Fireball(this.world, this.x+this.facing*6, this.y-20, this.facing));
    }

    this.canShoot = !keys[this.KEY_RUN];

    this.mayJump = (this.onGround || this.sliding) && !keys[this.KEY_JUMP];

    this.xFlipPic = this.facing == -1;

    this.runTime += (Math.abs(this.xa)) + 5;
    if (Math.abs(this.xa) < 0.5)
    {
        this.runTime = 0;
        this.xa = 0;
    }

    this.calcPic();

    if (this.sliding)
    {
        for (var i = 0; i < 1; i++)
        {
            //this.world.addSprite(new Sparkle((int) (x + Math.random() * 4 - 2) + facing * 8, (int) (y + Math.random() * 4) - 24, (float) (Math.random() * 2 - 1), Math.random() * 1, 0, 1, 5));
        }
        this.ya *= 0.5;
    }

    this.onGround = false;
    this.movexy(this.xa, 0);
    this.movexy(0, this.ya);

    if (this.y > this.world.level.height * 16 + 16)
    {
        this.die();
    }

    if (this.x < 0)
    {
        this.x = 0;
        this.xa = 0;
    }

    if (this.x > this.world.level.xExit * 16)
    {
        this.win();
    }

    if (this.x > this.world.level.width * 16)
    {
        this.x = this.world.level.width * 16;
        this.xa = 0;
    }

    this.ya *= 0.85;
    if (this.onGround)
    {
        this.xa *= this.GROUND_INERTIA;
    }
    else
    {
        this.xa *= this.AIR_INERTIA;
    }

    if (!this.onGround)
    {
        this.ya += 3;
    }

    if (this.carried !== null)
    {
        this.carried.x = this.x + this.facing * 8;
        this.carried.y = this.y - 2;
        if (!keys[this.KEY_RUN])
        {
            this.carried.release(this);
            this.carried = null;
        }
    }
};

/**
 * 
 */
cManuel.prototype.movexy = function( /*float*/ _xa, /*float*/ _ya) //boolean
{
    while (_xa > 8)
    {
        if (!this.move(8, 0)) return false;
        _xa -= 8;
    }
    while (_xa < -8)
    {
        if (!this.move(-8, 0)) return false;
        _xa += 8;
    }
    while (_ya > 8)
    {
        if (!this.move(0, 8)) return false;
        _ya -= 8;
    }
    while (_ya < -8)
    {
        if (!this.move(0, -8)) return false;
        _ya += 8;
    }

    var collide = false;
    if (_ya > 0)
    {
        if (this.isBlocking(this.x + _xa - this.width, y + _ya, _xa, 0)) collide = true;
        else if (this.isBlocking(this.x + _xa + this.width, y + _ya, _xa, 0)) collide = true;
        else if (this.isBlocking(this.x + _xa - this.width, y + _ya + 1, _xa, _ya)) collide = true;
        else if (this.isBlocking(this.x + _xa + this.width, y + _ya + 1, _xa, _ya)) collide = true;
    }
    if (_ya < 0)
    {
        if (this.isBlocking(this.x + _xa, this.y + _ya - this.height, _xa, _ya)) collide = true;
        else if (collide || this.isBlocking(this.x + _xa - this.width, this.y + _ya - this.height, _xa, _ya)) collide = true;
        else if (collide || this.isBlocking(this.x + _xa + this.width, this.y + _ya - this.height, _xa, _ya)) collide = true;
    }
    if (_xa > 0)
    {
        this.sliding = true;
        if (this.isBlocking(this.x + _xa + this.width, this.y + _ya - this.height, _xa, _ya)) collide = true;
        else this.sliding = false;
        if (this.isBlocking(this.x + _xa + this.width, this.y + _ya - this.height / 2, _xa, _ya)) collide = true;
        else this.sliding = false;
        if (this.isBlocking(this.x + _xa + this.width, this.y + _ya, _xa, _ya)) collide = true;
        else this.sliding = false;
    }
    if (_xa < 0)
    {
        this.sliding = true;
        if (this.isBlocking(this.x + _xa - this.width, this.y + _ya - this.height, _xa, _ya)) collide = true;
        else this.sliding = false;
        if (this.isBlocking(this.x + _xa - this.width, this.y + _ya - this.height / 2, _xa, _ya)) collide = true;
        else this.sliding = false;
        if (this.isBlocking(this.x + _xa - this.width, this.y + _ya, _xa, _ya)) collide = true;
        else this.sliding = false;
    }

    if (collide)
    {
        if (_xa < 0)
        {
            this.x = Math.floor((this.x - this.width) / 16) * 16 + this.width;
            this.xa = 0;
        }
        if (_xa > 0)
        {
            this.x = Math.floor((this.x + this.width) / 16 + 1) * 16 - this.width - 1;
            this.xa = 0;
        }
        if (_ya < 0)
        {
            this.y = Math.floor((this.y - this.height) / 16) * 16 + this.height;
            this.jumpTime = 0;
            this.ya = 0;
        }
        if (_ya > 0)
        {
            this.y = Math.floor((this.y - 1) / 16 + 1) * 16 - 1;
            this.onGround = true;
        }
        return false;
    }
    else
    {
        this.x += _xa;
        this.y += _ya;
        return true;
    }
};

/**
 * 
 */
cManuel.prototype.isBlocking = function( /*float*/ _x, /*float*/ _y, /*float*/ xa, /*float*/ ya) //boolean
{
    var x = Math.floor(_x / 16);
    var y = Math.floor(_y / 16);
    if (x == Math.floor(this.x / 16) && y == Math.floor(this.y / 16)) return false;

    var blocking = this.world.level.isBlocking(x, y, xa, ya);

    var block = this.world.level.getBlock(x, y);

/*   if (((Level.TILE_BEHAVIORS[block & 0xff]) & Level.BIT_PICKUPABLE) > 0)
    {
        Manuel.getCoin();
        world.sound.play(Art.samples[Art.SAMPLE_GET_COIN], new FixedSoundSource(x * 16 + 8, y * 16 + 8), 1, 1, 1);
        world.level.setBlock(x, y, 0);
        for (var xx = 0; xx < 2; xx++)
            for (var yy = 0; yy < 2; yy++)
                world.addSprite(new Sparkle(x * 16 + xx * 8 +  Math.floor(Math.random() * 8), y * 16 + yy * 8 + Math.floor (Math.random() * 8), 0, 0, 0, 2, 5));
    }
*/
    if (blocking && ya < 0)
    {
        this.world.bump(x, y, this.large);
    }

    return blocking;
};

/**
 * 
 */
cManuel.prototype.stomp = function( /*Enemy*/ enemy)
{
    if (deathTime > 0 || world.paused) return;

    var keys = this.world.teclas;

    if (enemy instanceof Shell && keys[this.KEY_RUN] && enemy.facing === 0)
    {
        this.carried = enemy;
        enemy.carried = true;
    }
    else
    {
        var targetY = enemy.y - enemy.height / 2;
        this.movexy(0, targetY - this.y);

        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_KICK], this, 1, 1, 1);
        this.xJumpSpeed = 0;
        this.yJumpSpeed = -1.9;
        this.jumpTime = 8;
        this.ya = this.jumpTime * this.yJumpSpeed;
        this.onGround = false;
        this.sliding = false;
        this.invulnerableTime = 1;
    }
};

/**
 * 
 */
cManuel.prototype.getHurt = function()
{
    if (this.deathTime > 0 || this.world.paused) return;
    if (this.invulnerableTime > 0) return;

    if (this.large)
    {
        this.world.paused = true;
        this.powerUpTime = -3 * 6;
        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_POWER_DOWN], this, 1, 1, 1);
        if (this.fire)
        {
            this.world.manuel.setLarge(true, false);
        }
        else
        {
            this.world.manuel.setLarge(false, false);
        }
        this.invulnerableTime = 32;
    }
    else
    {
        this.die();
    }
};

/**
 * 
 */
cManuel.prototype.win = function()
{
    this.xDeathPos = Math.floor(this.x);
    this.yDeathPos = Math.floor(this.y);
    this.world.paused = true;
    this.winTime = 1;
    //Art.stopMusic();
    //world.sound.play(Art.samples[Art.SAMPLE_LEVEL_EXIT], this, 1, 1, 1);
};

/**
 * 
 */
cManuel.prototype.die = function()
{
    this.xDeathPos = Math.floor(this.x);
    this.yDeathPos = Math.floor(this.y);
    this.world.paused = true;
    this.deathTime = 1;
    //Art.stopMusic();
    //world.sound.play(Art.samples[Art.SAMPLE_MARIO_DEATH], this, 1, 1, 1);
};

/**
 * 
 */
cManuel.prototype.getFlower = function()
{
    if (this.deathTime > 0 || this.world.paused) return;

    if (!this.fire)
    {
        this.world.paused = true;
        this.powerUpTime = 3 * 6;
        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_POWER_UP], this, 1, 1, 1);
        this.world.manuel.setLarge(true, true);
    }
    else
    {
        this.getCoin();
        //world.sound.play(Art.samples[Art.SAMPLE_GET_COIN], this, 1, 1, 1);
    }
};

/**
 * 
 */
cManuel.prototype.getMushroom = function()
{
    if (this.deathTime > 0 || this.world.paused) return;

    if (!this.large)
    {
        this.world.paused = true;
        this.powerUpTime = 3 * 6;
        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_POWER_UP], this, 1, 1, 1);
        this.world.manuel.setLarge(true, false);
    }
    else
    {
        this.getCoin();
        //world.sound.play(Art.samples[Art.SAMPLE_GET_COIN], this, 1, 1, 1);
    }
};

/**
 * 
 */
cManuel.prototype.kick = function( /*Shell*/ shell)
{
    if (this.deathTime > 0 || this.world.paused) return;

    var keys = this.world.teclas;
    if (keys[this.KEY_RUN])
    {
        this.carried = shell;
        shell.carried = true;
    }
    else
    {
        //world.sound.play(Art.samples[Art.SAMPLE_MARIO_KICK], this, 1, 1, 1);
        this.invulnerableTime = 1;
    }
};

/**
 * 
 */
cManuel.prototype.getKeyMask = function() //byte
{
    var mask = 0;
    var keys = this.world.teclas;
    for (var i = 0; i < 7; i++)
    {
        if (keys[i]) mask |= (1 << i);
    }
    return mask;
};

/**
 * 
 */
cManuel.prototype.setKeys = function( /*byte*/ mask)
{
/*
    for (var i = 0; i < 7; i++)
    {
        keys[i] = (mask & (1 << i)) > 0;
    }
    */
};

/**
 * 
 */
cManuel.prototype.get1Up = function()
{
    //instance.world.sound.play(Art.samples[Art.SAMPLE_MARIO_1UP], instance, 1, 1, 1);
    this.lives++;
    if (this.lives == 99)
    {
        this.lives = 99;
    }
};

/**
 * 
 */
cManuel.prototype.getCoin = function()
{
    this.coins++;
    if (this.coins == 100)
    {
        this.coins = 0;
        this.get1Up();
    }
};

var Manuel = new cManuel();