/*:
 * @plugindesc PKD_InputBridge - faz PKD ativar Input.isPressed
 * @author Você + Meta AI
 * @help Coloque ABAIXO do PKD_mobilecontrols
 */

(function() {
    const _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        _Game_Player_executeMove.call(this, direction);
        
        // Limpa todas
        Input._currentState['left'] = false;
        Input._currentState['up'] = false;
        Input._currentState['right'] = false;
        Input._currentState['down'] = false;
        
        // Seta a atual
        if (direction === 4) Input._currentState['left'] = true;
        if (direction === 8) Input._currentState['up'] = true;
        if (direction === 6) Input._currentState['right'] = true;
        if (direction === 2) Input._currentState['down'] = true;
    };
    
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(active) {
        _Game_Player_update.call(this, active);
        // Se parou de mover, limpa
        if (!this.isMoving() && !this.isMoveRouteForcing()) {
            Input._currentState['left'] = false;
            Input._currentState['up'] = false;
            Input._currentState['right'] = false;
            Input._currentState['down'] = false;
        }
    };
})();