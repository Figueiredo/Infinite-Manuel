function SpriteTemplate(_type, _winged)
{
    this.lastVisibleTick = -1; //int
    this.sprite = null; //sprite
    this.isDead = false; //boolean
    this.winged = _winged; //boolean
    this.type = _type; //int
} 

SpriteTemplate.prototype.spawn = function( /*LevelScene*/ world, /*int*/ x, /*int*/ y, /*int*/ dir) //void
{
    if (this.isDead) return;
    if (this.type == Enemy.ENEMY_FLOWER)
    {
        this.sprite = new FlowerEnemy(world, x * 16 + 15, y * 16 + 24);
    }
    else
    {
        this.sprite = new Enemy(world, x * 16 + 8, y * 16 + 15, dir, this.type, this.winged);
    }
    this.sprite.spriteTemplate = this;
    world.addSprite(this.sprite);
};