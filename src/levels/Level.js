function Level(w,h)
{
    //string[]
    var BIT_DESCRIPTIONS = [//
            "BLOCK UPPER", //
            "BLOCK ALL", //
            "BLOCK LOWER", //
            "SPECIAL", //
            "BUMPABLE", //
            "BREAKABLE", //
            "PICKUPABLE", //
            "ANIMATED"//
    ];

    //byte[]
    var TILE_BEHAVIORS = [];// new Array(256);

    var BIT_BLOCK_UPPER = 1 << 0;
    var BIT_BLOCK_ALL = 1 << 1;
    var BIT_BLOCK_LOWER = 1 << 2;
    var BIT_SPECIAL = 1 << 3;
    var BIT_BUMPABLE = 1 << 4;
    var BIT_BREAKABLE = 1 << 5;
    var BIT_PICKUPABLE = 1 << 6;
    var BIT_ANIMATED = 1 << 7;

//contrutor--------------------------------------------
    this.width=w;
    this.height=h;

    //ambos byte[][]
    var map=[w];
    for(var iterator=0;iterator<w;iterator++) map[iterator]=[h];
    var data=[w];
    for(var iterator=0;iterator<w;iterator++) data[iterator]=[h];

    //SpriteTemplate[][]
    var spriteTemplates=[w];
    for(var iterator=0;iterator<w;iterator++) spriteTemplates[iterator]=[h];

    this.xExit=10;
    this.yExit=10;
    
//fim de contrutor-------------------------------------

  /*  public static void loadBehaviors(DataInputStream dis) throws IOException
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
    this.update=function()
    {
        for (var x = 0; x < this.width; x++)
        {
            for (var y = 0; y < this.height; y++)
            {
                if (data[x][y] > 0) data[x][y]--;
            }
        }
    };

    //public byte getBlockCapped(int x, int y)
    this.getBlockCapped=function(x,y)
    {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x >= this.width) x = this.width - 1;
        if (y >= this.height) y = this.height - 1;
        return map[x][y];
    };

    //public byte getBlock(int x, int y)
    this.getBlock=function(x,y)
    {
        x=Math.floor(x);
        y=Math.floor(y);
        if (x < 0) x = 0;
        if (y < 0) return 0;
        if (x >= this.width) x = this.width - 1;
        if (y >= this.height) y = this.height - 1;
        return map[x][y];
    };

    //public void setBlock(int x, int y, byte b)
    this.setBlock=function(x, y, b)
    {
        if (x < 0) return;
        if (y < 0) return;
        if (x >= this.width) return;
        if (y >= this.height) return;
        map[x][y] = b;
    };

    //public void setBlockData(int x, int y, byte b)
    this.setBlockData=function(x, y, b)
    {
        if (x < 0) return;
        if (y < 0) return;
        if (x >= this.width) return;
        if (y >= this.height) return;
        data[x][y] = b;
    };

    //public boolean isBlocking(int x, int y, float xa, float ya)
    this.isBlocking=function(x, y, xa, ya)
    {
        var block = getBlock(x, y);
        var blocking = ((this.TILE_BEHAVIORS[block & 0xff]) & this.BIT_BLOCK_ALL) > 0;
        blocking |= (ya > 0) && ((this.TILE_BEHAVIORS[block & 0xff]) & this.BIT_BLOCK_UPPER) > 0;
        blocking |= (ya < 0) && ((this.TILE_BEHAVIORS[block & 0xff]) & this.BIT_BLOCK_LOWER) > 0;

        return blocking;
    };

    //public SpriteTemplate getSpriteTemplate(int x, int y)
    this.getSpriteTemplate=function(x, y)
    {
        if (x < 0) return null;
        if (y < 0) return null;
        if (x >= this.width) return null;
        if (y >= this.height) return null;
        return this.spriteTemplates[x][y];
    };

    //public void setSpriteTemplate(int x, int y, SpriteTemplate spriteTemplate)
    this.setSpriteTemplate=function(x, y, spriteTemplate)
    {
        if (x < 0) return;
        if (y < 0) return;
        if (x >= this.width) return;
        if (y >= this.height) return;
        this.spriteTemplates[x][y] = spriteTemplate;
    };   
}