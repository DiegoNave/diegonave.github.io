/*:
 * @plugindesc Balão visual customizado v4.0
 * @author Você + Meta AI
 *
 * @param Debug
 * @desc Mostra logs no console F8
 * @type boolean
 * @default true
 *
 * @param DefaultWait
 * @desc Trava player por padrão em todo balão
 * @type boolean
 * @default false
 *
 * @help
 * ====================================
 * SPEECH_Bubbles v4.0
 * ====================================
 *
 * \BUBBLE[event,ID,seta,wait]Texto
 * \BUBBLE[player,seta,wait]Texto
 * \BUBBLE[actor,ID,seta,wait]Texto
 * \BUBBLE[screen,X,Y,seta,wait]Texto
 * \BUBBLE[clear]
 *
 * seta = above ou below
 * wait = trava o player
 *
 * Cores: \C[0] a \C[31]
 *
 * Ex: \BUBBLE[event][19][above][wait]\C[2]Perigo!\C[0]
 *
 * v4.0:
 * - Desenho manual: cantos arredondados + rabinho
 * - Fundo branco, borda preta
 * - Compatível MV 1.0+
 */

(function() {
    'use strict';

    const params = PluginManager.parameters('SPEECH_Bubbles');
    const DEBUG = params['Debug'] === 'true';
    const DEFAULT_WAIT = params['DefaultWait'] === 'true';

    function log(...args) {
        if (DEBUG) console.log('[SPEECH_Bubbles]',...args);
    }

    //=======================
    // Game_System
    //=======================
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._speechBubbles = [];
        this._speechBubbleWaiting = false;
    };

    Game_System.prototype.addSpeechBubble = function(data) {
        data.id = Date.now() + Math.random();
        this._speechBubbles.push(data);
        if (data.wait) {
            this._speechBubbleWaiting = true;
            $gamePlayer.setDirectionFix(true);
            log('Player travado por balão ID:', data.id);
        }
        log('Balão adicionado:', data);
    };

    Game_System.prototype.clearSpeechBubbles = function() {
        this._speechBubbles = [];
        this._speechBubbleWaiting = false;
        $gamePlayer.setDirectionFix(false);
        log('Todos balões limpos, player destravado');
    };

    Game_System.prototype.getSpeechBubbles = function() {
        return this._speechBubbles;
    };

    Game_System.prototype.removeSpeechBubble = function(id) {
        const bubble = this._speechBubbles.find(b => b.id === id);
        if (bubble && bubble.wait) {
            this._speechBubbleWaiting = false;
            $gamePlayer.setDirectionFix(false);
            log('Player destravado - balão ID:', id);
        }
        this._speechBubbles = this._speechBubbles.filter(b => b.id!== id);
    };

    Game_System.prototype.isSpeechBubbleWaiting = function() {
        return this._speechBubbleWaiting;
    };

    //=======================
    // Game_Player
    //=======================
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if ($gameSystem.isSpeechBubbleWaiting()) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    //=======================
    // Game_Interpreter
    //=======================
    const _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            const texts = [];
            while (this.nextEventCode() === 401) {
                this._index++;
                texts.push(this.currentCommand().parameters[0]);
            }

            if (texts.length > 0 && texts[0].match(/^\\BUBBLE/i)) {
                log('Interceptado Mostrar Texto com \BUBBLE');
                this.processBubbleText(texts.join('\n'));
                if ($gameSystem.isSpeechBubbleWaiting()) {
                    this.setWaitMode('bubble');
                }
                return true;
            } else {
                this._index -= texts.length;
            }
        }
        return _Game_Interpreter_command101.call(this);
    };

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'bubble') {
            if ($gameSystem.isSpeechBubbleWaiting()) {
                return true;
            } else {
                this._waitMode = '';
                return false;
            }
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };

    Game_Interpreter.prototype.processBubbleText = function(fullText) {
        const lines = fullText.split('\n');
        for (const line of lines) {
            if (!line.match(/^\\BUBBLE/i)) continue;

            const match = line.match(/^\\BUBBLE((?:\[[^\]]*\])+|\[[^\]]+\])(.*)/i);
            if (!match) {
                log('ERRO: Linha não parseada:', line);
                continue;
            }

            const paramString = match[1];
            const bubbleText = match[2].trim();
            log('paramString:', paramString, 'bubbleText:', bubbleText);

            const params = paramString.replace(/\]\[/g, ',').replace(/^\[|\]$/g, '').split(',').map(p => p.trim());
            log('params:', params);

            const type = params[0]? params[0].toLowerCase() : '';

            if (type === 'clear') {
                $gameSystem.clearSpeechBubbles();
                continue;
            }

            if (!bubbleText) {
                log('AVISO: Texto vazio, pulando');
                continue;
            }

            const hasWait = params.includes('wait') || DEFAULT_WAIT;

            let bubbleData = {
                text: bubbleText,
                arrow: 'above',
                lifetime: Math.max(90, 60 + bubbleText.length * 2),
                wait: hasWait
            };

            try {
                if (type === 'event') {
                    bubbleData.type = 'event';
                    bubbleData.targetId = Number(params[1]);
                    const arrowParam = params.find(p => p === 'above' || p === 'below');
                    bubbleData.arrow = arrowParam === 'below'? 'below' : 'above';
                    log('Evento ID:', bubbleData.targetId, 'Seta:', bubbleData.arrow, 'Wait:', hasWait);
                } else if (type === 'player') {
                    bubbleData.type = 'player';
                    const arrowParam = params.find(p => p === 'above' || p === 'below');
                    bubbleData.arrow = arrowParam === 'below'? 'below' : 'above';
                } else if (type === 'actor') {
                    bubbleData.type = 'actor';
                    bubbleData.targetId = Number(params[1]);
                    const arrowParam = params.find(p => p === 'above' || p === 'below');
                    bubbleData.arrow = arrowParam === 'below'? 'below' : 'above';
                } else if (type === 'screen') {
                    bubbleData.type = 'screen';
                    bubbleData.x = Number(params[1]);
                    bubbleData.y = Number(params[2]);
                    const arrowParam = params.find(p => p === 'above' || p === 'below');
                    bubbleData.arrow = arrowParam === 'below'? 'below' : 'above';
                } else {
                    log('ERRO: Tipo inválido:', type);
                    continue;
                }
                $gameSystem.addSpeechBubble(bubbleData);
            } catch (e) {
                log('ERRO ao processar balão:', e);
            }
        }
    };

    //=======================
    // Sprite_SpeechBubble - v4.0: Desenho manual
    //=======================
    function Sprite_SpeechBubble() {
        this.initialize.apply(this, arguments);
    }

    Sprite_SpeechBubble.prototype = Object.create(Sprite.prototype);
    Sprite_SpeechBubble.prototype.constructor = Sprite_SpeechBubble;

    Sprite_SpeechBubble.prototype.initialize = function(data) {
        Sprite.prototype.initialize.call(this);
        this._data = data;
        this._lifetime = data.lifetime;
        this._tailHeight = 14;
        this._cornerRadius = 12;
        this._borderWidth = 3;
        this.createBitmap();
        this.updatePosition();
        log('Sprite_SpeechBubble criado ID:', data.id);
    };

    Sprite_SpeechBubble.prototype.createBitmap = function() {
        const padding = 16;
        const fontSize = 22;
        const maxWidth = 240;

        // Mede texto com Window_Base temporária
        const tempWindow = new Window_Base(0, 0, 0, 0);
        const text = tempWindow.convertEscapeCharacters(this._data.text);
        const cleanText = text.replace(/\x1bC\[\d+\]/gi, '');
        const lines = cleanText.split('\n');
        let textWidth = 0;
        for (let i = 0; i < lines.length; i++) {
            const w = tempWindow.textWidth(lines[i]);
            if (w > textWidth) textWidth = w;
        }
        const textHeight = lines.length * (fontSize + 4);
        tempWindow.destroy();

        const bubbleWidth = Math.min(maxWidth, textWidth + padding * 2);
        const bubbleHeight = textHeight + padding * 2;

        this.bitmap = new Bitmap(bubbleWidth, bubbleHeight + this._tailHeight);
        this.bitmap.fontSize = fontSize;

        const ctx = this.bitmap.context;
        ctx.save();

        // Desenha balão arredondado
        const x = this._borderWidth;
        const y = this._data.arrow === 'above'? 0 : this._tailHeight;
        const w = bubbleWidth - this._borderWidth * 2;
        const h = bubbleHeight;
        const r = this._cornerRadius;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();

        // Fundo branco
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Borda preta
        ctx.lineWidth = this._borderWidth;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        // Desenha rabinho
        ctx.beginPath();
        const tailX = bubbleWidth / 2;
        if (this._data.arrow === 'above') {
            const tailY = bubbleHeight;
            ctx.moveTo(tailX - 12, tailY);
            ctx.lineTo(tailX, tailY + this._tailHeight);
            ctx.lineTo(tailX + 12, tailY);
        } else {
            const tailY = this._tailHeight;
            ctx.moveTo(tailX - 12, tailY);
            ctx.lineTo(tailX, 0);
            ctx.lineTo(tailX + 12, tailY);
        }
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = this._borderWidth;
        ctx.stroke();

        ctx.restore();
        if (this.bitmap._setDirty) this.bitmap._setDirty();

        // Desenha texto por cima
        this.drawTextWithEscapeCodes(this._data.text, padding, y + padding);

        this.anchor.x = 0.5;
        this.anchor.y = this._data.arrow === 'above'? 1 : 0;
        log('Bitmap criado:', bubbleWidth, 'x', bubbleHeight + this._tailHeight);
    };

    Sprite_SpeechBubble.prototype.drawTextWithEscapeCodes = function(text, x, y) {
        const tempWindow = new Window_Base(0, 0, 0, 0);
        const textState = { index: 0, x: x, y: y, text: tempWindow.convertEscapeCharacters(text) };
        tempWindow.resetFontSettings();
        tempWindow.contents = this.bitmap;
        tempWindow.contentsOpacity = 255;

        while (textState.index < textState.text.length) {
            const c = textState.text[textState.index];
            if (c === '\x1b') {
                if (tempWindow.obtainEscapeCode(textState) === 'C') {
                    const colorIndex = tempWindow.obtainEscapeParam(textState);
                    const color = this.textColor(colorIndex);
                    this.bitmap.textColor = color;
                    log('Cor aplicada:', colorIndex, '->', color);
                    continue;
                }
            }
            const w = tempWindow.textWidth(c);
            tempWindow.drawText(c, textState.x, textState.y, w * 2, tempWindow.lineHeight());
            textState.x += w;
            textState.index++;
        }
        tempWindow.destroy();
    };

    Sprite_SpeechBubble.prototype.textColor = function(n) {
        const colors = [
            '#000000','#0000ff','#ff0000','#008000','#00ffff','#ff00ff','#ffff00','#808080',
            '#000000','#0000ff','#ff0000','#00ff00','#00ffff','#ff00ff','#ffff00','#808080',
            '#c0c0c0','#000080','#800000','#008080','#808000','#800080','#c0c0c0','#404040',
            '#404040','#4040ff','#ff4040','#40ff40','#40ffff','#ff40ff','#ffff40','#c0c0c0'
        ];
        return colors[n] || '#000000';
    };

    Sprite_SpeechBubble.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this._lifetime--;
        this.opacity = this._lifetime < 20? this._lifetime * 12.75 : 255;
        this.updatePosition();
        if (this._lifetime <= 0) {
            $gameSystem.removeSpeechBubble(this._data.id);
            if (this.parent) this.parent.removeChild(this);
        }
    };

    Sprite_SpeechBubble.prototype.updatePosition = function() {
        let targetX = 0, targetY = 0;
        let valid = false;

        if (this._data.type === 'event') {
            const event = $gameMap.event(this._data.targetId);
            if (event) {
                targetX = event.screenX();
                targetY = event.screenY() - 24;
                valid = true;
            } else {
                log('ERRO: Evento', this._data.targetId, 'não encontrado');
            }
        } else if (this._data.type === 'player') {
            targetX = $gamePlayer.screenX();
            targetY = $gamePlayer.screenY() - 24;
            valid = true;
        } else if (this._data.type === 'actor') {
            const actorIndex = $gameParty.members().findIndex(a => a.actorId() === this._data.targetId);
            if (actorIndex === 0) {
                targetX = $gamePlayer.screenX();
                targetY = $gamePlayer.screenY() - 24;
                valid = true;
            } else if (actorIndex > 0) {
                const follower = $gamePlayer.followers().follower(actorIndex - 1);
                if (follower) {
                    targetX = follower.screenX();
                    targetY = follower.screenY() - 24;
                    valid = true;
                }
            }
        } else if (this._data.type === 'screen') {
            targetX = this._data.x;
            targetY = this._data.y;
            valid = true;
        }

        this.visible = valid;
        if (valid) {
            this.x = targetX;
            this.y = targetY;
            log('Posição final:', this.x, this.y, 'Visible:', this.visible);
        }
    };

    //=======================
    // Spriteset_Map
    //=======================
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this._speechBubbleSprites = new Map();
        log('Spriteset_Map pronto');
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        this.updateSpeechBubbles();
    };

    Spriteset_Map.prototype.updateSpeechBubbles = function() {
        if (!this._speechBubbleSprites) return;
        const bubbles = $gameSystem.getSpeechBubbles();

        this._speechBubbleSprites.forEach((sprite, id) => {
            if (!bubbles.some(b => b.id === id)) {
                if (sprite.parent) sprite.parent.removeChild(sprite);
                this._speechBubbleSprites.delete(id);
                log('Sprite removido ID:', id);
            }
        });

        for (const bubbleData of bubbles) {
            if (!this._speechBubbleSprites.has(bubbleData.id)) {
                const sprite = new Sprite_SpeechBubble(bubbleData);
                this._speechBubbleSprites.set(bubbleData.id, sprite);
                this.addChild(sprite);
                log('Sprite adicionado ao mapa ID:', bubbleData.id);
            }
        }
    };

    log('SPEECH_Bubbles v4.0 carregado');
})();