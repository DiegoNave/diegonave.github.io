// Plugin: Animated GIF Map Sprite
// Autor: [Seu Nome]
// Versão: 1.0

(function() {
  // Configurações
  var gifUrl = 'img\pictures\images.png'; // URL do GIF
  var mapaId = 1; // ID do mapa onde o GIF será exibido
  var x = 100; // Coordenada X do GIF
  var y = 100; // Coordenada Y do GIF
  var scale = 1; // Escala do GIF (1 = 100%)
  var opacity = 1; // Opacidade do GIF (1 = 100%)

  // Função para criar o sprite do GIF
  function createGifSprite() {
    var sprite = new PIXI.Sprite.from(gifUrl);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(scale);
    sprite.alpha = opacity;
    sprite.anchor.set(0.5, 0.5);
    return sprite;
  }

  // Adicionar o GIF ao mapa
  Scene_Map.prototype.createSpriteset = function() {
    Scene_Base.prototype.createSpriteset.call(this);
    this._gifSprite = createGifSprite();
    this._mapSpriteContainer.addChild(this._gifSprite);
  };

  // Atualizar a posição do GIF
  Scene_Map.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this._gifSprite.x = x;
    this._gifSprite.y = y;
  };
})();
