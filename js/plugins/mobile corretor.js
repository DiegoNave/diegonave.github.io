/*:
 * @plugindesc Detector + Fix pra PKD_MobileControls v1.1 DEBUG
 * @author Você + Meta AI
 *
 * @param Debug
 * @text Modo Debug
 * @desc Mostra no F8 tudo que o plugin encontra
 * @type boolean
 * @default true
 *
 * @help
 * ====================================
 * MobileControls_Fix v1.1
 * ====================================
 *
 * COLOQUE ABAIXO DO PKD_MobileControls
 *
 * Esse plugin detecta sozinho qual versão do PKD você tem
 * e aplica o fix correto.
 *
 * Abra F8 e me manda o log que aparecer com [MobileControls_Fix]
 */

(function() {
    'use strict';

    const DEBUG = PluginManager.parameters('MobileControls_Fix')['Debug'] === 'true';

    function log(...args) {
        if (DEBUG) console.log('[MobileControls_Fix]',...args);
    }

    function logError(...args) {
        console.error('[MobileControls_Fix ERRO]',...args);
    }

    log('=== INICIANDO DETECTOR ===');

    //=======================
    // Detecta qual versão do PKD existe
    //=======================
    const candidates = [
        'PKD.MC.Controller',
        'PKD.MobileControls.Controller',
        'PKD_MobileControls.Controller',
        '$pkdMobileControls',
        'PKD.MC.DPad',
        'PKD.MobileControls.DPad'
    ];

    let foundController = null;
    let foundPath = '';

    for (let path of candidates) {
        try {
            const parts = path.split('.');
            let obj = window;
            for (let part of parts) {
                obj = obj[part];
                if (!obj) break;
            }
            if (obj) {
                foundController = obj;
                foundPath = path;
                log('ENCONTRADO:', path);
                break;
            }
        } catch (e) {
            // ignora
        }
    }

    if (!foundController) {
        logError('NENHUM CONTROLLER DO PKD ENCONTRADO!');
        logError('Candidatos testados:', candidates);
        logError('SOLUÇÃO: Me manda o PKD_MobileControls.js pra eu ver o nome correto');
        return;
    }

    log('Usando controller:', foundPath);
    log('Métodos disponíveis:', Object.keys(foundController));

    //=======================
    // Guarda estado das teclas simuladas
    //=======================
    const simulatedKeys = {
        left: false,
        up: false,
        right: false,
        down: false,
        ok: false,
        cancel: false
    };

    function simulateKey(key, pressed) {
        if (simulatedKeys[key]!== pressed) {
            simulatedKeys[key] = pressed;
            log('SIMULANDO TECLA:', key, pressed? 'ON' : 'OFF');
        }
    }

    //=======================
    // Injeta no Input
    //=======================
    const _Input_update = Input.update;
    Input.update = function() {
        _Input_update.call(this);
        if (simulatedKeys.left) this._currentState['left'] = true;
        if (simulatedKeys.up) this._currentState['up'] = true;
        if (simulatedKeys.right) this._currentState['right'] = true;
        if (simulatedKeys.down) this._currentState['down'] = true;
        if (simulatedKeys.ok) this._currentState['ok'] = true;
        if (simulatedKeys.cancel) this._currentState['cancel'] = true;
    };

    //=======================
    // Hook genérico - tenta todos os métodos comuns
    //=======================
    let hooked = false;

    // Tentativa 1: buttonPress
    if (foundController.buttonPress) {
        log('Hookando buttonPress...');
        const _buttonPress = foundController.buttonPress;
        foundController.buttonPress = function(button, pressed) {
            _buttonPress.call(this, button, pressed);
            log('buttonPress detectado:', button, pressed);
            mapButton(button, pressed);
        };
        hooked = true;
    }

    // Tentativa 2: onButtonPress
    if (foundController.onButtonPress &&!hooked) {
        log('Hookando onButtonPress...');
        const _onButtonPress = foundController.onButtonPress;
        foundController.onButtonPress = function(button, pressed) {
            _onButtonPress.call(this, button, pressed);
            log('onButtonPress detectado:', button, pressed);
            mapButton(button, pressed);
        };
        hooked = true;
    }

    // Tentativa 3: processDpad
    if (foundController.processDpad &&!hooked) {
        log('Hookando processDpad...');
        const _processDpad = foundController.processDpad;
        foundController.processDpad = function(dir) {
            _processDpad.call(this, dir);
            log('processDpad detectado:', dir);
            // dir: 2=down, 4=left, 6=right, 8=up
            simulateKey('down', dir === 2);
            simulateKey('left', dir === 4);
            simulateKey('right', dir === 6);
            simulateKey('up', dir === 8);
        };
        hooked = true;
    }

    if (!hooked) {
        logError('NENHUM MÉTODO DE HOOK ENCONTRADO!');
        logError('Métodos do controller:', Object.keys(foundController));
    }

    //=======================
    // Mapeia nome do botão pra tecla
    //=======================
    function mapButton(button, pressed) {
        const map = {
            'dpad_left': 'left',
            'dpad_up': 'up',
            'dpad_right': 'right',
            'dpad_down': 'down',
            'left': 'left',
            'up': 'up',
            'right': 'right',
            'down': 'down',
            'button_a': 'ok',
            'action': 'ok',
            'button_b': 'cancel',
            'cancel': 'cancel'
        };

        const key = map[button];
        if (key) {
            simulateKey(key, pressed);
        } else {
            log('Botão não mapeado:', button);
        }
    }

    log('=== DETECTOR FINALIZADO ===');
    if (hooked) {
        log('SUCESSO: Hook aplicado. Testa o dpad mobile agora');
    }
})();