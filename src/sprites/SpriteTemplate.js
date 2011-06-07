function  SpriteTemplate(_type,_winged)
{
    this.lastVisibleTick = -1; //int
    this.sprite=null; //sprite
    this.isDead = false; //boolean
    var winged=_winged; //boolean
    
    var type=_type; //int
    
    
    this.spawn=function(/*LevelScene*/ world, /*int*/ x, /*int*/ y, /*int*/ dir) //void
    {
        if (isDead) return;

        if (type==Enemy.ENEMY_FLOWER)
        {
            sprite = new FlowerEnemy(world, x*16+15, y*16+24);
        }
        else
        {
            sprite = new Enemy(world, x*16+8, y*16+15, dir, type, winged);
        }
        sprite.spriteTemplate = this;
        world.addSprite(sprite);
    };
}