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



function drawString( g, text, x, y, c)
{
    //char[] ch = text.toCharArray();
    //alert(text.charAt(0)-32);
    for (var i = 0; i < text.length; i++)
    {
        g.drawImage( Art.img[Art.font][text.charCodeAt(i) - 32][c],0,0,8,8, x + i * 8, y, 8,8);
    }
}
function drawStringDropShadow( g, text, x, y, c)
{
    drawString(g, text, x*8+5, y*8+5, 0);
    drawString(g, text, x*8+4, y*8+4, c);
}