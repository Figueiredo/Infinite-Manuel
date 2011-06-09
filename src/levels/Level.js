function Level(w,h)
{  
    this.width=w;
    this.height=h;

    this.map=[w];
    for(var iterator=0;iterator<w;iterator++) 
    {
        this.map[iterator]=[h];
    }
    
    this.data=[w];
    for(var iterator=0;iterator<w;iterator++) 
    {
        this.data[iterator]=[h];
    }

    //SpriteTemplate[][]
    this.spriteTemplates=[w];
    for(var iterator=0;iterator<w;iterator++)
    {
        this.spriteTemplates[iterator]=[h];
    }

    this.xExit=10;
    this.yExit=10;    
}

/**
 * 
 */
Level.prototype.BIT_DESCRIPTIONS = [
            "BLOCK UPPER", 
            "BLOCK ALL", 
            "BLOCK LOWER", 
            "SPECIAL", 
            "BUMPABLE",
            "BREAKABLE",
            "PICKUPABLE",
            "ANIMATED"
];

Level.prototype.TILE_BEHAVIORS = [];// new Array(256);

Level.prototype.BIT_BLOCK_UPPER = 1 << 0;
Level.prototype.BIT_BLOCK_ALL = 1 << 1;
Level.prototype.BIT_BLOCK_LOWER = 1 << 2;
Level.prototype.BIT_SPECIAL = 1 << 3;
Level.prototype.BIT_BUMPABLE = 1 << 4;
Level.prototype.BIT_BREAKABLE = 1 << 5;
Level.prototype.BIT_PICKUPABLE = 1 << 6;
Level.prototype.BIT_ANIMATED = 1 << 7;

/*  
public static void loadBehaviors(DataInputStream dis) throws IOException
{
    dis.readFully(Level.TILE_BEHAVIORS);
}

public static void saveBehaviors(DataOutputStream dos) throws IOException
{
    dos.write(Level.TILE_BEHAVIORS);
}

public static Level load(DataInputStream dis) throws IOException
{
    long header = dis.readLong();
    if (header != Level.FILE_HEADER) throw new IOException("Bad level header");
    int version = dis.read() & 0xff;

    int width = dis.readShort() & 0xffff;
    int height = dis.readShort() & 0xffff;
    Level level = new Level(width, height);
    level.map = new byte[width][height];
    level.data = new byte[width][height];
    for (int i = 0; i < width; i++)
    {
        dis.readFully(level.map[i]);
        dis.readFully(level.data[i]);
    }
    return level;
}

public void save(DataOutputStream dos) throws IOException
{
    dos.writeLong(Level.FILE_HEADER);
    dos.write((byte) 0);

    dos.writeShort((short) width);
    dos.writeShort((short) height);

    for (int i = 0; i < width; i++)
    {
        dos.write(map[i]);
        dos.write(data[i]);
    }
}
*/

/**
 * 
 */
Level.prototype.update=function()
{
    for (var x = 0; x < this.width; x++)
    {
        for (var y = 0; y < this.height; y++)
        {
            if (this.data[x][y] > 0) this.data[x][y]--;
        }
    }
};

/**
 * 
 */
Level.prototype.getBlockCapped=function(x,y)
{
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= this.width) x = this.width - 1;
    if (y >= this.height) y = this.height - 1;
    return this.map[x][y];
};

/**
 * 
 */
Level.prototype.getBlock=function(x,y)
{
    x=Math.floor(x);
    y=Math.floor(y);
    if (x < 0) x = 0;
    if (y < 0) return 0;
    if (x >= this.width) x = this.width - 1;
    if (y >= this.height) y = this.height - 1;
    return this.map[x][y];
};

/**
 * 
 */
Level.prototype.setBlock=function(x, y, b)
{
    if (x < 0) return;
    if (y < 0) return;
    if (x >= this.width) return;
    if (y >= this.height) return;
    this.map[x][y] = b;
};

/**
 * 
 */
Level.prototype.setBlockData=function(x, y, b)
{
    if (x < 0) return;
    if (y < 0) return;
    if (x >= this.width) return;
    if (y >= this.height) return;
    this.data[x][y] = b;
};

/**
 * 
 */
Level.prototype.isBlocking=function(x, y, xa, ya)
{
    var block = getBlock(x, y);
    var blocking = ((this.TILE_BEHAVIORS[block & 0xff]) & this.BIT_BLOCK_ALL) > 0;
    blocking |= (ya > 0) && ((this.TILE_BEHAVIORS[block & 0xff]) & this.BIT_BLOCK_UPPER) > 0;
    blocking |= (ya < 0) && ((this.TILE_BEHAVIORS[block & 0xff]) & this.BIT_BLOCK_LOWER) > 0;

    return blocking;
};

/**
 * 
 */
Level.prototype.getSpriteTemplate=function(x, y)
{
    if (x < 0) return null;
    if (y < 0) return null;
    if (x >= this.width) return null;
    if (y >= this.height) return null;
    return this.spriteTemplates[x][y];
};

/**
 * 
 */
Level.prototype.setSpriteTemplate=function(x, y, spriteTemplate)
{
    if (x < 0) return;
    if (y < 0) return;
    if (x >= this.width) return;
    if (y >= this.height) return;
    this.spriteTemplates[x][y] = spriteTemplate;
};   
