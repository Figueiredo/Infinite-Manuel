/**
 * 
 */
function MapScene(compJogo)
{
    this.level = []; //[][]
    this.data = []; //[][]
    this.xManuel = 0;
    this.yManuel = 0;
    this.xManuelA = 0;
    this.yManuelA = 0;

    this.moveTime = 0;
    this.worldNumber = -1; //número do mundo
    this.levelId = 0;
    this.farthest = 0;
    this.xFarthestCap = 0;
    this.yFarthestCap = 0;
    this.canEnterLevel = false;

    this.jogo = compJogo;

    this.staticBg = document.createElement("canvas");
    this.staticBg.width = 320;
    this.staticBg.height = 240;
    this.staticGr = this.staticBg.getContext("2d");
}

MapScene.prototype = new Scene();

MapScene.prototype.TILE_GRASS = 0;
MapScene.prototype.TILE_WATER = 1;
MapScene.prototype.TILE_LEVEL = 2;
MapScene.prototype.TILE_ROAD = 3;
MapScene.prototype.TILE_DECORATION = 4;

/**
 * inicializa a cena
 */
MapScene.prototype.init = function()
{
    //começa no mundo -1
    this.worldNumber = -1;
    this.nextWorld(); //gera o próximo mundo (o mundo 1 é o zero)        
};

/**
 * 
 */
MapScene.prototype.isRoad = function(x, y)
{
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (this.level[x][y] == this.TILE_ROAD) return true;
    if (this.level[x][y] == this.TILE_LEVEL) return true;
    return false;
};

/**
 * 
 */
MapScene.prototype.isWater = function(x, y)
{
    if (x < 0) x = 0;
    if (y < 0) y = 0;

    for (var xx = 0; xx < 2; xx++)
    {
        for (var yy = 0; yy < 2; yy++)
        {
            if (this.level[Math.floor((x + xx) / 2)][Math.floor((y + yy) / 2)] != this.TILE_WATER) return false;
        }
    }

    return true;
};

/**
 * 
 */
MapScene.prototype.renderStatic = function(g)
{
    var map = Art.map;
    g.clearRect(0, 0, 320, 240);

    for (var x = 0; x < 320 / 16; x++)
    {
        for (var y = 0; y < 240 / 16; y++)
        {
            g.drawImage(map[Math.floor(this.worldNumber / 4)][0], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
            if (this.level[x][y] == this.TILE_LEVEL)
            {
                var type = this.data[x][y];
                if (type === 0)
                {
                    g.drawImage(map[0][7], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
                }
                else if (type == -1)
                {
                    g.drawImage(map[3][8], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
                }
                else if (type == -3)
                {
                    g.drawImage(map[0][8], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
                }
                else if (type == -10)
                {
                    g.drawImage(map[1][8], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
                }
                else if (type == -11)
                {
                    g.drawImage(map[1][7], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
                }
                else if (type == -2)
                {
                    g.drawImage(map[2][7], 0, 0, 16, 16, x * 16, y * 16 - 16, 16, 16);
                    g.drawImage(map[2][8], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
                }
                else
                {
                    g.drawImage(map[type - 1][6], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
                }
            }
            else if (this.level[x][y] == this.TILE_ROAD)
            {
                var p0 = this.isRoad(x - 1, y) ? 1 : 0;
                var p1 = this.isRoad(x, y - 1) ? 1 : 0;
                var p2 = this.isRoad(x + 1, y) ? 1 : 0;
                var p3 = this.isRoad(x, y + 1) ? 1 : 0;
                var s = p0 + p1 * 2 + p2 * 4 + p3 * 8;
                g.drawImage(map[s][2], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
            }
            else if (this.level[x][y] == this.TILE_WATER)
            {
                for (var xx = 0; xx < 2; xx++)
                {
                    for (var yy = 0; yy < 2; yy++)
                    {
                        var p0 = this.isWater(x * 2 + (xx - 1), y * 2 + (yy - 1)) ? 0 : 1;
                        var p1 = this.isWater(x * 2 + (xx + 0), y * 2 + (yy - 1)) ? 0 : 1;
                        var p2 = this.isWater(x * 2 + (xx - 1), y * 2 + (yy + 0)) ? 0 : 1;
                        var p3 = this.isWater(x * 2 + (xx + 0), y * 2 + (yy + 0)) ? 0 : 1;
                        var s = p0 + p1 * 2 + p2 * 4 + p3 * 8 - 1;
                        if (s >= 0 && s < 14)
                        {
                            g.drawImage(map[s][4 + ((xx + yy) & 1)], 0, 0, 16, 16, x * 16 + xx * 8, y * 16 + yy * 8, 16, 16);
                        }
                    }
                }
            }
        }
    }
};

/**
 * 
 */
//função para gerar novo mundo
MapScene.prototype.nextWorld = function()
{
    this.worldNumber++; //incrementa o número do mundo
    if (this.worldNumber == 8) //jogo acaba quando se passa o castelo do mundo 8
    {
        this.jogo.win(); //diz ao componente de jogo que ganhou
        return; //não faz mais nada
    }

    this.moveTime = 0;
    this.levelId = 0;
    this.farthest = 0;
    this.xFarthestCap = 0;
    this.yFarthestCap = 0;

    //define a nova semente e novo motor de geração
    //seed = random.nextLong();
    //random = new Random(seed);
    while (!this.generateLevel())
    continue;
    this.renderStatic(this.staticGr);
};

/**
 * 
 */
MapScene.prototype.drawRoad = function(x0, y0, x1, y1)
{
    var xFirst = nextBoolean();

    if (xFirst)
    {
        while (x0 > x1)
        {
            this.data[x0][y0] = 0;
            this.level[x0--][y0] = this.TILE_ROAD;
        }
        while (x0 < x1)
        {
            this.data[x0][y0] = 0;
            this.level[x0++][y0] = this.TILE_ROAD;
        }
    }
    while (y0 > y1)
    {
        this.data[x0][y0] = 0;
        this.level[x0][y0--] = this.TILE_ROAD;
    }
    while (y0 < y1)
    {
        this.data[x0][y0] = 0;
        this.level[x0][y0++] = this.TILE_ROAD;
    }
    if (!xFirst)
    {
        while (x0 > x1)
        {
            this.data[x0][y0] = 0;
            this.level[x0--][y0] = this.TILE_ROAD;
        }
        while (x0 < x1)
        {
            this.data[x0][y0] = 0;
            this.level[x0++][y0] = this.TILE_ROAD;
        }
    }
};

/**
 * 
 */
MapScene.prototype.connect = function(xSource, ySource, width, height)
{
    var maxDist = 10000;
    var xTarget = 0;
    var yTarget = 0;
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (this.level[x][y] == this.TILE_LEVEL && this.data[x][y] == -2)
            {
                var xd = Math.abs(xSource - x);
                var yd = Math.abs(ySource - y);
                var d = xd * xd + yd * yd;
                if (d < maxDist)
                {
                    xTarget = x;
                    yTarget = y;
                    maxDist = d;
                }
            }
        }
    }

    this.drawRoad(xSource, ySource, xTarget, yTarget);
    this.level[xSource][ySource] = this.TILE_LEVEL;
    this.data[xSource][ySource] = -2;
};

/**
 * 
 */
MapScene.prototype.findConnection = function(width, height)
{
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (this.level[x][y] == this.TILE_LEVEL && this.data[x][y] == -1)
            {
                this.connect(x, y, width, height);
                return true;
            }
        }
    }
    return false;
};

/**
 * 
 */
MapScene.prototype.travel = function(x, y, dir, depth)
{
    if (this.level[x][y] != this.TILE_ROAD && this.level[x][y] != this.TILE_LEVEL)
    {
        return;
    }
    if (this.level[x][y] == this.TILE_ROAD)
    {
        if (this.data[x][y] == 1) return;
        else this.data[x][y] = 1;
    }

    if (this.level[x][y] == this.TILE_LEVEL)
    {
        if (this.data[x][y] > 0)
        {
            if (this.levelId !== 0 && nextInt(4) === 0)
            {
                this.data[x][y] = -3;
            }
            else
            {
                this.data[x][y] = ++this.levelId;
            }
        }
        else if (depth > 0)
        {
            this.data[x][y] = -1;
            if (depth > this.farthest)
            {
                this.farthest = depth;
                this.xFarthestCap = x;
                this.yFarthestCap = y;
            }
        }
    }

    if (dir != 2) this.travel(x - 1, y, 0, depth++);
    if (dir != 3) this.travel(x, y - 1, 1, depth++);
    if (dir !== 0) this.travel(x + 1, y, 2, depth++);
    if (dir != 1) this.travel(x, y + 1, 3, depth++);
};

/**
 * 
 */
MapScene.prototype.findCaps = function(width, height)
{
    var xCap = -1;
    var yCap = -1;

    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (this.level[x][y] == this.TILE_LEVEL)
            {
                var roads = 0;
                for (var xx = x - 1; xx <= x + 1; xx++)
                for (var yy = y - 1; yy <= y + 1; yy++)
                {
                    if (this.level[xx][yy] == this.TILE_ROAD) roads++;
                }

                if (roads == 1)
                {
                    if (xCap == -1)
                    {
                        xCap = x;
                        yCap = y;
                    }
                    this.data[x][y] = 0;
                }
                else
                {
                    this.data[x][y] = 1;
                }
            }
        }
    }

    this.xManuel = xCap * 16;
    this.yManuel = yCap * 16;

    this.travel(xCap, yCap, -1, 0);
};

/**
 * gera um mapa de mundo 
 */
MapScene.prototype.generateLevel = function()
{
    //cria geradores de ruido para a geração dos mapas
    var n0 = new ImprovedNoise(0);
    var n1 = new ImprovedNoise(0);
    var dec = new ImprovedNoise(0);

    //largura e altura com base nos 320*240 com tiles de 16 pixeis
    var width = 320 / 16; // + 1;
    var height = 240 / 16; // + 1;
    this.level = [width];
    this.data = [width];

    for (var i = 0; i < width; i++)
    {
        this.level.push([height]);
        this.data.push([height]);
    }


    //esta coisa toda para dar água ou erva
    var xo0 = nextDouble() * 512;
    var yo0 = nextDouble() * 512;
    var xo1 = nextDouble() * 512;
    var yo1 = nextDouble() * 512;
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            var xd = ((x + 1) / (width - 0.5)) * 2;
            var yd = ((y + 1) / (height - 0.5)) * 2;
            var d = Math.sqrt(xd * xd + yd * yd) * 2;
            if (x === 0 || y === 0 || x >= width - 3 || y >= height - 3) d = 100;
            var t0 = n0.perlinNoise(x * 10.0 + xo0, y * 10.0 + yo0);
            var t1 = n1.perlinNoise(x * 10.0 + xo1, y * 10.0 + yo1);
            var td = (t0 - t1);
            var t = (td * 2);
            this.level[x][y] = t > 0 ? this.TILE_WATER : this.TILE_GRASS;
        }
    }

    //cria locais para os níveis
    var lowestX = 9999;
    var lowestY = 9999;
    var t = 0;
    for (var i = 0; i < 100 && t < 12; i++)
    {
        var x = nextInt((width - 1) / 3) * 3 + 2;
        var y = nextInt((height - 1) / 3) * 3 + 1;
        if (this.level[x][y] == this.TILE_GRASS)
        {
            if (x < lowestX)
            {
                lowestX = x;
                lowestY = y;
            }
            this.level[x][y] = this.TILE_LEVEL;
            this.data[x][y] = -1;
            t++;
        }
    }

    this.data[lowestX][lowestY] = -2;

    while (this.findConnection(width, height))
    continue;

    this.findCaps(width, height);

    if (this.xFarthestCap === 0) return false;

    this.data[this.xFarthestCap][this.yFarthestCap] = -2;
    this.data[this.xManuel / 16][this.yManuel / 16] = -11;


    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (this.level[x][y] == this.TILE_GRASS && (x != this.xFarthestCap || y != this.yFarthestCap - 1))
            {
                var t0 = dec.perlinNoise(x * 10.0 + xo0, y * 10.0 + yo0);
                if (t0 > 0) this.level[x][y] = this.TILE_DECORATION;
            }
        }
    }

    return true;
};

/**
 * 
 */
MapScene.prototype.calcDistance = function(x, y, xa, ya)
{
    var distance = 0;
    while (true)
    {
        x += xa;
        y += ya;
        if (this.level[x][y] != this.TILE_ROAD) return distance;
        if (this.level[x - ya][y + xa] == this.TILE_ROAD) return distance;
        if (this.level[x + ya][y - xa] == this.TILE_ROAD) return distance;
        distance++;
    }
};

/**
 * 
 */
MapScene.prototype.tryWalking = function(xd, yd)
{
    var x = this.xManuel / 16;
    var y = this.yManuel / 16;
    var xt = this.xManuel / 16 + xd;
    var yt = this.yManuel / 16 + yd;

    if (this.level[xt][yt] == this.TILE_ROAD || this.level[xt][yt] == this.TILE_LEVEL)
    {
        if (this.level[xt][yt] == this.TILE_ROAD)
        {
            if ((this.data[xt][yt] !== 0) && (this.data[x][y] !== 0 && this.data[x][y] > -10)) return;
        }
        this.xManuelA = xd * 8;
        this.yManuelA = yd * 8;
        this.moveTime = this.calcDistance(x, y, xd, yd) * 2 + 1;
    }
};

/**
 * actualiza a cena
 */
MapScene.prototype.update = function()
{
    this.xManuel += this.xManuelA;
    this.yManuel += this.yManuelA;
    this.tick++;
    var x = Math.floor(this.xManuel / 16);
    var y = Math.floor(this.yManuel / 16);
    if (this.level[x][y] == this.TILE_ROAD)
    {
        this.data[x][y] = 0;
    }

    if (this.moveTime > 0)
    {
        this.moveTime--;
    }
    else
    {
        this.xManuelA = 0;
        this.yManuelA = 0;
        if (this.canEnterLevel && this.teclas[Manuel.KEY_JUMP])
        {
            if (this.level[x][y] == this.TILE_LEVEL && this.data[x][y] == -11)
            {}
            else
            {
                if (this.level[x][y] == this.TILE_LEVEL && this.data[x][y] !== 0 && this.data[x][y] > -10)
                {
                    Manuel.levelString = "" + (this.worldNumber + 1) + "-";
                    var difficulty = this.worldNumber + 1;
                    var type = LevelTypes.OVERGROUND; //LevelGenerator.TYPE_OVERGROUND;
                    if (this.data[x][y] > 1 && nextInt(3) === 0)
                    {
                        type = LevelTypes.UNDERGROUND; //LevelGenerator.TYPE_UNDERGROUND;
                    }
                    if (this.data[x][y] < 0)
                    {
                        if (this.data[x][y] == -2)
                        {
                            Manuel.levelString += "X";
                            difficulty += 2;
                        }
                        else if (this.data[x][y] == -1)
                        {
                            Manuel.levelString += "?";
                        }
                        else
                        {
                            Manuel.levelString += "#";
                            difficulty += 1;
                        }

                        type = LevelTypes.CASTLE; //LevelGenerator.TYPE_CASTLE;
                    }
                    else
                    {
                        Manuel.levelString += this.data[x][y];
                    }

                    //Art.stopMusic();
                    //jogo.startLevel(seed * x * y + x * 31871 + y * 21871, difficulty, type);
                    this.jogo.startLevel(x * y + x * 31871 + y * 21871, difficulty, type);
                }
            }
        }
        this.canEnterLevel = !this.teclas[Manuel.KEY_JUMP];

        if (this.teclas[Manuel.KEY_LEFT])
        {
            this.teclas[Manuel.KEY_LEFT] = false;
            this.tryWalking(-1, 0);
        }
        if (this.teclas[Manuel.KEY_RIGHT])
        {
            this.teclas[Manuel.KEY_RIGHT] = false;
            this.tryWalking(1, 0);
        }
        if (this.teclas[Manuel.KEY_UP])
        {
            this.teclas[Manuel.KEY_UP] = false;
            this.tryWalking(0, -1);
        }
        if (this.teclas[Manuel.KEY_DOWN])
        {
            this.teclas[Manuel.KEY_DOWN] = false;
            this.tryWalking(0, 1);
        }
        if (this.teclas[Manuel.SPACE])
        {
            this.teclas[Manuel.SPACE] = false;
            this.nextWorld();
        }
    }
};

/**
 * desenha a cena
 */
MapScene.prototype.render = function(g, alpha)
{
    g.drawImage(this.staticBg, 0, 0, 320, 240, 0, 0, 320, 240);
    var map = Art.map;

    for (var y = 0; y <= 240 / 16; y++)
    {
        for (var x = 320 / 16; x >= 0; x--)
        {
            if (this.level[x][y] == this.TILE_WATER)
            {
                if (this.isWater(x * 2 - 1, y * 2 - 1))
                {
                    g.drawImage(map[15][Math.floor(4 + (this.tick / 6 + y) % 4)], 0, 0, 16, 16, x * 16 - 8, y * 16 - 8, 16, 16);
                }
            }
            else if (this.level[x][y] == this.TILE_DECORATION)
            {
                g.drawImage(map[Math.floor((this.tick + y * 12) / 6 % 4)][10 + this.worldNumber % 4], 0, 0, 16, 16, x * 16, y * 16, 16, 16);
            }
            else if (this.level[x][y] == this.TILE_LEVEL && this.data[x][y] == -2 && this.tick / 12 % 2 === 0)
            {
                g.drawImage(map[3][7], 0, 0, 16, 16, x * 16 + 16, y * 16 - 16, 16, 16);
            }
        }
    }

    if (!Manuel.large)
    {
        g.drawImage(map[Math.floor((this.tick) / 6 % 2)][1], 0, 0, 16, 16, this.xManuel + Math.floor(this.xManuelA * alpha), this.yManuel + Math.floor((this.yManuelA * alpha)) - 6, 16, 16);
    }
    else
    {
        if (!Manuel.fire)
        {
            g.drawImage(map[(this.tick) / 6 % 2 + 2][0], this.xManuel + Math.floor(this.xManuelA * alpha), this.yManuel + Math.floor(this.yManuelA * alpha) - 6 - 16, null);
            g.drawImage(map[(this.tick) / 6 % 2 + 2][1], this.xManuel + Math.floor(this.xManuelA * alpha), this.yManuel + Math.floor(this.yManuelA * alpha) - 6, null);
        }
        else
        {
            g.drawImage(map[(this.tick) / 6 % 2 + 4][0], this.xManuel + Math.floor(this.xManuelA * alpha), this.yManuel + Math.floor(this.yManuelA * alpha) - 6 - 16, null);
            g.drawImage(map[(this.tick) / 6 % 2 + 4][1], this.xManuel + Math.floor(this.xManuelA * alpha), this.yManuel + Math.floor(this.yManuelA * alpha) - 6, null);
        }
    }

    drawStringDropShadow(g, "MANUEL " + (Manuel.lives < 10 ? "0" + Manuel.lives : Manuel.lives), 0, 0, 7);

    drawStringDropShadow(g, "WORLD " + (this.worldNumber + 1), 32, 0, 7);
};

/**
 * 
 */
MapScene.prototype.levelWon = function()
{
    this.clearTeclas();
    var x = this.xManuel / 16;
    var y = this.yManuel / 16;
    if (this.data[x][y] == -2)
    {
        this.nextWorld();
        return;
    }
    if (this.data[x][y] != -3) this.data[x][y] = 0;
    else this.data[x][y] = -10;
    this.renderStatic(this.staticGr);
};

/**
 * 
 */
MapScene.prototype.clearTeclas = function()
{
    for (var i = 0; i < this.teclas.length; i++)
    this.teclas[i] = false;
};