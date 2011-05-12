function CreateLevel( wi, he, se, di, ty)
{
    var width=wi;
    var height=he;

    var ODDS_STRAIGHT = 0;
    var ODDS_HILL_STRAIGHT = 1;
    var ODDS_TUBES = 2;
    var ODDS_JUMP = 3;
    var ODDS_CANNONS = 4;
    var odds = [5]; //int[]
    var totalOdds=0;
    var difficulty=di;
    var type=ty;

    odds[ODDS_STRAIGHT] = 20;
    odds[ODDS_HILL_STRAIGHT] = 10;
    odds[ODDS_TUBES] = 2 + 1 * difficulty;
    odds[ODDS_JUMP] = 2 * difficulty;
    odds[ODDS_CANNONS] = -10 + 5 * difficulty;

    if (type != LevelTypes.OVERGROUND)
    {
        odds[ODDS_HILL_STRAIGHT] = 0;
    }

    for (var i = 0; i < odds.length; i++)
    {
        if (odds[i] < 0) odds[i] = 0;
        totalOdds += odds[i];
        odds[i] = totalOdds - odds[i];
    }
    
    
    var buildZone=function( x, maxLength)
    {
        var t = nextInt(totalOdds);
        var typ = 0;
        for (var i = 0; i < odds.length; i++)
        {
            if (odds[i] <= t)
            {
                typ = i;
            }
        }

        switch (typ)
        {
            case ODDS_STRAIGHT:
                return buildStraight(x, maxLength, false);
            case ODDS_HILL_STRAIGHT:
                return buildHillStraight(x, maxLength);
            case ODDS_TUBES:
                return buildTubes(x, maxLength);
            case ODDS_JUMP:
                return buildJump(x, maxLength);
            case ODDS_CANNONS:
                return buildCannons(x, maxLength);
        }
        return 0;
    };

    var buildJump=function( xo, maxLength)
    {
        var js = nextInt(4) + 2;
        var jl = nextInt(2) + 2;
        var length = js * 2 + jl;

        var hasStairs = (nextInt(3) == 0);

        var floor = height - 1 - nextInt(4);
        for (var x = xo; x < xo + length; x++)
        {
            if (x < xo + js || x > xo + length - js - 1)
            {
                for (var y = 0; y < height; y++)
                {
                    if (y >= floor)
                    {
                        level.setBlock(x, y,  (1 + 9 * 16));
                    }
                    else if (hasStairs)
                    {
                        if (x < xo + js)
                        {
                            if (y >= floor - (x - xo) + 1)
                            {
                                level.setBlock(x, y,  (9 + 0 * 16));
                            }
                        }
                        else
                        {
                            if (y >= floor - ((xo + length) - x) + 2)
                            {
                                level.setBlock(x, y,  (9 + 0 * 16));
                            }
                        }
                    }
                }
            }
        }

        return length;
    };

    var buildCannons=function( xo, maxLength)
    {
        var length = nextInt(10) + 2;
        if (length > maxLength) length = maxLength;

        var floor = height - 1 - nextInt(4);
        var xCannon = xo + 1 + nextInt(4);
        for (var x = xo; x < xo + length; x++)
        {
            if (x > xCannon)
            {
                xCannon += 2 + nextInt(4);
            }
            if (xCannon == xo + length - 1) xCannon += 10;
            var cannonHeight = floor - nextInt(4) - 1;

            for (var y = 0; y < height; y++)
            {
                if (y >= floor)
                {
                    level.setBlock(x, y,  (1 + 9 * 16));
                }
                else
                {
                    if (x == xCannon && y >= cannonHeight)
                    {
                        if (y == cannonHeight)
                        {
                            level.setBlock(x, y,  (14 + 0 * 16));
                        }
                        else if (y == cannonHeight + 1)
                        {
                            level.setBlock(x, y,  (14 + 1 * 16));
                        }
                        else
                        {
                            level.setBlock(x, y,  (14 + 2 * 16));
                        }
                    }
                }
            }
        }

        return length;
    };

    var buildHillStraight=function( xo, maxLength)
    {
        var length = nextInt(10) + 10;
        if (length > maxLength) length = maxLength;

        var floor = height - 1 - nextInt(4);
        for (var x = xo; x < xo + length; x++)
        {
            for (var y = 0; y < height; y++)
            {
                if (y >= floor)
                {
                    level.setBlock(x, y,  (1 + 9 * 16));
                }
            }
        }

        addEnemyLine(xo + 1, xo + length - 1, floor - 1);

        var h = floor;

        var keepGoing = true;

        var occupied = [length]; //boolean[]
        while (keepGoing)
        {
            h = h - 2 - nextInt(3);

            if (h <= 0)
            {
                keepGoing = false;
            }
            else
            {
                var l = nextInt(5) + 3;
                var xxo = nextInt(length - l - 2) + xo + 1;

                if (occupied[xxo - xo] || occupied[xxo - xo + l] || occupied[xxo - xo - 1] || occupied[xxo - xo + l + 1])
                {
                    keepGoing = false;
                }
                else
                {
                    occupied[xxo - xo] = true;
                    occupied[xxo - xo + l] = true;
                    addEnemyLine(xxo, xxo + l, h - 1);
                    if (nextInt(4) == 0)
                    {
                        decorate(xxo - 1, xxo + l + 1, h);
                        keepGoing = false;
                    }
                    for (var x = xxo; x < xxo + l; x++)
                    {
                        for (var y = h; y < floor; y++)
                        {
                            var xx = 5;
                            if (x == xxo) xx = 4;
                            if (x == xxo + l - 1) xx = 6;
                            var yy = 9;
                            if (y == h) yy = 8;

                            if (level.getBlock(x, y) == 0)
                            {
                                level.setBlock(x, y,  (xx + yy * 16));
                            }
                            else
                            {
                                if (level.getBlock(x, y) ==  (4 + 8 * 16)) level.setBlock(x, y,  (4 + 11 * 16));
                                if (level.getBlock(x, y) ==  (6 + 8 * 16)) level.setBlock(x, y,  (6 + 11 * 16));
                            }
                        }
                    }
                }
            }
        }

        return length;
    };

    var addEnemyLine=function( x0, x1, y)
    {
        for (var x = x0; x < x1; x++)
        {
            if (nextInt(35) < difficulty + 1)
            {
         /*       var typ = nextInt(4);
                if (difficulty < 1)
                {
                    typ = Enemy.ENEMY_GOOMBA;
                }
                else if (difficulty < 3)
                {
                    typ = nextInt(3);
                }
                level.setSpriteTemplate(x, y, new SpriteTemplate(type, random.nextInt(35) < difficulty));
        */    }
        }
    };

    var buildTubes=function( xo, maxLength)
    {
        var length = nextInt(10) + 5;
        if (length > maxLength) length = maxLength;

        var floor = height - 1 - nextInt(4);
        var xTube = xo + 1 + nextInt(4);
        var tubeHeight = floor - nextInt(2) - 2;
        for (var x = xo; x < xo + length; x++)
        {
            if (x > xTube + 1)
            {
                xTube += 3 + nextInt(4);
                tubeHeight = floor - nextInt(2) - 2;
            }
            if (xTube >= xo + length - 2) xTube += 10;

            if (x == xTube && nextInt(11) < difficulty + 1)
            {
                //level.setSpriteTemplate(x, tubeHeight, new SpriteTemplate(Enemy.ENEMY_FLOWER, false));
            }

            for (var y = 0; y < height; y++)
            {
                if (y >= floor)
                {
                    level.setBlock(x, y, (1 + 9 * 16));
                }
                else
                {
                    if ((x == xTube || x == xTube + 1) && y >= tubeHeight)
                    {
                        var xPic = 10 + x - xTube;
                        if (y == tubeHeight)
                        {
                            level.setBlock(x, y,  (xPic + 0 * 16));
                        }
                        else
                        {
                            level.setBlock(x, y,  (xPic + 1 * 16));
                        }
                    }
                }
            }
        }

        return length;
    };

    var buildStraight=function( xo, maxLength, safe)
    {
        var length = nextInt(10) + 2;
        if (safe) length = 10 + nextInt(5);
        if (length > maxLength) length = maxLength;

        var floor = height - 1 - nextInt(4);
        for (var x = xo; x < xo + length; x++)
        {
            for (var y = 0; y < height; y++)
            {
                if (y >= floor)
                {
                    level.setBlock(x, y, (1 + 9 * 16));
                }
            }
        }

        if (!safe)
        {
            if (length > 5)
            {
                decorate(xo, xo + length, floor);
            }
        }

        return length;
    };

    var decorate=function( x0, x1, floor)
    {
        if (floor < 1) return;
        
        var rocks = true;

        addEnemyLine(x0 + 1, x1 - 1, floor - 1);

        var s = nextInt(4);
        var e = nextInt(4);

        if (floor - 2 > 0)
        {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 1)
            {
                for (var x = x0 + 1 + s; x < x1 - 1 - e; x++)
                {
                    level.setBlock(x, floor - 2, (2 + 2 * 16));
                }
            }
        }

        s = nextInt(4);
        e = nextInt(4);

        if (floor - 4 > 0)
        {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 2)
            {
                for (x = x0 + 1 + s; x < x1 - 1 - e; x++)
                {
                    if (rocks)
                    {
                        if (x != x0 + 1 && x != x1 - 2 && nextInt(3) == 0)
                        {
                            if (nextInt(4) == 0)
                            {
                                level.setBlock(x, floor - 4, (4 + 2 + 1 * 16));
                            }
                            else
                            {
                                level.setBlock(x, floor - 4, (4 + 1 + 1 * 16));
                            }
                        }
                        else if (nextInt(4) == 0)
                        {
                            if (nextInt(4) == 0)
                            {
                                level.setBlock(x, floor - 4, (2 + 1 * 16));
                            }
                            else
                            {
                                level.setBlock(x, floor - 4, (1 + 1 * 16));
                            }
                        }
                        else
                        {
                            level.setBlock(x, floor - 4, (0 + 1 * 16));
                        }
                    }
                }
            }
        }

        var length = x1 - x0 - 2;

        /*        if (length > 5 && rocks)
         {
         decorate(x0, x1, floor - 4);
         }*/
    };

    var fixWalls=function()
    {
        //boolean[][] blockMap = new boolean[width + 1][height + 1];
        
        var blockMap=[width + 1];
        for(var xpto=0;xpto<width + 1;xpto++)
            blockMap[xpto]=[height + 1];
        
        for (var x = 0; x < width + 1; x++)
        {
            for (var y = 0; y < height + 1; y++)
            {
                var blocks = 0;
                for (var xx = x - 1; xx < x + 1; xx++)
                {
                    for (var yy = y - 1; yy < y + 1; yy++)
                    {
                        if (level.getBlockCapped(xx, yy) == (1 + 9 * 16)) blocks++;
                    }
                }
                blockMap[x][y] = blocks == 4;
            }
        }
        blockify(level, blockMap, width + 1, height + 1);
    };

    var blockify=function( lvl, blocks, wid, hei)
    {
        var to = 0;
        if (type == LevelTypes.CASTLE)
        {
            to = 4 * 2;
        }
        else if (type == LevelTypes.UNDERGROUND)
        {
            to = 4 * 3;
        }

        var b = [2];
        for(var xpto=0;xpto<2;xpto++)
            b[xpto]=[2];
            
        for (var x = 0; x < width; x++)
        {
            for (var y = 0; y < height; y++)
            {
                for (var xx = x; xx <= x + 1; xx++)
                {
                    for (var yy = y; yy <= y + 1; yy++)
                    {
                        var _xx = xx;
                        var _yy = yy;
                        if (_xx < 0) _xx = 0;
                        if (_yy < 0) _yy = 0;
                        if (_xx > width - 1) _xx = width - 1;
                        if (_yy > height - 1) _yy = height - 1;
                        b[xx - x][yy - y] = blocks[_xx][_yy];
                    }
                }

                if (b[0][0] == b[1][0] && b[0][1] == b[1][1])
                {
                    if (b[0][0] == b[0][1])
                    {
                        if (b[0][0])
                        {
                            level.setBlock(x, y,  (1 + 9 * 16 + to));
                        }
                        else
                        {
                            // KEEP OLD BLOCK!
                        }
                    }
                    else
                    {
                        if (b[0][0])
                        {
                            level.setBlock(x, y,  (1 + 10 * 16 + to));
                        }
                        else
                        {
                            level.setBlock(x, y, (1 + 8 * 16 + to));
                        }
                    }
                }
                else if (b[0][0] == b[0][1] && b[1][0] == b[1][1])
                {
                    if (b[0][0])
                    {
                        level.setBlock(x, y,  (2 + 9 * 16 + to));
                    }
                    else
                    {
                        level.setBlock(x, y,  (0 + 9 * 16 + to));
                    }
                }
                else if (b[0][0] == b[1][1] && b[0][1] == b[1][0])
                {
                    level.setBlock(x, y,  (1 + 9 * 16 + to));
                }
                else if (b[0][0] == b[1][0])
                {
                    if (b[0][0])
                    {
                        if (b[0][1])
                        {
                            level.setBlock(x, y,  (3 + 10 * 16 + to));
                        }
                        else
                        {
                            level.setBlock(x, y,  (3 + 11 * 16 + to));
                        }
                    }
                    else
                    {
                        if (b[0][1])
                        {
                            level.setBlock(x, y,  (2 + 8 * 16 + to));
                        }
                        else
                        {
                            level.setBlock(x, y,  (0 + 8 * 16 + to));
                        }
                    }
                }
                else if (b[0][1] == b[1][1])
                {
                    if (b[0][1])
                    {
                        if (b[0][0])
                        {
                            level.setBlock(x, y,  (3 + 9 * 16 + to));
                        }
                        else
                        {
                            level.setBlock(x, y,  (3 + 8 * 16 + to));
                        }
                    }
                    else
                    {
                        if (b[0][0])
                        {
                            level.setBlock(x, y,  (2 + 10 * 16 + to));
                        }
                        else
                        {
                            level.setBlock(x, y,  (0 + 10 * 16 + to));
                        }
                    }
                }
                else
                {
                    level.setBlock(x, y,  (0 + 1 * 16 + to));
                }
            }
        }
    };    

    //lastSeed = seed;
    level = new Level(width, height);
    //random = new Random(seed);

    var length = 0;
    length += buildStraight(0, level.width, true);
    while (length < level.width - 64)
    {
        length += buildZone(length, level.width - length);
    }

    var floor = height - 1 - nextInt(4);

    level.xExit = length + 8;
    level.yExit = floor;

    for (var x = length; x < level.width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (y >= floor)
            {
                level.setBlock(x, y,  (1 + 9 * 16));
            }
        }
    }

    if (type == LevelTypes.CASTLE || type == LevelTypes.UNDERGROUND)
    {
        var ceiling = 0;
        var run = 0;
        for (var x = 0; x < level.width; x++)
        {
            if (run-- <= 0 && x > 4)
            {
                ceiling = nextInt(4);
                run = nextInt(4) + 4;
            }
            for (var y = 0; y < level.height; y++)
            {
                if ((x > 4 && y <= ceiling) || x < 1)
                {
                    level.setBlock(x, y, (1 + 9 * 16));
                }
            }
        }
    }

    fixWalls();

    return level;    
}