//(int width, int height, boolean distant, int type)
function createBGLevel(largura,altura,dist,tipo)
{
    
    var width = largura;
    var height= altura;
    var distant = dist;
    var type=tipo;
    var s;

    var level = new Level(width, height);

    switch (type)
    {
        case LevelTypes.OVERGROUND:
        
            var range = distant ? 4 : 6;
            var offs = distant ? 2 : 1;
            var oh = nextInt(range) + offs;
            var h = nextInt(range) + offs;
            for (var x = 0; x < width; x++)
            {
                oh = h;
                while (oh == h)
                {
                    h = nextInt(range) + offs;
                }
                for (var y = 0; y < height; y++)
                {
                    var h0 = (oh < h) ? oh : h;
                    var h1 = (oh < h) ? h : oh;
                    if (y < h0)
                    {
                        if (distant)
                        {
                            s = 2;
                            if (y < 2) s = y;
                            level.setBlock(x, y, (4 + s * 8));
                        }
                        else
                        {
                            level.setBlock(x, y, 5);
                        }
                    }
                    else if (y == h0)
                    {
                        s = h0 == h ? 0 : 1;
                        s += distant ? 2 : 0;
                        level.setBlock(x, y, s);
                    }
                    else if (y == h1)
                    {
                        s = h0 == h ? 0 : 1;
                        s += distant ? 2 : 0;
                        level.setBlock(x, y, (s + 16));
                    }
                    else
                    {
                        s = y > h1 ? 1 : 0;
                        if (h0 == oh) s = 1 - s;
                        s += distant ? 2 : 0;
                        level.setBlock(x, y, (s + 8));
                    }
                }
            }
            break;
        
        case LevelTypes.UNDERGROUND:
        
            if (distant)
            {
                var tt = 0;
                for (var x = 0; x < width; x++)
                {
                    if (nextDouble() < 0.75) tt = 1 - tt;
                    for (var y = 0; y < height; y++)
                    {
                        var t = tt;
                        var yy = y - 2;
                        if (yy < 0 || yy > 4)
                        {
                            yy = 2;
                            t = 0;
                        }
                        level.setBlock(x, y, (4 + t + (3 + yy) * 8));
                    }
                }
            }
            else
            {
                for (var x = 0; x < width; x++)
                {
                    for (var y = 0; y < height; y++)
                    {
                        var t = x % 2;
                        var yy = y-1;
                        if (yy < 0 || yy > 7)
                        {
                            yy = 7;
                            t = 0;
                        }
                        if (t == 0 && yy > 1 && yy < 5)
                        {
                            t = -1;
                            yy = 0;
                        }
                        level.setBlock(x, y, (6 + t + (yy) * 8));
                    }
                }
            }
            break;
        
        case LevelTypes.CASTLE:
        
            if (distant)
            {
                for (var x = 0; x < width; x++)
                {
                    for (var y = 0; y < height; y++)
                    {
                        var t = x % 2;
                        var yy = y - 1;
                        if (yy>2 && yy<5)
                        {
                            yy = 2;
                        }
                        else if (yy>=5)
                        {
                            yy-=2;
                        }
                        if (yy < 0)
                        {
                            t = 0;
                            yy = 5;
                        }
                        else if (yy > 4)
                        {
                            t = 1;
                            yy = 5;
                        }
                        else if (t<1 && yy==3)
                        {
                            t = 0;
                            yy = 3;
                        }
                        else if (t<1 && yy>0 && yy<3)
                        {
                            t = 0;
                            yy = 2;
                        }
                        level.setBlock(x, y, (1+t + (yy + 4) * 8));
                    }
                }
            }
            else
            {
                for (var x = 0; x < width; x++)
                {
                    for (var y = 0; y < height; y++)
                    {
                        var t = x % 3;
                        var yy = y - 1;
                        if (yy>2 && yy<5)
                        {
                            yy = 2;
                        }
                        else if (yy>=5)
                        {
                            yy-=2;
                        }
                        if (yy < 0)
                        {
                            t = 1;
                            yy = 5;
                        }
                        else if (yy > 4)
                        {
                            t = 2;
                            yy = 5;
                        }
                        else if (t<2 && yy==4)
                        {
                            t = 2;
                            yy = 4;
                        }
                        else if (t<2 && yy>0 && yy<4)
                        {
                            t = 4;
                            yy = -3;
                        }
                        level.setBlock(x, y, (1 + t + (yy + 3) * 8));
                    }
                }
            }
            break;
        
    }
    return level;
}