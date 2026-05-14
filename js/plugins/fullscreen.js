/*:
 * @plugindesc Força o jogo a iniciar em tela cheia v1.1 DEBUG
 * @author Você + Meta AI
 *
 * @param Delay
 * @text Delay ms
 * @desc Tempo em ms antes de ativar fullscreen. Aumente se falhar
 * @type number
 * @default 500
 * @min 0
 *
 * @param Force
 * @text Forçar Tentativas
 * @desc Tenta ativar 3x se falhar na primeira
 * @type boolean
 * @default true
 *
 * @param Debug
 * @text Modo Debug
 * @desc Mostra logs no F8
 * @type boolean
 * @default true
 *
 * @help
 * ====================================
 * Auto_Fullscreen v1.1 DEBUG
 * ====================================
 *
 * Debug completo pra descobrir por que não entra em fullscreen.
 *
 * COLOQUE ESTE PLUGIN POR ÚLTIMO NA LISTA
 */

(function() {
    'use strict';

    const params = PluginManager.parameters('Auto_Fullscreen');
    const delay = Number(params['Delay'] || 500);
    const forceRetries = params['Force'] === 'true';
    const DEBUG = params['Debug'] === 'true';

    let attemptCount = 0;
    const maxAttempts = 3;

    function log(...args) {
        if (DEBUG) console.log('[Auto_Fullscreen]',...args);
    }

    function logError(...args) {
        console.error('[Auto_Fullscreen ERRO]',...args);
    }

    function isNwjs() {
        const nwjs = typeof require === 'function' && typeof process === 'object';
        log('isNwjs:', nwjs);
        return nwjs;
    }

    function requestFullscreen() {
        attemptCount++;
        log('=== Tentativa', attemptCount + '/' + maxAttempts, '===');
        log('Graphics._isFullScreen():', Graphics._isFullScreen());
        log('Graphics._canvas:', Graphics._canvas? 'existe' : 'NULL');
        log('document.fullscreenEnabled:', document.fullscreenEnabled);
        log('document.webkitFullscreenEnabled:', document.webkitFullscreenEnabled);

        if (Graphics._isFullScreen()) {
            log('SUCESSO: Já está em tela cheia');
            return true;
        }

        if (!Graphics._canvas) {
            logError('FALHA: Canvas não existe ainda');
            return false;
        }

        try {
            log('Chamando Graphics._requestFullScreen()...');
            Graphics._requestFullScreen();
            
            // Verifica após 200ms se realmente entrou
            setTimeout(function() {
                log('Status após 200ms:', Graphics._isFullScreen()? 'FULLSCREEN OK' : 'AINDA EM JANELA');
                
                if (!Graphics._isFullScreen() && forceRetries && attemptCount < maxAttempts) {
                    log('Tentando novamente em 500ms...');
                    setTimeout(requestFullscreen, 500);
                } else if (!Graphics._isFullScreen()) {
                    logError('FALHA FINAL: Navegador bloqueou fullscreen automático');
                    logError('SOLUÇÃO: Só funciona no.exe ou após clique do usuário');
                }
            }, 200);

            return true;

        } catch (e) {
            logError('EXCEÇÃO ao solicitar fullscreen:', e);
            logError('Stack:', e.stack);
            return false;
        }
    }

    //=======================
    // Hook no SceneManager
    //=======================
    const _SceneManager_run = SceneManager.run;
    SceneManager.run = function(sceneClass) {
        log('=== SceneManager.run ===');
        log('Scene class:', sceneClass.name);
        _SceneManager_run.call(this, sceneClass);
    };

    //=======================
    // Hook no Boot
    //=======================
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        log('=== Scene_Boot.start ===');
        log('isNwjs:', isNwjs());
        log('Delay configurado:', delay + 'ms');
        
        _Scene_Boot_start.call(this);

        log('Agendando fullscreen em', delay + 'ms...');
        setTimeout(function() {
            requestFullscreen();
        }, delay);
    };

    //=======================
    // Hook pra detectar F4 manual
    //=======================
    const _Graphics__switchFullScreen = Graphics._switchFullScreen;
    Graphics._switchFullScreen = function() {
        log('>>> F4 pressionado manualmente');
        _Graphics__switchFullScreen.call(this);
        setTimeout(function() {
            log('Estado após F4:', Graphics._isFullScreen()? 'Fullscreen' : 'Janela');
        }, 100);
    };

    log('Plugin carregado. Aguardando Scene_Boot...');
})();