/*:
 * @plugindesc Dpad mobile standalone v2.4 - simula teclas reais
 * @author Você + Meta AI
 *
 * @param Dpad Size
 * @text Tamanho Dpad
 * @type number
 * @default 200
 *
 * @param Btn Size
 * @text Tamanho Botões
 * @type number
 * @default 80
 *
 * @param Opacity
 * @text Opacidade
 * @type number
 * @default 180
 * @max 255
 *
 * @param Dpad Pos
 * @text Lado Dpad
 * @type select
 * @option Esquerda
 * @value left
 * @option Direita
 * @value right
 * @default left
 *
 * @param Margin
 * @text Margem
 * @type number
 * @default 40
 *
 * @param Debug
 * @text Debug F8
 * @type boolean
 * @default true
 *
 * @help
 * ====================================
 * Mobile_Dpad v2.4
 * ====================================
 *
 * BUGFIX v2.4:
 * 1. Injeta tecla ANTES do Input.update limpar
 * 2. Corrige detecção de touch no PC e mobile
 * 3. Adiciona Input.isTriggered() e isRepeated()
 *
 * Simula: left, up, right, down, ok, cancel
 * Compatível com eventos que usam Input.isPressed()
 *
 * NÃO USA PKD. É standalone.
 */

(function() {
    'use strict';

    const params = PluginManager.parameters('Mobile_Dpad');
    const DPAD_SIZE = Number(params['Dpad Size'] || 200);
    const BTN_SIZE = Number(params['Btn Size'] || 80);
    const OPACITY = Number(params['Opacity'] || 180);
    const DPAD_POS = params['Dpad Pos'] || 'left';
    const MARGIN = Number(params['Margin'] || 40);
    const DEBUG = params['Debug'] === 'true';

    function log(...args) {
        if (DEBUG) console.log('[Mobile_Dpad]',...args);
    }

    log('v2.4 carregado - Dpad:', DPAD_POS, '| Botões:', DPAD_POS === 'left'? 'right' : 'left');

    //=======================
    // BUGFIX v2.4: Estado global das teclas
    //=======================
    const virtualKeys = {
        left: false,
        up: false,
        right: false,
        down: false,
        ok: false,
        cancel: false
    };

    function setVirtualKey(key, pressed) {
        if (virtualKeys[key]!== pressed) {
            virtualKeys[key] = pressed;
            log('KEY', key, pressed? 'PRESS' : 'RELEASE');
        }
    }

    //=======================
    // BUGFIX v2.4: Injeta ANTES do MV limpar
    //=======================
    const _Input_update = Input.update;
    Input.update = function() {
        // Primeiro injeta nossas teclas
        for (const key in virtualKeys) {
            if (virtualKeys[key]) {
                this._currentState[key] = true;
            }
        }

        // Depois roda o update do MV
        _Input_update.call(this);

        // BUGFIX: Garante que tecla continua true após MV limpar
        for (const key in virtualKeys) {
            if (virtualKeys[key]) {
                this._currentState[key] = true;
            }
        }
    };

    const _Input_clear = Input.clear;
    Input.clear = function() {
        _Input_clear.call(this);
        for (const key in virtualKeys) {
            virtualKeys[key] = false;
        }
    };

    //=======================
    // Sprite Dpad
    //=======================
    function Sprite_Dpad() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Dpad.prototype = Object.create(Sprite.prototype);
    Sprite_Dpad.prototype.constructor = Sprite_Dpad;

    Sprite_Dpad.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this.opacity = OPACITY;
        this._activeDirs = { left: false, up: false, right: false, down: false };
        this.updatePosition();
    };

    Sprite_Dpad.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(DPAD_SIZE, DPAD_SIZE);
        const ctx = this.bitmap._context;
        const cx = DPAD_SIZE / 2;
        const cy = DPAD_SIZE / 2;
        const r = DPAD_SIZE / 2 - 10;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        const s = r * 0.35;
        // Desenha 4 setas
        [[0, -1, 0], [0, 1, Math.PI], [-1, 0, -Math.PI / 2], [1, 0, Math.PI / 2]].forEach(([dx, dy, rot]) => {
            ctx.save();
            ctx.translate(cx + dx * (r - 15), cy + dy * (r - 15));
            ctx.rotate(rot);
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(-s, s);
            ctx.lineTo(s, s);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });

        this.bitmap._setDirty();
    };

    Sprite_Dpad.prototype.updatePosition = function() {
        this.x = DPAD_POS === 'left'? MARGIN : Graphics.width - DPAD_SIZE - MARGIN;
        this.y = Graphics.height - DPAD_SIZE - MARGIN;
    };

    Sprite_Dpad.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updatePosition();
        this.updateInput();
        this.visible = SceneManager._scene instanceof Scene_Map;
    };

    // BUGFIX v2.4: Detecção de touch corrigida
    Sprite_Dpad.prototype.updateInput = function() {
        if (!this.visible) {
            this.clearKeys();
            return;
        }

        let foundTouch = false;

        // Checa TouchInput.x/y primeiro
        if (TouchInput.isPressed()) {
            const pos = new Point(TouchInput.x, TouchInput.y);
            const local = this.worldTransform.applyInverse(pos);
            if (this.isInside(local.x, local.y)) {
                foundTouch = true;
                this.processTouch(local.x, local.y);
            }
        }

        // BUGFIX: Checa _touches se existir
        if (!foundTouch && TouchInput._touches) {
            for (let i = 0; i < TouchInput._touches.length; i++) {
                const touch = TouchInput._touches[i];
                const pos = new Point(touch.pageX, touch.pageY);
                const local = this.worldTransform.applyInverse(pos);
                if (this.isInside(local.x, local.y)) {
                    foundTouch = true;
                    this.processTouch(local.x, local.y);
                    break;
                }
            }
        }

        if (!foundTouch) {
            this.clearKeys();
        }
    };

    Sprite_Dpad.prototype.isInside = function(x, y) {
        const dx = x - DPAD_SIZE / 2;
        const dy = y - DPAD_SIZE / 2;
        return Math.sqrt(dx * dx + dy * dy) <= DPAD_SIZE / 2;
    };

    Sprite_Dpad.prototype.processTouch = function(x, y) {
        const cx = DPAD_SIZE / 2;
        const cy = DPAD_SIZE / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < DPAD_SIZE * 0.15) {
            this.clearKeys();
            return;
        }

        const deg = Math.atan2(dy, dx) * 180 / Math.PI;
        const newDirs = { left: false, up: false, right: false, down: false };

        if (deg >= -45 && deg < 45) newDirs.right = true;
        else if (deg >= 45 && deg < 135) newDirs.down = true;
        else if (deg >= 135 || deg < -135) newDirs.left = true;
        else if (deg >= -135 && deg < -45) newDirs.up = true;

        for (const dir in newDirs) {
            if (newDirs[dir]!== this._activeDirs[dir]) {
                this._activeDirs[dir] = newDirs[dir];
                setVirtualKey(dir, newDirs[dir]);
            }
        }
    };

    Sprite_Dpad.prototype.clearKeys = function() {
        for (const dir in this._activeDirs) {
            if (this._activeDirs[dir]) {
                this._activeDirs[dir] = false;
                setVirtualKey(dir, false);
            }
        }
    };

    //=======================
    // Botões A e B
    //=======================
    function Sprite_Button() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Button.prototype = Object.create(Sprite.prototype);
    Sprite_Button.prototype.constructor = Sprite_Button;

    Sprite_Button.prototype.initialize = function(keyName, label, color) {
        Sprite.prototype.initialize.call(this);
        this._keyName = keyName;
        this._label = label;
        this._color = color;
        this._touching = false;
        this.createBitmap();
        this.opacity = OPACITY;
        this.updatePosition();
    };

    Sprite_Button.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(BTN_SIZE, BTN_SIZE);
        const ctx = this.bitmap._context;
        const r = BTN_SIZE / 2 - 5;

        ctx.beginPath();
        ctx.arc(BTN_SIZE / 2, BTN_SIZE / 2, r, 0, Math.PI * 2);
        ctx.fillStyle = this._color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold ' + (BTN_SIZE * 0.5) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this._label, BTN_SIZE / 2, BTN_SIZE / 2);
        this.bitmap._setDirty();
    };

    Sprite_Button.prototype.updatePosition = function() {
        const isLeft = DPAD_POS === 'right';
        const baseX = isLeft? MARGIN : Graphics.width - BTN_SIZE - MARGIN;
        const offset = this._keyName === 'cancel'? BTN_SIZE + 20 : 0;
        
        this.x = isLeft? baseX + offset : baseX - offset;
        this.y = Graphics.height - BTN_SIZE - MARGIN;
    };

    Sprite_Button.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updatePosition();
        this.updateInput();
        this.visible = SceneManager._scene instanceof Scene_Map;
        this.scale.set(this._touching? 0.85 : 1.0);
    };

    Sprite_Button.prototype.updateInput = function() {
        if (!this.visible) {
            this.release();
            return;
        }

        let touching = false;

        if (TouchInput.isPressed()) {
            const pos = new Point(TouchInput.x, TouchInput.y);
            const local = this.worldTransform.applyInverse(pos);
            const dx = local.x - BTN_SIZE / 2;
            const dy = local.y - BTN_SIZE / 2;
            touching = Math.sqrt(dx * dx + dy * dy) <= BTN_SIZE / 2;
        }

        if (touching &&!this._touching) {
            this._touching = true;
            setVirtualKey(this._keyName, true);
        } else if (!touching && this._touching) {
            this.release();
        }
    };

    Sprite_Button.prototype.release = function() {
        if (this._touching) {
            this._touching = false;
            setVirtualKey(this._keyName, false);
        }
    };

    //=======================
    // Injeta na Scene_Map
    //=======================
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this._mobileDpad = new Sprite_Dpad();
        this._mobileBtnA = new Sprite_Button('ok', 'A', 'rgba(0, 200, 0, 0.6)');
        this._mobileBtnB = new Sprite_Button('cancel', 'B', 'rgba(200, 0, 0, 0.6)');
        this.addChild(this._mobileDpad);
        this.addChild(this._mobileBtnA);
        this.addChild(this._mobileBtnB);
        log('UI criada');
    };

})();