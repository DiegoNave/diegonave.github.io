/*:
 * @plugindesc PKD_InputVar v2 - sem piscar
 * @help Coloque ABAIXO do PKD_mobilecontrols
 * Var 10=cima, 11=esquerda, 12=direita, 13=baixo
 * Ajuste os IDs se usar outros
 */

(function() {
    const VAR_U = 10;
    const VAR_L = 11;
    const VAR_R = 12;
    const VAR_D = 13;
    
    let lastDir = 0;
    let holdCount = 0;

    const _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        _Game_Player_moveByInput.call(this);
        
        // 1. Pega input do teclado
        let dir = 0;
        if (Input.isPressed('left')) dir = 4;
        else if (Input.isPressed('up')) dir = 8;
        else if (Input.isPressed('right')) dir = 6;
        else if (Input.isPressed('down')) dir = 2;
        
        // 2. Pega input do PKD: se moveu nesse frame, usa a direção
        if (dir === 0 && this.isMoving()) {
            dir = this.direction();
            holdCount = 8; // segura por 8 frames depois do passo
        }
        
        // 3. Se teclado tá pressionado, sempre usa ele
        if (dir !== 0) {
            lastDir = dir;
            holdCount = 8;
        } else if (holdCount > 0) {
            holdCount--;
            dir = lastDir; // segura a última direção
        } else {
            lastDir = 0;
        }
        
        // Seta variáveis
        $gameVariables.setValue(VAR_L, dir === 4 ? 1 : 0);
        $gameVariables.setValue(VAR_U, dir === 8 ? 1 : 0);
        $gameVariables.setValue(VAR_R, dir === 6 ? 1 : 0);
        $gameVariables.setValue(VAR_D, dir === 2 ? 1 : 0);
    };
    
    // Reseta quando abre menu ou cena muda
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.call(this);
        $gameVariables.setValue(VAR_L, 0);
        $gameVariables.setValue(VAR_U, 0);
        $gameVariables.setValue(VAR_R, 0);
        $gameVariables.setValue(VAR_D, 0);
        lastDir = 0;
        holdCount = 0;
    };
})();