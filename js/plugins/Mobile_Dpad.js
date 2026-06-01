/*:
 * @plugindesc Dpad mobile v2.7 - simula teclado + bloqueia touch mapa
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
 * @param Disable Map Touch
 * @text Desativar Touch Mapa
 * @desc ON = clique no mapa não move personagem
 * @type boolean
 * @default true
 *
 * @param Debug
 * @text Debug F8
 * @type boolean
 * @default true
 *
 * @help
 * ====================================
 * Mobile_Dpad v2.7
 * ====================================
 *
 * BUGFIX v2.7:
 * - Remove chamada de _onKeyDown que crashava
 * - Seta _currentState direto igual teclado
 * - Desativa touch do mapa completamente
 *
 * PC: usa teclado normal
 * Mobile: usa dpad que simula teclado
 */

(function() {
    'use strict';

    const params = PluginManager.parameters('Mobile_Dpad');
    const DPAD_SIZE = Number(params['Dpad Size'] || 200);
    const BTN_SIZE = Number(params['Btn Size'] || 80);
    const OPACITY = Number(params['Opacity'] || 180);
    const DPAD_POS = params['Dpad Pos'] || 'left';
    const MARGIN = Number(params['Margin'] || 40);
    const DISABLE_MAP_TOUCH = params['Disable Map Touch']!== 'false';
    const DEBUG = params['Debug'] === 'true';

    function log(...args) {
        if (DEBUG) console.log('[Mobile_Dpad]',...args);
    }

    log('v2.7 carregado');

    //=======================
    // BUGFIX v2.7: Desativa touch do mapa
    //=======================
    if (DISABLE_MAP_TOUCH) {
        Scene_Map.prototype.processMapTouch = function() {};
        
        Game_Player.prototype.canMove = function() {
            if (TouchInput.isPressed() &&!this.isInVehicle()) {
                // Ignora movimento por touch no mapa
                return false;
            }
            return $gameSystem.isMenuEnabled() &&!$gameMap.isEventRunning();
        };
        
        log('Touch do mapa desativado');
    }

    //=======================
    // BUGFIX v2.7: Simula tecla sem crash
    //=======================
    const vKeys = {
        left: false,
        up: false,
        right: false,
        down: false,
        ok: false,
        cancel: false
    };

    const touchMap = {
        dpad: null,
        ok: null,
        cancel: null
    };

    function pressVKey(key, touchId) {
        if (!vKeys[key]) {
            vKeys[key] = true;
            Input._currentState[key] = true;
            log('KEY', key, 'PRESS', touchId || '');
        }
    }

    function releaseVKey(key) {
        if (vKeys[key]) {
            vKeys[key] = false;
            Input._currentState[key] = false;
            log('KEY', key, 'RELEASE');
        }
    }

    // Hook no touchend pra garantir release
    document.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('touchcancel', handleTouchEnd, false);

    function handleTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const id = e.changedTouches[i].identifier;
            
            if (touchMap.dpad === id) {
                log('Touch dpad SOLTOU');
                touchMap.dpad = null;
                releaseVKey('left');
                releaseVKey('up');
                releaseVKey('right');
                releaseVKey('down');
            }
            
            if (touchMap.ok === id) {
                touchMap.ok = null;
                releaseVKey('ok');
            }
            
            if (touchMap.cancel === id) {
                touchMap.cancel = null;
                releaseVKey('cancel');
            }
        }
    }

    //=======================
    // Garante que tecla fica true todo frame
    //=======================
    const _Input_update = Input.update;
    Input.update = function() {
        _Input_update.call(this);

        // Força teclas virtuais depois do clear
        for (const key in vKeys) {
            if (vKeys[key]) {
                this._currentState[key] = true;
            }
        }
    };

    const _Input_clear = Input.clear;
    Input.clear = function() {
        _Input_clear.call(this);
        for (const key in vKeys) {
            if (vKeys[key]) releaseVKey(key);
        }
        touchMap.dpad = null;
        touchMap.ok = null;
        touchMap.cancel = null;
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
        this._currentDirs = { left: false, up: false, right: false, down: false };
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

        ctx.fillStyle = 'white';
        const s = r * 0.35;
        [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
            ctx.beginPath();
            const x = cx + dx * (r - 15);
            const y = cy + dy * (r - 15);
            if (dx === 0) {
                ctx.moveTo(x, y);
                ctx.lineTo(x - s, y - dy * s);
                ctx.lineTo(x + s, y - dy * s);
            } else {
                ctx.moveTo(x, y);
                ctx.lineTo(x - dx * s, y - s);
                ctx.lineTo(x - dx * s, y + s);
            }
            ctx.closePath();
            ctx.fill();
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

    Sprite_Dpad.prototype.updateInput = function() {
        if (!this.visible) {
            this.releaseAll();
            return;
        }

        let foundTouch = null;
        const touches = TouchInput._touches || [];

        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            if (!touch) continue;
            
            const pos = new Point(touch.pageX, touch.pageY);
            const local = this.worldTransform.applyInverse(pos);
            
            if (this.isInside(local.x, local.y)) {
                foundTouch = touch;
                break;
            }
        }

        if (foundTouch) {
            if (touchMap.dpad === null) {
                touchMap.dpad = foundTouch.identifier;
                log('Touch dpad INICIOU');
            }
            const local = this.worldTransform.applyInverse(new Point(foundTouch.pageX, foundTouch.pageY));
            this.processTouch(local.x, local.y);
        } else if (touchMap.dpad!== null) {
            this.releaseAll();
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
            this.releaseAll();
            return;
        }

        const deg = Math.atan2(dy, dx) * 180 / Math.PI;
        const newDirs = { left: false, up: false, right: false, down: false };

        if (deg >= -45 && deg < 45) newDirs.right = true;
        else if (deg >= 45 && deg < 135) newDirs.down = true;
        else if (deg >= 135 || deg < -135) newDirs.left = true;
        else if (deg >= -135 && deg < -45) newDirs.up = true;

        for (const dir in newDirs) {
            if (newDirs[dir] &&!this._currentDirs[dir]) {
                this._currentDirs[dir] = true;
                pressVKey(dir, touchMap.dpad);
            } else if (!newDirs[dir] && this._currentDirs[dir]) {
                this._currentDirs[dir] = false;
                releaseVKey(dir);
            }
        }
    };

    Sprite_Dpad.prototype.releaseAll = function() {
        if (touchMap.dpad!== null) {
            log('Touch dpad SOLTOU');
            touchMap.dpad = null;
        }
        for (const dir in this._currentDirs) {
            if (this._currentDirs[dir]) {
                this._currentDirs[dir] = false;
                releaseVKey(dir);
            }
        }
    };

    //=======================
    // Sprite Botão
    //=======================
    function Sprite_Button() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Button.prototype = Object.create(Sprite.prototype);
    Sprite_Button.prototype.constructor = Sprite_Button;

    Sprite_Button.prototype.initialize = function(keyName, label, color, index) {
        Sprite.prototype.initialize.call(this);
        this._keyName = keyName;
        this._label = label;
        this._color = color;
        this._index = index;
        this._touchId = null;
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
        ctx.strokeStyle = 'white';
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
        const isRight = DPAD_POS === 'left';
        const baseX = isRight? Graphics.width - BTN_SIZE - MARGIN : MARGIN;
        const offset = this._index * (BTN_SIZE + 20);
        this.x = isRight? baseX - offset : baseX + offset;
        this.y = Graphics.height - BTN_SIZE - MARGIN;
    };

    Sprite_Button.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updatePosition();
        this.updateInput();
        this.visible = SceneManager._scene instanceof Scene_Map;
        this.scale.set(this._touchId!== null? 0.85 : 1.0);
    };

    Sprite_Button.prototype.updateInput = function() {
        if (!this.visible) {
            this.release();
            return;
        }

        let foundTouch = null;
        const touches = TouchInput._touches || [];

        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            if (!touch) continue;
            
            const pos = new Point(touch.pageX, touch.pageY);
            const local = this.worldTransform.applyInverse(pos);
            const dx = local.x - BTN_SIZE / 2;
            const dy = local.y - BTN_SIZE / 2;
            
            if (Math.sqrt(dx * dx + dy * dy) <= BTN_SIZE / 2) {
                foundTouch = touch;
                break;
            }
        }

        if (foundTouch) {
            if (this._touchId === null) {
                this._touchId = foundTouch.identifier;
                touchMap[this._keyName] = foundTouch.identifier;
                pressVKey(this._keyName, this._touchId);
            }
        } else {
            this.release();
        }
    };

    Sprite_Button.prototype.release = function() {
        if (this._touchId!== null) {
            this._touchId = null;
            touchMap[this._keyName] = null;
            releaseVKey(this._keyName);
        }
    };

    //=======================
    // Injeta na Scene_Map
    //=======================
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this._mobileDpad = new Sprite_Dpad();
        this._mobileBtnA = new Sprite_Button('ok', 'A', 'rgba(0, 200, 0, 0.6)', 0);
        this._mobileBtnB = new Sprite_Button('cancel', 'B', 'rgba(200, 0, 0, 0.6)', 1);
        this.addChild(this._mobileDpad);
        this.addChild(this._mobileBtnA);
        this.addChild(this._mobileBtnB);
        log('UI criada');
    };

})();