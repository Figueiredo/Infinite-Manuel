var manuelC=
{
    KEY_LEFT: 0,
    KEY_RIGHT: 1,
    KEY_UP: 2,
    KEY_DOWN: 3,
    SPACE: 4,
    KEY_RUN: 5,
    KEY_JUMP: 6,
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

function nextBoolean()
{
    return (Math.random()<0.5);   
}

var LevelTypes ={OVERGROUND: 0,UNDERGROUND: 1,CASTLE: 2};
