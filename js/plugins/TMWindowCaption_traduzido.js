//============================================== ==============================
// TMVplugin – legenda da janela
// Autor: tomoaky (http://hikimoki.sakura.ne.jp/)
// Versão: 0.31b
// Última atualização: 04/03/2016
//============================================== ==============================

/*:
 * @plugindesc Adiciona uma legenda no canto superior esquerdo da janela.
 * Você pode usar caracteres de controle para alterar a posição da legenda para outra que não seja o canto superior esquerdo.
 *
 * @autor tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param legendaShiftX
 * @desc Valor de correção da coordenada X da legenda
 * Padrão: 18
 * @padrão 18
 *
 * @param largura da legenda
 * @desc Largura máxima da legenda
 *Valor inicial: 320
 * @padrão 320
 *
 * @param captionFontFace
 * @desc Fonte a ser usada nas legendas
 * Valor padrão: GameFont
 * @default GameFont
 *
 * @param captionFontSize
 * @desc Tamanho da fonte da legenda
 * Padrão: 18
 * @padrão 18
 *
 * @param mensagemCaptionFontSize
 * @desc Tamanho da fonte da legenda da janela da mensagem
 * Valor padrão: 28
 * @padrão 28
 *
 * @param captionFontColor
 * @desc Cor do texto da legenda
 *Valor inicial: 15
 * @padrão 15
 *
 * @param captionOutlineWidth
 * @desc Largura da borda da legenda
 *Valor inicial: 4
 * @padrão 4
 *
 * @param captionOutlineColor
 * @desc Cor da borda da legenda
 * Valor padrão: 8
 * @padrão 8
 *
 * @param legendaAjuda
 * @desc Legenda Window_Help
 * Padrão: Ajuda
 * @default ajuda
 *
 * @param legendaGold
 * @desc Legenda Window_Gold
 *Valor inicial: Dinheiro em mãos
 * @default dinheiro que você tem
 *
 * @param captionMenuCommand
 * @desc Legenda Window_MenuCommand
 * Valor inicial: comando
 * @default comando
 *
 * @param captionMenuStatus
 * @desc Legenda Window_MenuStatus
 * Valor padrão: Status
 * @status padrão
 *
 * @param captionMenuActor
 * @desc Legenda Window_MenuActor
 * Padrão: seleção de personagem
 * seleção de caracteres @default
 *
 * @param captionItemCategory
 * @desc Legenda Window_ItemCategory
 * Padrão: Categoria
 * @categoria padrão
 *
 * @param captionItemList_item
 * @desc Legenda Window_ItemList (categoria do item)
 * Padrão: Item
 * @item padrão
 *
 * @param captionItemList_weapon
 * @desc Legenda Window_ItemList (categoria de arma)
 * Padrão: Arma
 * @arma padrão
 *
 * @param captionItemList_armor
 * @desc Legenda Window_ItemList (categoria Armadura)
 * Padrão: Armadura
 * @armadura padrão
 *
 * @param captionItemList_keyItem
 * @desc Caption Window_ItemList (categoria de itens importantes)
 * Padrão: Importante
 * @default Algo importante
 *
 * @param legendaSkillType
 * @desc Legenda Window_SkillType
 * Padrão: tipo de habilidade
 * @default tipo de habilidade
 *
 * @param captionSkillStatus
 * @desc Legenda Window_SkillStatus
 * Valor padrão: Status
 * @status padrão
 *
 * @param legendaSkillList
 * @desc Legenda Window_SkillList
 * Valor padrão: \WCL (Este parâmetro é para adicionar caracteres de controle)
 * @default \WCL
 *
 * @param captionEquipStatus
 * @desc Legenda Window_EquipStatus
 * Valor padrão: Status
 * @status padrão
 *
 * @param captionEquipCommand
 * @desc Legenda Window_EquipCommand
 * Valor inicial: comando
 * @default comando
 *
 * @param legendaEquipSlot
 * @desc Legenda Window_EquipSlot
 * Padrão: Equipamento
 * @equipamento padrão
 *
 * @param captionEquipItem
 * @desc Legenda Window_EquipItem
 * Valor padrão: \WCL (Este parâmetro é para adicionar caracteres de controle)
 * @default \WCL
 *
 * @param status da legenda
 * @desc Legenda Window_Status
 * Valor padrão: Status
 * @status padrão
 *
 * @param captionOptions
 * @desc Legenda Window_Options
 * Padrão: Opcional
 * @opção padrão
 *
 * @param legendaSavefileList
 * @desc Legenda Window_SavefileList
 * Padrão: Salvar arquivo
 * @default salvar arquivo
 *
 * @param captionShopCommand
 * @desc Legenda Window_ShopCommand
 * Valor inicial: comando
 * @default comando
 *
 * @param legendaShopBuy
 * @desc Legenda Window_ShopBuy
 *Valor padrão: Produto
 * @produto padrão
 *
 * @param legendaShopNumber
 * @desc Legenda Window_ShopNumber
 * Valor padrão: seleção de quantidade
 * @default seleção de quantidade
 *
 * @param captionShopStatus
 * @desc Legenda Window_ShopStatus
 * Valor padrão: Status
 * @status padrão
 ** @param captionNameEditar
 * @desc Legenda Window_NameEditar
 * Padrão: Nome
 * @nome padrão
 *
 * @param legendaNomeInput
 * @desc Legenda Window_NameInput
 * Valor padrão: entrada de caracteres
 * entrada de caracteres @default
 *
 * @param captionChoiceList
 * @desc Legenda Window_ChoiceList
 * Padrão: Escolhas
 * @escolha padrão
 *
 * @param captionNumberInput
 * @desc Legenda Window_NumberInput
 * Valor padrão: entrada numérica
 * @default Entrada numérica
 *
 * @param captionEventItem
 * @desc Legenda Window_EventItem (item normal)
 * Padrão: Item
 * @item padrão
 *
 * @param captionEventItem_key
 * @desc Legenda Window_EventItem (importante)
 * Padrão: Importante
 * @default Algo importante
 *
 * @param captionEventItem_A
 * @desc Legenda Window_EventItem (item A oculto)
 * Padrão: item oculto A
 * @default Item oculto A
 *
 * @param captionEventItem_B
 * @desc Legenda Window_EventItem (item oculto B)
 * Padrão: item oculto B
 * @default Item oculto B
 *
 * @param legendaPartyCommand
 * @desc Legenda Window_PartyCommand
 * Valor inicial: comando
 * @default comando
 *
 * @param captionActorCommand
 * @desc Legenda Window_ActorCommand
 * Valor inicial: comando
 * @default comando
 *
 * @param captionBattleStatus
 * @desc Legenda Window_BattleStatus
 * Valor padrão: Status
 * @status padrão
 *
 * @param legendaBattleActor
 * @desc Legenda Window_BattleActor
 * Padrão: seleção de personagem
 * seleção de caracteres @default
 *
 * @param legendaBattleEnemy
 * @desc Legenda Window_BattleEnemy
 * Padrão: seleção de inimigo
 * @default seleção de inimigos
 *
 * @param legendaBattleSkill
 * @desc Legenda Window_BattleSkill
 * Valor padrão: Habilidade
 * @default habilidade
 *
 * @param captionBattleItem
 * @desc Legenda Window_BattleItem
 * Padrão: Item
 * @item padrão
 *
 * @param captionTitleCommand
 * @desc Legenda Window_TitleCommand
 * Valor inicial: comando
 * @default comando
 *
 * @param legendaGameEnd
 * @desc Legenda Window_GameEnd
 * Valor inicial: comando
 * @default comando
 *
 * @requiredAssets img/system/TMWindowCaption
 * @requiredAssets img/system/TMWindowCaptionVR
 *
 * @ajuda
 * Por favor coloque a imagem TMWindowCaption.png na pasta img/system,
 * Crie um quadro de legenda baseado nesta imagem.
 * O tamanho da imagem é 48*32, 16 pontos à esquerda e à direita são as duas extremidades da legenda,
 * Os 16 pontos centrais serão ampliados conforme necessário para formar a parte central da legenda.
 *
 * Para que o nome da fonte seja definido em captionFontFace, defina fonts/gamefont.css antecipadamente.
 *Precisa ser editado e adicionado.
 * Copie e cole todo o GameFont que foi originalmente configurado (4 linhas),
 * família de fontes: nome da fonte;
 * src: url("nome do arquivo da fonte");
 * Por favor, reescreva as duas linhas acima. (Finalmente, haverá 8 linhas)
 * Depois de editar gamefont.css, use o mesmo nome do ``nome do arquivo de fonte'' que você definiu.
 *Coloque o arquivo da fonte na pasta de fontes e coloque-o em captionFontFace
 * Por favor, defina o "nome da fonte".
 *
 * Se o nome do arquivo da fonte contiver caracteres de 2 bytes, como caracteres japoneses,
 *Erros podem ocorrer.
 *
 * captionFontColor e captionOutlineColor são os caracteres de controle \C[n] e
 *Especifique o mesmo número de cor.
 *
 * Deixe o parâmetro vazio para janelas onde não deseja exibir legendas.
 *
 *A lista de habilidades e a lista de itens de cena de equipamento são respectivamente
 *O nome do tipo de habilidade e o nome do tipo de equipamento serão definidos automaticamente.
 * Parâmetros ao utilizar caracteres de controle para alterar a posição da legenda
 *
 * Personagens de controle:
 * \WC[string] # Se você escrever esse caractere de controle no comando de exibição de texto,
 * Legenda da janela de mensagem
 * Pode ser alterado para a string especificada.
 *
 * Caracteres de controle (para legendas):
 * \WCVR # Vire a legenda verticalmente e cubra a janela.
 * agora será exibido.
 * \WCC # Define a posição horizontal da legenda para o centro da janela.
 * \WCL # Define a posição horizontal da legenda na borda esquerda da janela.
 * \WCR # Define a posição horizontal da legenda na borda direita da janela.
 * \WCB # Define a posição vertical da legenda na borda inferior da janela.
 *
 * Além disso, os seguintes caracteres de controle podem ser usados ​​nas legendas.
 * \\
 *\V[n]
 *\N[n]
 *\P[n]
 *\G
 *
 * Não há comandos de plugin.
 *
 */

var Imported = Imported || {};
Imported.TMWindowCaption = true;

(function() {

  var parameters = PluginManager.parameters('TMWindowCaption');
  var captionShiftX    = Number(parameters['captionShiftX']);
  var captionWidth     = Number(parameters['captionWidth']);
  var captionFontFace  = parameters['captionFontFace'];
  var captionFontSize  = Number(parameters['captionFontSize']);
  var messageCaptionFontSize = Number(parameters['messageCaptionFontSize']);
  var captionFontColor = parameters['captionFontColor'];
  var captionOutlineWidth = Number(parameters['captionOutlineWidth']);
  var captionOutlineColor = parameters['captionOutlineColor'];
  var captionHelp             = parameters['captionHelp'];
  var captionGold             = parameters['captionGold'];
  var captionMenuCommand      = parameters['captionMenuCommand'];
  var captionMenuStatus       = parameters['captionMenuStatus'];
  var captionMenuActor        = parameters['captionMenuActor'];
  var captionItemCategory     = parameters['captionItemCategory'];
  var captionItemList_item    = parameters['captionItemList_item'];
  var captionItemList_weapon  = parameters['captionItemList_weapon'];
  var captionItemList_armor   = parameters['captionItemList_armor'];
  var captionItemList_keyItem = parameters['captionItemList_keyItem'];
  var captionSkillType        = parameters['captionSkillType'];
  var captionSkillStatus      = parameters['captionSkillStatus'];
  var captionSkillList        = parameters['captionSkillList'];
  var captionEquipStatus      = parameters['captionEquipStatus'];
  var captionEquipCommand     = parameters['captionEquipCommand'];
  var captionEquipSlot        = parameters['captionEquipSlot'];
  var captionEquipItem        = parameters['captionEquipItem'];
  var captionStatus           = parameters['captionStatus'];
  var captionOptions          = parameters['captionOptions'];
  var captionSavefileList     = parameters['captionSavefileList'];
  var captionShopCommand      = parameters['captionShopCommand'];
  var captionShopBuy          = parameters['captionShopBuy'];
  var captionShopNumber       = parameters['captionShopNumber'];
  var captionShopStatus       = parameters['captionShopStatus'];
  var captionNameEdit         = parameters['captionNameEdit'];
  var captionNameInput        = parameters['captionNameInput'];
  var captionChoiceList       = parameters['captionChoiceList'];
  var captionNumberInput      = parameters['captionNumberInput'];
  var captionEventItem        = parameters['captionEventItem'];
  var captionEventItem_key    = parameters['captionEventItem_key'];
  var captionEventItem_A      = parameters['captionEventItem_A'];
  var captionEventItem_B      = parameters['captionEventItem_B'];
  var captionPartyCommand     = parameters['captionPartyCommand'];
  var captionActorCommand     = parameters['captionActorCommand'];
  var captionBattleStatus     = parameters['captionBattleStatus'];
  var captionBattleActor      = parameters['captionBattleActor'];
  var captionBattleEnemy      = parameters['captionBattleEnemy'];
  var captionBattleSkill      = parameters['captionBattleSkill'];
  var captionBattleItem       = parameters['captionBattleItem'];
  var captionTitleCommand     = parameters['captionTitleCommand'];
  var captionGameEnd          = parameters['captionGameEnd'];
  
  //-----------------------------------------------------------------------------
  // Sprite_WindowCaption
  //

  function Sprite_WindowCaption() {
    this.initialize.apply(this, arguments);
  }

  Sprite_WindowCaption.prototype = Object.create(Sprite.prototype);
  Sprite_WindowCaption.prototype.constructor = Sprite_WindowCaption;

  Sprite_WindowCaption.prototype.initialize = function(subjectWindow) {
    Sprite.prototype.initialize.call(this);
    this._subjectWindow = subjectWindow;
    this.bitmap = new Bitmap(captionWidth, this._subjectWindow.captionFontSize() +
                                           captionOutlineWidth * 2);
    this.bitmap.fontFace = captionFontFace;
    this._captionText  = '';
    this._captionWidth = 0;
  };
  
  Sprite_WindowCaption.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._subjectWindow) {
      var captionText = this._subjectWindow.captionText();
      if (this._captionText !== captionText) {
        this._captionText = captionText;
        this.refresh();
      }
      if (this._captionText) {
        if (this._captionAlign === 'left') {
          this.x = this._subjectWindow.parent.x + this._subjectWindow.x +
                   captionShiftX;
        } else if (this._captionAlign === 'right') {
          this.x = this._subjectWindow.parent.x + this._subjectWindow.x +
                   this._subjectWindow.width - this._captionWidth - captionShiftX;
        } else {
          this.x = this._subjectWindow.parent.x + this._subjectWindow.x +
                   this._subjectWindow.width / 2 - this._captionWidth / 2;
        }
        if (this._captionBottom) {
          this.y = this._subjectWindow.parent.y + this._subjectWindow.y +
                   this._subjectWindow.height -
                   this._subjectWindow._windowSpriteContainer.y - 2;
        } else {
          this.y = this._subjectWindow.parent.y + this._subjectWindow.y +
                   this._subjectWindow._windowSpriteContainer.y + 2;
        }
      }
      this.visible = this._subjectWindow.visible && !this._subjectWindow.isClosed();
    }
  };

  Sprite_WindowCaption.prototype.refresh = function() {
    this.bitmap.clear();
    if (this._captionText) {
      this.bitmap.fontSize = this._subjectWindow.captionFontSize();
      this.bitmap.textColor = this._subjectWindow.textColor(captionFontColor);
      this.bitmap.outlineWidth = captionOutlineWidth;
      this.bitmap.outlineColor = this._subjectWindow.textColor(captionOutlineColor);
      this._reverseVertical = false;
      this._captionAlign = 'left';
      this._captionBottom = false;
      var text = this.convertEscapeCharacters(this._captionText);
      if (this._reverseVertical) {
        this.anchor.y = 0;
        var bitmap = ImageManager.loadSystem('TMWindowCaptionVR');
      } else {
        this.anchor.y = 1;
        var bitmap = ImageManager.loadSystem('TMWindowCaption');
      }
      var w = this.bitmap.measureTextWidth(text);
      if (w > captionWidth - 32) {
        w = captionWidth - 32;
      }
      this._captionWidth = w + 32;
      var h = this.height;
      this.bitmap.blt(bitmap, 0, 0, 16, 32, 0, 0, 16, h);
      this.bitmap.blt(bitmap, 16, 0, 16, 32, 16, 0, w, h);
      this.bitmap.blt(bitmap, 32, 0, 16, 32, 16 + w, 0, 16, h);
      this.bitmap.drawText(text, 16, 1, w, h, 'left');
    }
  };
  
  Sprite_WindowCaption.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
      return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
      return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    text = text.replace(/\x1bWCVR/gi, function() {
      this._reverseVertical = true;
      return '';
    }.bind(this));
    text = text.replace(/\x1bWCL/gi, function() {
      this._captionAlign = 'left';
      return '';
    }.bind(this));
    text = text.replace(/\x1bWCR/gi, function() {
      this._captionAlign = 'right';
      return '';
    }.bind(this));
    text = text.replace(/\x1bWCC/gi, function() {
      this._captionAlign = 'canter';
      return '';
    }.bind(this));
    text = text.replace(/\x1bWCB/gi, function() {
      this._captionBottom = true;
      return '';
    }.bind(this));
    return text;
  };

  Sprite_WindowCaption.prototype.actorName = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
  };

  Sprite_WindowCaption.prototype.partyMemberName = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
  };

  //-----------------------------------------------------------------------------
  // Window_XXXX
  //

  Window_Base.prototype.captionText = function() {
    return '';
  };

  Window_Base.prototype.captionFontSize = function() {
    return captionFontSize;
  };

  Window_Help.prototype.captionText = function() {
    return captionHelp;
  };

  Window_Gold.prototype.captionText = function() {
    return captionGold;
  };

  Window_MenuCommand.prototype.captionText = function() {
    return captionMenuCommand;
  };

  Window_MenuStatus.prototype.captionText = function() {
    return captionMenuStatus;
  };

  Window_MenuActor.prototype.captionText = function() {
    return captionMenuActor;
  };

  Window_ItemCategory.prototype.captionText = function() {
    return captionItemCategory;
  };

  Window_ItemList.prototype.captionText = function() {
    switch (this._category) {
    case 'item':
        return captionItemList_item;
    case 'weapon':
        return captionItemList_weapon;
    case 'armor':
        return captionItemList_armor;
    case 'keyItem':
        return captionItemList_keyItem;
    default:
        return '';
    }
  };

  Window_SkillType.prototype.captionText = function() {
    return captionSkillType;
  };

  Window_SkillStatus.prototype.captionText = function() {
    return captionSkillStatus;
  };

  Window_SkillList.prototype.captionText = function() {
    if (captionSkillList) {
      return $dataSystem.skillTypes[this._stypeId] + captionSkillList;
    }
    return '';
  };

  Window_EquipStatus.prototype.captionText = function() {
    return captionEquipStatus;
  };

  Window_EquipCommand.prototype.captionText = function() {
    return captionEquipCommand;
  };

  Window_EquipSlot.prototype.captionText = function() {
    return captionEquipSlot;
  };
  
  Window_EquipItem.prototype.captionText = function() {
    if (captionEquipItem && this._actor) {
      var slots = this._actor.equipSlots();
      return $dataSystem.equipTypes[slots[this._slotId]] + captionEquipItem;
    }
    return '';
  };

  Window_Status.prototype.captionText = function() {
    return captionStatus;
  };
  
  Window_Options.prototype.captionText = function() {
    return captionOptions;
  };
  
  Window_SavefileList.prototype.captionText = function() {
    return captionSavefileList;
  };
  
  Window_ShopCommand.prototype.captionText = function() {
    return captionShopCommand;
  };
  
  Window_ShopBuy.prototype.captionText = function() {
    return captionShopBuy;
  };
  
  Window_ShopNumber.prototype.captionText = function() {
    return captionShopNumber;
  };
  
  Window_ShopStatus.prototype.captionText = function() {
    return captionShopStatus;
  };
  
  Window_NameEdit.prototype.captionText = function() {
    return captionNameEdit;
  };
  
  Window_NameInput.prototype.captionText = function() {
    return captionNameInput;
  };
  
  Window_ChoiceList.prototype.captionText = function() {
    return captionChoiceList;
  };
  
  Window_NumberInput.prototype.captionText = function() {
    return captionNumberInput;
  };
  
  Window_EventItem.prototype.captionText = function() {
    switch ($gameMessage.itemChoiceItypeId()) {
    case 1:
      return captionEventItem;
    case 2:
      return captionEventItem_key;
    case 3:
      return captionEventItem_A;
    case 4:
      return captionEventItem_B;
    default:
      return '';
    }
  };
  
  Window_Message.prototype.captionText = function() {
    if (this._captionText === undefined) {
      this._captionText = '';
    }
    return this._captionText;
  };
  
  Window_Message.prototype.captionFontSize = function() {
    return messageCaptionFontSize;
  };
  
  var _Window_Message_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function() {
    _Window_Message_startMessage.call(this);
    this._captionText = '';
    this._textState.text = this._textState.text.replace(/\x1bWC\[(.+?)\]/gi, function() {
      this._captionText = arguments[1];
      return '';
    }.bind(this));
  };

  Window_PartyCommand.prototype.captionText = function() {
    return captionPartyCommand;
  };
  
  Window_ActorCommand.prototype.captionText = function() {
    return captionActorCommand;
  };
  
  Window_BattleStatus.prototype.captionText = function() {
    return captionBattleStatus;
  };
  
  Window_BattleActor.prototype.captionText = function() {
    return captionBattleActor;
  };
  
  Window_BattleEnemy.prototype.captionText = function() {
    return captionBattleEnemy;
  };
  
  Window_BattleSkill.prototype.captionText = function() {
    return captionBattleSkill;
  };
  
  Window_BattleItem.prototype.captionText = function() {
    return captionBattleItem;
  };
  
  Window_TitleCommand.prototype.captionText = function() {
    return captionTitleCommand;
  };
  
  Window_GameEnd.prototype.captionText = function() {
    return captionGameEnd;
  };
  
  //-----------------------------------------------------------------------------
  // Scene_Base
  //

  var _Scene_Base_addWindow = Scene_Base.prototype.addWindow;
  Scene_Base.prototype.addWindow = function(window) {
    _Scene_Base_addWindow.call(this, window);
    var sprite = new Sprite_WindowCaption(window);
    this.addChild(sprite);
  };

  //-----------------------------------------------------------------------------
  // Scene_Boot
  //

  var _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
  Scene_Boot.prototype.loadSystemImages = function() {
    _Scene_Boot_loadSystemImages.call(this);
    ImageManager.loadSystem('TMWindowCaption');
    ImageManager.loadSystem('TMWindowCaptionVR');
  };

})();
