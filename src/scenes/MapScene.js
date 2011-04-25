function MapScene(compJogo)
{

    var TILE_GRASS = 0;
    var TILE_WATER = 1;
    var TILE_LEVEL = 2;
    var TILE_ROAD = 3;
    var TILE_DECORATION = 4;

    var level=[];//[][]
    var data=[]; //[][]

    var xManuel=0, yManuel=0;
    var xManuelA=0, yManuelA=0;
 
    var tick=0;
    
    var moveTime = 0; 
    var worldNumber=-1; //número do mundo

    var levelId = 0;
    var farthest = 0;
    var xFarthestCap = 0;
    var yFarthestCap = 0;
    var canEnterLevel = false;

    var jogo=compJogo;

    //array de input da cena
    var teclas = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    
    var staticBg= document.createElement("canvas");
    staticBg.width=320;
    staticBg.height=240;
    var staticGr = staticBg.getContext("2d");    
    
    

    //função para mudar o estado de teclas de input na cena
    this.toggleKey=function(key,isPressed)
    {
        teclas[key]=isPressed;   
    };

    //inicializa a cena
    this.init=function()
    {
        //começa no mundo -1
        worldNumber = -1;
        nextWorld(); //gera o próximo mundo (o mundo 1 é o zero)        
    };
    
    var isRoad=function( x, y)
    {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (level[x][y] == TILE_ROAD) return true;
        if (level[x][y] == TILE_LEVEL) return true;
        return false;
    }

    var isWater=function( x, y)
    {
        if (x < 0) x = 0;
        if (y < 0) y = 0;

        for (var xx = 0; xx < 2; xx++)
        {
            for (var yy = 0; yy < 2; yy++)
            {
                if (level[Math.floor((x + xx) / 2)][Math.floor((y + yy) / 2)] != TILE_WATER) return false;
            }
        }

        return true;
    }    
    
    var renderStatic=function( g )
    {
        var map = Art.img[Art.map];
        g.clearRect(0,0,320,240);        

        for (var x = 0; x < 320 / 16; x++)
        {
            for (var y = 0; y < 240 / 16; y++)
            {
                g.drawImage(map[Math.floor(worldNumber / 4)][0], 0,0,16,16,x * 16, y * 16,16,16);
                if (level[x][y] == TILE_LEVEL)
                {
                    var type = data[x][y];
                    if (type == 0)
                    {
                        g.drawImage(map[0][7], 0,0,16,16,x * 16, y * 16,16,16);
                    }
                    else if (type == -1)
                    {
                        g.drawImage(map[3][8], 0,0,16,16,x * 16, y * 16,16,16);
                    }
                    else if (type == -3)
                    {
                        g.drawImage(map[0][8], 0,0,16,16,x * 16, y * 16,16,16);
                    }
                    else if (type == -10)
                    {
                        g.drawImage(map[1][8], 0,0,16,16,x * 16, y * 16,16,16);
                    }
                    else if (type == -11)
                    {
                        g.drawImage(map[1][7], 0,0,16,16,x * 16, y * 16,16,16);
                    }
                    else if (type == -2)
                    {
                        g.drawImage(map[2][7], 0,0,16,16,x * 16, y * 16 - 16,16,16);
                        g.drawImage(map[2][8], 0,0,16,16,x * 16, y * 16,16,16);
                    }
                    else
                    {
                        g.drawImage(map[type - 1][6], 0,0,16,16,x * 16, y * 16,16,16);
                    }
                }
                else if (level[x][y] == TILE_ROAD)
                {
                    var p0 = isRoad(x - 1, y) ? 1 : 0;
                    var p1 = isRoad(x, y - 1) ? 1 : 0;
                    var p2 = isRoad(x + 1, y) ? 1 : 0;
                    var p3 = isRoad(x, y + 1) ? 1 : 0;
                    var s = p0 + p1 * 2 + p2 * 4 + p3 * 8;
                    g.drawImage(map[s][2], 0,0,16,16,x * 16, y * 16,16,16);
                }
                else if (level[x][y] == TILE_WATER)
                {
                    for (var xx = 0; xx < 2; xx++)
                    {
                        for (var yy = 0; yy < 2; yy++)
                        {
                            var p0 = isWater(x * 2 + (xx - 1), y * 2 + (yy - 1)) ? 0 : 1;
                            var p1 = isWater(x * 2 + (xx + 0), y * 2 + (yy - 1)) ? 0 : 1;
                            var p2 = isWater(x * 2 + (xx - 1), y * 2 + (yy + 0)) ? 0 : 1;
                            var p3 = isWater(x * 2 + (xx + 0), y * 2 + (yy + 0)) ? 0 : 1;
                            var s = p0 + p1 * 2 + p2 * 4 + p3 * 8 - 1;
                            if (s >= 0 && s < 14)
                            {
                                g.drawImage(map[s][4 + ((xx + yy) & 1)],0,0,16,16, x * 16 + xx * 8, y * 16 + yy * 8, 16,16);
                            }
                        }
                    }
                }
            }
        }
    };    
    
    
    //função para gerar novo mundo
    var nextWorld=function()
    {
        worldNumber++; //incrementa o número do mundo

        if (worldNumber==8) //jogo acaba quando se passa o castelo do mundo 8
        {
            jogo.win(); //diz ao componente de jogo que ganhou
            return; //não faz mais nada
        }
        
        moveTime = 0;
        levelId = 0;
        farthest = 0;
        xFarthestCap = 0;
        yFarthestCap = 0;

        //define a nova semente e novo motor de geração
        //seed = random.nextLong();
        //random = new Random(seed);

        while (!generateLevel())
            ;
        renderStatic(staticGr);
    }; 
    
    
    var drawRoad=function( x0, y0, x1, y1)
    {
        var xFirst = nextBoolean();

        if (xFirst)
        {
            while (x0 > x1)
            {
                data[x0][y0] = 0;
                level[x0--][y0] = TILE_ROAD;
            }
            while (x0 < x1)
            {
                data[x0][y0] = 0;
                level[x0++][y0] = TILE_ROAD;
            }
        }
        while (y0 > y1)
        {
            data[x0][y0] = 0;
            level[x0][y0--] = TILE_ROAD;
        }
        while (y0 < y1)
        {
            data[x0][y0] = 0;
            level[x0][y0++] = TILE_ROAD;
        }
        if (!xFirst)
        {
            while (x0 > x1)
            {
                data[x0][y0] = 0;
                level[x0--][y0] = TILE_ROAD;
            }
            while (x0 < x1)
            {
                data[x0][y0] = 0;
                level[x0++][y0] = TILE_ROAD;
            }
        }
    };    
    
    
    var connect=function( xSource, ySource, width, height)
    {
        var maxDist = 10000;
        var xTarget = 0;
        var yTarget = 0;
        for (var x = 0; x < width; x++)
        {
            for (var y = 0; y < height; y++)
            {
                if (level[x][y] == TILE_LEVEL && data[x][y] == -2)
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

        drawRoad(xSource, ySource, xTarget, yTarget);
        level[xSource][ySource] = TILE_LEVEL;
        data[xSource][ySource] = -2;
    };    
    
    var findConnection=function(width, height)
    {
        for (var x = 0; x < width; x++)
        {
            for (var y = 0; y < height; y++)
            {
                if (level[x][y] == TILE_LEVEL && data[x][y] == -1)
                {
                    connect(x, y, width, height);
                    return true;
                }
            }
        }
        return false;
    };    
    
    
    var travel=function( x, y, dir, depth)
    {
        if (level[x][y] != TILE_ROAD && level[x][y] != TILE_LEVEL)
        {
            return;
        }
        if (level[x][y] == TILE_ROAD)
        {
            if (data[x][y] == 1) return;
            else data[x][y] = 1;
        }

        if (level[x][y] == TILE_LEVEL)
        {
            if (data[x][y] > 0)
            {
                if (levelId != 0 && nextInt(4) == 0)
                {
                    data[x][y] = -3;
                }
                else
                {
                    data[x][y] = ++levelId;
                }
            }
            else if (depth > 0)
            {
                data[x][y] = -1;
                if (depth > farthest)
                {
                    farthest = depth;
                    xFarthestCap = x;
                    yFarthestCap = y;
                }
            }
        }

        if (dir != 2) travel(x - 1, y, 0, depth++);
        if (dir != 3) travel(x, y - 1, 1, depth++);
        if (dir != 0) travel(x + 1, y, 2, depth++);
        if (dir != 1) travel(x, y + 1, 3, depth++);
    };    
    
    var findCaps=function(width, height)
    {
        var xCap = -1;
        var yCap = -1;

        for (var x = 0; x < width; x++)
        {
            for (var y = 0; y < height; y++)
            {
                if (level[x][y] == TILE_LEVEL)
                {
                    var roads = 0;
                    for (var xx = x - 1; xx <= x + 1; xx++)
                        for (var yy = y - 1; yy <= y + 1; yy++)
                        {
                            if (level[xx][yy] == TILE_ROAD) roads++;
                        }

                    if (roads == 1)
                    {
                        if (xCap == -1)
                        {
                            xCap = x;
                            yCap = y;
                        }
                        data[x][y] = 0;
                    }
                    else
                    {
                        data[x][y] = 1;
                    }
                }
            }
        }

        xManuel = xCap * 16;
        yManuel = yCap * 16;

        travel(xCap, yCap, -1, 0);
    };    
    
    //gera um mapa de mundo
    var generateLevel=function()
    {
        //cria geradores de ruido para a geração dos mapas
        var n0 = new ImprovedNoise(0);
        var n1 = new ImprovedNoise(0);
        var dec = new ImprovedNoise(0);

        //largura e altura com base nos 320*240 com tiles de 16 pixeis
        var width = 320 / 16;// + 1;
        var height = 240 / 16;// + 1;
                
        level = [width];
        data = [width];
        
        for(var i=0;i<width;i++)
        {
            level.push([height]);
            data.push([height]);
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
                if (x == 0 || y == 0 || x >= width - 3 || y >= height - 3) d = 100;
                var t0 = n0.perlinNoise(x * 10.0 + xo0, y * 10.0 + yo0);
                var t1 = n1.perlinNoise(x * 10.0 + xo1, y * 10.0 + yo1);
                var td = (t0 - t1);
                var t = (td * 2);
                level[x][y] = t > 0 ? TILE_WATER : TILE_GRASS;
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
            if (level[x][y] == TILE_GRASS)
            {
                if (x < lowestX)
                {
                    lowestX = x;
                    lowestY = y;
                }
                level[x][y] = TILE_LEVEL;
                data[x][y] = -1;
                t++;
            }
        }

        data[lowestX][lowestY] = -2;

        while (findConnection(width, height))
            ;

        findCaps(width, height);

        if (xFarthestCap == 0) return false;

        data[xFarthestCap][yFarthestCap] = -2;
        data[xManuel / 16][yManuel / 16] = -11;


        for (var x = 0; x < width; x++)
        {
            for (var y = 0; y < height; y++)
            {
                if (level[x][y] == TILE_GRASS && (x != xFarthestCap || y != yFarthestCap - 1))
                {
                    var t0 = dec.perlinNoise(x * 10.0 + xo0, y * 10.0 + yo0);
                    if (t0 > 0) level[x][y] = TILE_DECORATION;
                }
            }
        }

        return true;
    };    
    
    
    var calcDistance=function( x, y, xa, ya)
    {
        var distance = 0;
        while (true)
        {
            x += xa;
            y += ya;
            if (level[x][y] != TILE_ROAD) return distance;
            if (level[x - ya][y + xa] == TILE_ROAD) return distance;
            if (level[x + ya][y - xa] == TILE_ROAD) return distance;
            distance++;
        }
    };    
    
    var tryWalking=function( xd,  yd)
    {
        var x = xManuel / 16;
        var y = yManuel / 16;
        var xt = xManuel / 16 + xd;
        var yt = yManuel / 16 + yd;

        if (level[xt][yt] == TILE_ROAD || level[xt][yt] == TILE_LEVEL)
        {
            if (level[xt][yt] == TILE_ROAD)
            {
                if ((data[xt][yt] != 0) && (data[x][y] != 0 && data[x][y] > -10)) return;
            }
            xManuelA = xd * 8;
            yManuelA = yd * 8;
            moveTime = calcDistance(x, y, xd, yd) * 2 + 1;
        }
    };    

    //actualiza a cena
    this.update = function()
    {    
        xManuel += xManuelA;
        yManuel += yManuelA;
        tick++;
        var x = Math.floor(xManuel / 16);
        var y = Math.floor(yManuel / 16);
        if (level[x][y] == TILE_ROAD)
        {
            data[x][y] = 0;
        }

        if (moveTime > 0)
        {
            moveTime--;
        }
        else
        {
            xManuelA = 0;
            yManuelA = 0;
            if (canEnterLevel && teclas[manuelC.KEY_JUMP])
            {
                if (level[x][y] == TILE_LEVEL && data[x][y] == -11)
                {
                }
                else
                {
                    if (level[x][y] == TILE_LEVEL && data[x][y] != 0 && data[x][y] > -10)
                    {
                        //Manuel.levelString = (worldNumber + 1) + "-";
                        var difficulty = worldNumber+1;
                        var type = LevelGenerator.TYPE_OVERGROUND;
                        if (data[x][y] > 1 && new Random(seed + x * 313211 + y * 534321).nextInt(3) == 0)
                        {
                            type = LevelGenerator.TYPE_UNDERGROUND;
                        }
                        if (data[x][y] < 0)
                        {
                            if (data[x][y] == -2)
                            {
                             //   Manuel.levelString += "X";
                                difficulty += 2;
                            }
                            else if (data[x][y] == -1)
                            {
                              //  Manuel.levelString += "?";
                            }
                            else
                            {
                            //    Manuel.levelString += "#";
                                difficulty += 1;
                            }

                            type = LevelGenerator.TYPE_CASTLE;
                        }
                        else
                        {
                          //  Manuel.levelString += data[x][y];
                        }

                        //Art.stopMusic();
                        //jogo.startLevel(seed * x * y + x * 31871 + y * 21871, difficulty, type);
                    }
                }
            }
            canEnterLevel = !teclas[manuelC.KEY_JUMP];

            if (teclas[manuelC.KEY_LEFT])
            {
                teclas[manuelC.KEY_LEFT] = false;
                tryWalking(-1, 0);
            }
            if (teclas[manuelC.KEY_RIGHT])
            {
                teclas[manuelC.KEY_RIGHT] = false;
                tryWalking(1, 0);
            }
            if (teclas[manuelC.KEY_UP])
            {
                teclas[manuelC.KEY_UP] = false;
                tryWalking(0, -1);
            }
            if (teclas[manuelC.KEY_DOWN])
            {
                teclas[manuelC.KEY_DOWN] = false;
                tryWalking(0, 1);
            }
            if (teclas[manuelC.SPACE])
            {
                teclas[manuelC.SPACE] = false;
                nextWorld();
            }            
        }        
        
    };

    //desenha a cena  
    this.render= function(g,alpha)
    {
        g.drawImage(staticBg, 0, 0,320,240,0,0,320,240);
        var map = Art.img[Art.map];

        for (var y = 0; y <= 240 / 16; y++)
        {
            for (var x = 320 / 16; x >= 0; x--)
            {
                if (level[x][y] == TILE_WATER)
                {
                    if (isWater(x * 2 - 1, y * 2 - 1))
                    {
                        g.drawImage(map[15][Math.floor(4 + (tick / 6 + y) % 4)],0,0,16,16, x * 16 - 8, y * 16 - 8, 16,16);
                    }
                }
                else if (level[x][y] == TILE_DECORATION)
                {
                    g.drawImage(map[Math.floor((tick + y * 12) / 6 % 4)][10 + worldNumber % 4],0,0,16,16, x * 16, y * 16,16,16);
                }
                else if (level[x][y] == TILE_LEVEL && data[x][y] == -2 && tick / 12 % 2 == 0)
                {
                    g.drawImage(map[3][7],0,0,16,16, x * 16 + 16, y * 16 - 16, 16,16);
                }
            }
        }
//        if (!Manuel.large)
//        {
            g.drawImage(map[Math.floor((tick) / 6 % 2)][1],0,0,16,16, xManuel + Math.floor(xManuelA * alpha), yManuel + Math.floor((yManuelA * alpha)) - 6, 16,16);
/*        }
        else
        {
            if (!Manuel.fire)
            {
                g.drawImage(map[(tick) / 6 % 2+2][0], xManuel + (int) (xManuelA * alpha), yManuel + (int) (yManuelA * alpha) - 6-16, null);
                g.drawImage(map[(tick) / 6 % 2+2][1], xManuel + (int) (xManuelA * alpha), yManuel + (int) (yManuelA * alpha) - 6, null);
            }
            else
            {
                g.drawImage(map[(tick) / 6 % 2+4][0], xManuel + (int) (xManuelA * alpha), yManuel + (int) (yManuelA * alpha) - 6-16, null);
                g.drawImage(map[(tick) / 6 % 2+4][1], xManuel + (int) (xManuelA * alpha), yManuel + (int) (yManuelA * alpha) - 6, null);
            }
        }
*/        
        //drawStringDropShadow(g, "MARIO " + df.format(Manuel.lives), 0, 0, 7);

        //drawStringDropShadow(g, "WORLD "+(worldNumber+1), 32, 0, 7);
    };
    
    this.levelWon=function()
    {
        var x = xManuel / 16;
        var y = yManuel / 16;
        if (data[x][y] == -2)
        {
            nextWorld();
            return;
        }
        if (data[x][y] != -3) data[x][y] = 0;
        else data[x][y] = -10;
        renderStatic(staticGr);
    };    
    
}