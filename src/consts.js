var manuelC=
{
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
    SPACE: 4,
    RUN: 5,
    JUMP: 6,
    SPEC: 7
};

function nextInt(range)
{
    return Math.floor(Math.random()*range);
}

function nextDouble()
{
    return Math.random();
}

var LevelTypes ={OVERGROUND: 0,UNDERGROUND: 1,CASTLE: 2};
