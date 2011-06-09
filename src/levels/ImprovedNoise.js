function ImprovedNoise(seed)
{    
    this.shuffle(seed);
}    

ImprovedNoise.prototype.p =[512];

/**
 * 
 */ 
ImprovedNoise.prototype.shuffle=function(seed)
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
        this.p[i+256] = this.p[i] = permutation[i];
    }
};
    
/**
 * 
 */ 
ImprovedNoise.prototype.fade=function( t)
{
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
};    

/**
 * 
 */
ImprovedNoise.prototype.lerp=function( t, a, b)
{
    return a + t * (b - a);
};    
    
/**
 * 
 */
ImprovedNoise.prototype.grad=function(hash, x, y, z)
{
    var h = Math.floor(hash & 15); // CONVERT LO 4 BITS OF HASH CODE
    var u = h < 8 ? x : y, // INTO 12 GRADIENT DIRECTIONS.
    v = h < 4 ? y : h == 12 || h == 14 ? x : z;
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
};    
        
/**
 * 
 */
ImprovedNoise.prototype.noise=function( x, y, z)
{
    var X = Math.floor(Math.floor(x) & 255), // FIND UNIT CUBE THAT
    Y =  Math.floor(Math.floor(y) & 255), // CONTAINS POINT.
    Z =  Math.floor(Math.floor(z) & 255);
    x -= Math.floor(x); // FIND RELATIVE X,Y,Z
    y -= Math.floor(y); // OF POINT IN CUBE.
    z -= Math.floor(z);
    var u = this.fade(x), // COMPUTE FADE CURVES
    v = this.fade(y), // FOR EACH OF X,Y,Z.
    w = this.fade(z);
    var A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z; // HASH COORDINATES OF
    A=Math.floor(A);//garantir int
    var B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z; // THE 8 CUBE CORNERS,
    B=Math.floor(B);//garantir int

    return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), // AND ADD
            this.grad(this.p[BA], x - 1, y, z)), // BLENDED
            this.lerp(u, this.grad(this.p[AB], x, y - 1, z), // RESULTS
                    this.grad(this.p[BB], x - 1, y - 1, z))),// FROM  8
            this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), // CORNERS
                    this.grad(this.p[BA + 1], x - 1, y, z - 1)), // OF CUBE
                    this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
};    
    
/**
 * 
 */
ImprovedNoise.prototype.perlinNoise=function( x,  y)
{
    var n = 0.0;

    for (var i = 0; i < 8; i++)
    {
        var stepSize = 64.0 / ((1 << i));
        n += this.noise(x / stepSize, y / stepSize, 128) * 1.0 / (1 << i);
    }
    
    return n;
};    
