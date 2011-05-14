function ImprovedNoise(seed)
{
    var shuffle=function(seed)
    {
        //Random random = new Random(seed);
        var permutation = [256];
        var i;
        for (i=0; i<256; i++)
        {
            permutation[i] = i;
        }

        for (i=0; i<256; i++)
        {
            var j = nextInt(256-i)+i;
            var tmp = permutation[i];
            permutation[i] = permutation[j];
            permutation[j] = tmp;
            p[i+256] = p[i] = permutation[i];
        }
    };
    
    var fade=function( t)
    {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    };    
    
    var lerp=function( t, a, b)
    {
        return a + t * (b - a);
    };    
    
    var grad=function(hash, x, y, z)
    {
        var h = Math.floor(hash & 15); // CONVERT LO 4 BITS OF HASH CODE
        var u = h < 8 ? x : y, // INTO 12 GRADIENT DIRECTIONS.
        v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    };    
    
    
    this.noise=function( x, y, z)
    {
        var X = Math.floor(Math.floor(x) & 255), // FIND UNIT CUBE THAT
        Y =  Math.floor(Math.floor(y) & 255), // CONTAINS POINT.
        Z =  Math.floor(Math.floor(z) & 255);
        x -= Math.floor(x); // FIND RELATIVE X,Y,Z
        y -= Math.floor(y); // OF POINT IN CUBE.
        z -= Math.floor(z);
        var u = fade(x), // COMPUTE FADE CURVES
        v = fade(y), // FOR EACH OF X,Y,Z.
        w = fade(z);
        var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z; // HASH COORDINATES OF
        A=Math.floor(A);//garantir int
        var B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z; // THE 8 CUBE CORNERS,
        B=Math.floor(B);//garantir int

        return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), // AND ADD
                grad(p[BA], x - 1, y, z)), // BLENDED
                lerp(u, grad(p[AB], x, y - 1, z), // RESULTS
                        grad(p[BB], x - 1, y - 1, z))),// FROM  8
                lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), // CORNERS
                        grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
                        lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))));
    };    
    
    this.perlinNoise=function( x,  y)
    {
        var n = 0.0;

        for (var i = 0; i < 8; i++)
        {
            var stepSize = 64.0 / ((1 << i));
            n += this.noise(x / stepSize, y / stepSize, 128) * 1.0 / (1 << i);
        }
        
        return n;
    };    

    var p =[512];
    
    shuffle(seed);

}