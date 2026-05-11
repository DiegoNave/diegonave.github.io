/*:
 * @plugindesc Este plugin substitui o cursor padrão do mouse por uma imagem personalizada. v1.3
 * @author Gemini
 *
 * @param ---Parâmetros Gerais---
 * @default
 *
 * @param Nome do Arquivo do Cursor
 * @parent ---Parâmetros Gerais---
 * @desc O nome do arquivo de imagem para usar como cursor padrão.
 * @default cursor
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param Nome do Arquivo do Cursor (Clique)
 * @parent ---Parâmetros Gerais---
 * @desc O nome do arquivo para usar quando o mouse é clicado.
 * Deixe em branco se não quiser mudar.
 * @default cursor2
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param Deslocamento X
 * @parent ---Parâmetros Gerais---
 * @desc Ajusta a posição horizontal (hotspot) do cursor.
 * @type number
 * @min -9999
 * @default 0
 *
 * @param Deslocamento Y
 * @parent ---Parâmetros Gerais---
 * @desc Ajusta a posição vertical (hotspot) do cursor.
 * @type number
 * @min -9999
 * @default 0
 *
 * @param Ocultar na Inatividade
 * @parent ---Parâmetros Gerais---
 * @desc Ocultar o cursor após um período de inatividade?
 * @type boolean
 * @on Sim
 * @off Não
 * @default false
 *
 * @param Tempo de Inatividade
 * @parent Ocultar na Inatividade
 * @desc Tempo em segundos para o cursor desaparecer quando inativo.
 * @type number
 * @min 1
 * @default 3
 *
 * @help
 * ============================================================================
 * Histórico de Versões
 * ============================================================================
 * v1.3 - 2024-05-21: Adicionada funcionalidade para mudar o cursor ao clicar.
 * v1.2 - 2024-05-21: Adicionado comando de script para mudar o cursor durante o jogo.
 * v1.1 - 2024-05-21: Corrigido o problema onde o cursor só se movia com o botão pressionado.
 *
 * ============================================================================
 * Instruções de Uso
 * ============================================================================
 * 1. Salve este código como um arquivo .js (por exemplo, "CustomMouseCursor.js").
 * 2. Coloque o arquivo na pasta "js/plugins" do seu projeto.
 * 3. Ative o plugin no "Gerenciador de Plugins" e configure os parâmetros.
 *
 * Novidade na v1.3:
 * O cursor mudará automaticamente para a imagem definida em "Nome do Arquivo
 * do Cursor (Clique)" sempre que o botão esquerdo do mouse for pressionado.
 * Ele voltará ao normal quando o botão for solto.
 *
 * ============================================================================
 * Comando de Script para Mudar o Cursor Padrão
 * ============================================================================
 * Para mudar a imagem do cursor padrão (não o de clique) durante o jogo,
 * use o seguinte comando de script em um evento:
 *
 * $gameSystem.setCustomCursor('nomeDoNovoArquivo');
 *
 * Exemplo: Para mudar o cursor padrão para "cursor_magico.png", use:
 * $gameSystem.setCustomCursor('cursor_magico');
 *
 * Lembre-se que os arquivos de imagem devem estar na pasta /img/pictures/.
 * ============================================================================
 */

(function() {
    'use strict';

    const scriptName = 'CustomMouseCursor';
    const params = PluginManager.parameters(scriptName);
    const defaultCursorFile = params['Nome do Arquivo do Cursor'] || 'cursor';
    const clickCursorFile = params['Nome do Arquivo do Cursor (Clique)'] || ''; // NOVO
    const cursorOffsetX = Number(params['Deslocamento X'] || 0);
    const cursorOffsetY = Number(params['Deslocamento Y'] || 0);
    const hideOnIdle = (params['Ocultar na Inatividade'] === 'true');
    const idleTimeout = Number(params['Tempo de Inatividade'] || 3) * 60;

    const MouseManager = { x: 0, y: 0 };
    let idleCounter = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._customCursorFileName = defaultCursorFile;
    };

    Game_System.prototype.setCustomCursor = function(filename) {
        if (typeof filename === 'string') {
            this._customCursorFileName = filename;
        }
    };

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        document.addEventListener('mousemove', function(event) {
            MouseManager.x = Graphics.pageToCanvasX(event.pageX);
            MouseManager.y = Graphics.pageToCanvasY(event.pageY);
        });
    };

    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '#gameCanvas { cursor: none; }';
    document.head.appendChild(style);

    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        this.createCustomCursor();
    };

    Scene_Base.prototype.createCustomCursor = function() {
        if (this._customCursorSprite) {
            this.removeChild(this._customCursorSprite);
        }
        this._customCursorSprite = new Sprite_CustomCursor();
        this._customCursorSprite.zIndex = 100;
        this.addChild(this._customCursorSprite);
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        if (this._customCursorSprite) {
            this.updateCustomCursor();
        }
    };

    Scene_Base.prototype.updateCustomCursor = function() {
        if (hideOnIdle) {
            if (MouseManager.x === lastMouseX && MouseManager.y === lastMouseY) {
                idleCounter++;
            } else {
                idleCounter = 0;
                this._customCursorSprite.visible = true;
            }
            if (idleCounter >= idleTimeout) {
                this._customCursorSprite.visible = false;
            }
            lastMouseX = MouseManager.x;
            lastMouseY = MouseManager.y;
        }
    };

    function Sprite_CustomCursor() {
        this.initialize.apply(this, arguments);
    }

    Sprite_CustomCursor.prototype = Object.create(Sprite.prototype);
    Sprite_CustomCursor.prototype.constructor = Sprite_CustomCursor;

    Sprite_CustomCursor.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._currentCursorName = '';
        this.updatePosition();
    };

    Sprite_CustomCursor.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
    };
    
    // --- ATUALIZADO: Função para atualizar o bitmap dinamicamente ---
    Sprite_CustomCursor.prototype.updateBitmap = function() {
        let targetCursorName = $gameSystem._customCursorFileName;

        // Verifica se o mouse está pressionado e se um cursor de clique foi definido
        if (TouchInput.isPressed() && clickCursorFile) {
            targetCursorName = clickCursorFile;
        }

        // Se o nome do arquivo alvo for diferente do que o sprite está usando...
        if (this._currentCursorName !== targetCursorName) {
            this._currentCursorName = targetCursorName; // ...atualiza o nome...
            this.bitmap = ImageManager.loadPicture(this._currentCursorName); // ...e carrega a nova imagem.
        }
    };

    Sprite_CustomCursor.prototype.updatePosition = function() {
        this.x = MouseManager.x + cursorOffsetX;
        this.y = MouseManager.y + cursorOffsetY;
    };

})();
