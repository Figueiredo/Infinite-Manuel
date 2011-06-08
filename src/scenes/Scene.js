function Scene()
{
    //array de input da cena
    this.teclas = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    
    this.tick=0;
}

//função para mudar o estado de teclas de input na cena
Scene.prototype.toggleKey = function(key, isPressed)
{
    this.teclas[key] = isPressed;
};

//inicializa a cena
Scene.prototype.init = function()
{};

//actualiza a cena
Scene.prototype.update = function()
{};

//desenha a cena  
Scene.prototype.render = function(ctx, alfa)
{};