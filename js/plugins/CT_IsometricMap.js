//=============================================================================
// 2.5D Hybrid View Plugin for RPG Maker MV
// MRP_2.5D_HybridView.js
// By: Seu Nome
// Version: 1.0.0
//=============================================================================
//
// Descrição:
// Este plugin cria um efeito 2.5D onde o chão usa perspectiva diagonal
// e personagens/eventos usam visão vertical, similar ao minimapa do Chrono Trigger.
//
//=============================================================================
//
// Como usar:
// 1. Instale o plugin e ative-o
// 2. Configure os parâmetros conforme necessário
// 3. Use tilesets normais - o efeito será aplicado automaticamente
//
//=============================================================================

/*:
 * @plugindesc Cria efeito 2.5D híbrido (chão diagonal + personagens verticais)
 * @author Seu Nome
 * @help
 * Este plugin modifica a renderização para criar um visual 2.5D único.
 * 
 * Características:
 * - Chão e paredes em perspectiva diagonal
 * - Personagens e eventos em visão vertical
 * - Efeito similar ao minimapa do Chrono Trigger
 * 
 * Compatibilidade:
 * - Funciona com tilesets padrão do RPG Maker MV
 * - Pode ter conflitos com plugins que modificam a renderização
 */

(function() {
    'use strict';

    // Parâmetros do plugin
    var parameters = PluginManager.parameters('MRP_2.5D_HybridView');
    
    // Configurações de perspectiva
    var config = {
        // Ângulo de inclinação para o chão (em graus)
        groundAngle: 30,
        
        // Escala vertical para compressão
        verticalScale: 0.7,
        
        // Offset vertical para alinhamento
        verticalOffset: 0,
        
        // Largura do tile
        tileWidth: 48,
        
        // Altura do tile
        tileHeight: 48,
        
        // Ativar/desativar debug
        debugMode: false
    };

    //=============================================================================
    // Override na classe Tilemap para modificar a renderização
    //=============================================================================
    
    // Salvar referência original
    var _Tilemap_initialize = Tilemap.prototype.initialize;
    
    Tilemap.prototype.initialize = function() {
        _Tilemap_initialize.call(this);
        this._2d5Mode = true;
    };

    // Modificar a atualização do tilemap
    var _Tilemap_update = Tilemap.prototype.update;
    
    Tilemap.prototype.update = function() {
        _Tilemap_update.call(this);
        
        if (this._2d5Mode) {
            this.updateTransform();
        }
    };

    // Aplicar transformação de perspectiva
    Tilemap.prototype.updateTransform = function() {
        // Aplicar inclinação diagonal ao chão
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                
                // Identificar camadas de chão
                if (this.isGroundLayer(child)) {
                    child.skew.x = Math.tan(config.groundAngle * Math.PI / 180);
                    child.scale.y = config.verticalScale;
                }
            }
        }
    };

    // Verificar se é camada de chão
    Tilemap.prototype.isGroundLayer = function(layer) {
        // Lógica para identificar camadas de chão
        // Por padrão, camadas inferiores são consideradas chão
        return layer === this.children[0] || layer === this.children[1];
    };

    //=============================================================================
    // Override no Sprite_Character para visão vertical
    //=============================================================================
    
    var _Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
    
    Sprite_Character.prototype.initMembers = function() {
        _Sprite_Character_initMembers.call(this);
        this._2d5View = true;
    };

    var _Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
    
    Sprite_Character.prototype.updatePosition = function() {
        if (this._2d5View) {
            this.update2d5Position();
        } else {
            _Sprite_Character_updatePosition.call(this);
        }
    };

    // Atualizar posição para visão vertical 2.5D
    Sprite_Character.prototype.update2d5Position = function() {
        // Posição base
        var x = this._character.screenX();
        var y = this._character.screenY();
        
        // Ajustar para perspectiva vertical
        this.x = x;
        this.y = y;
        
        // Aplicar escala vertical se necessário
        this.scale.y = 1.0; // Manter escala normal para personagens
        this.scale.x = 1.0;
        
        // Remover qualquer inclinação aplicada ao chão
        this.skew.x = 0;
        this.skew.y = 0;
    };

    //=============================================================================
    // Override na classe Game_Map para ajustar coordenadas
    //=============================================================================
    
    var _Game_Map_setup = Game_Map.prototype.setup;
    
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        this._2d5Setup = true;
    };

    // Ajustar conversão de coordenadas para o efeito 2.5D
    Game_Map.prototype.adjustX2d5 = function(x) {
        // Converter coordenada X para perspectiva diagonal
        return x;
    };

    Game_Map.prototype.adjustY2d5 = function(y) {
        // Converter coordenada Y para perspectiva diagonal
        return y * Math.cos(config.groundAngle * Math.PI / 180);
    };

    //=============================================================================
    // Override no renderer para aplicar o efeito final
    //=============================================================================
    
    var _Spriteset_Map_createTilemap = Spriteset_Map.prototype.createTilemap;
    
    Spriteset_Map.prototype.createTilemap = function() {
        _Spriteset_Map_createTilemap.call(this);
        this.setup2d5Effect();
    };

    Spriteset_Map.prototype.setup2d5Effect = function() {
        // Configurar o tilemap para o efeito 2.5D
        if (this._tilemap) {
            this._tilemap._2d5Mode = true;
            
            // Ajustar a posição do tilemap
            this._tilemap.y += config.verticalOffset;
            
            // Configurar filtro de renderização
            if (Graphics._renderer && Graphics._renderer.type === 'webgl') {
                this.applyWebGLEffects();
            }
        }
    };

    // Aplicar efeitos WebGL se disponível
    Spriteset_Map.prototype.applyWebGLEffects = function() {
        try {
            var renderer = Graphics._renderer;
            
            // Criar shader personalizado para efeito 2.5D
            var vertexShader = `
                attribute vec2 aVertexPosition;
                uniform mat3 projectionMatrix;
                
                varying vec2 vTextureCoord;
                
                void main(void) {
                    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                    vTextureCoord = aVertexPosition;
                }
            `;
            
            // Nota: Implementação avançada de shaders requer mais desenvolvimento
            // Esta é uma base para futuras melhorias
            
        } catch(e) {
            if (config.debugMode) {
                console.warn("WebGL effects not available:", e);
            }
        }
    };

    //=============================================================================
    // Sistema de ordenação Z modificado para 2.5D
    //=============================================================================
    
    var _Spriteset_Map_sortChildren = Spriteset_Map.prototype.sortChildren;
    
    Spriteset_Map.prototype.sortChildren = function() {
        // Ordenar sprites baseado na posição Y (mais próximo da câmera primeiro)
        if (this._characterSprites) {
            this._characterSprites.sort(function(a, b) {
                return a.y - b.y;
            });
        }
    };

    //=============================================================================
    // Utilitários e funções auxiliares
    //=============================================================================
    
    // Função para alternar o modo 2.5D (útil para debug)
    window.toggle2d5Mode = function() {
        config.debugMode = !config.debugMode;
        if (SceneManager._scene && SceneManager._scene._spriteset) {
            var tilemap = SceneManager._scene._spriteset._tilemap;
            if (tilemap) {
                tilemap._2d5Mode = config.debugMode;
                tilemap.updateTransform();
            }
        }
        console.log("2.5D Mode:", config.debugMode ? "ON" : "OFF");
    };

    // Função para ajustar o ângulo do chão
    window.setGroundAngle = function(angle) {
        config.groundAngle = Math.max(0, Math.min(45, angle));
        if (SceneManager._scene && SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset.setup2d5Effect();
        }
    };

    //=============================================================================
    // Log de inicialização
    //=============================================================================
    
    console.log("2.5D Hybrid View Plugin carregado!");
    console.log("Use toggle2d5Mode() para alternar o efeito");
    console.log("Use setGroundAngle(angle) para ajustar o ângulo");

})();