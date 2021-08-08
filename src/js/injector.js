import Blockly from "blockly";
import toolbox from "../blockly/toolbox.xml";
import "../css/style.css";

window.Blockly = Blockly;

window.smInjectBonkScript = function (bonkSrc) {
	console.log("%c[SneezingMod] Injecting alpha2s.js...", "background: black; color: #42f563;");

	window.smRegexes = {
		funcs: [
			{ name: "io", regex: "requirejs\\(\\[[^\\]]+\\],function\\(([^,]+)", isConstructor: false },
			{ name: "BonkGraphics", regex: "shrinkPerFrame:0\\.016.*?\\*=(.)\\[", isConstructor: true },
			{ name: "NetworkEngine", regex: ".*function ([^\\)]*)\\([^\\)]{11}\\).*reconnection:false", isConstructor: true },
			{ name: "NewBonkLobby", regex: "function (..)\\(.{15}\\).{0,10000}newbonklobby", isConstructor: true },
			{ name: "MapEncoder", regex: "{try{.{3,6}=(.{1,2})\\[", isConstructor: true },
			{ name: "CurrentGameState", regex: ";}};([A-Z](\\[[A-Za-z0-9]+(\\[[0-9]+]){2}]){2})", isConstructor: false },
			{ name: "MusicManager", regex: "function (..)\\(\\).{5,500}anime", isConstructor: true },
			{ name: "GameRendererClass", regex: "null;[A-Za-z0-9\\[\\]]+\\(true\\);[A-Za-z0-9\\[\\]]+=null;}};([A-Za-z0-9\\[\\]]+)=class", isConstructor: true },
			{ name: "PhysicsClass", regex: "([A-Za-z])\\[.{0,100}]={discs", isConstructor: true },
			{ name: "LocalInputs", regex: "Date.{0,200}new (.{2}).{0,100}\\$\\(document\\)", isConstructor: true }
		],
		vars: {
			args: "var\\s(...)=\\[arguments\\]"
		},
		inject: {
			regex: ";}\\);}}\\);",
			wrap: {
				left: ";});",
				right: "}});"
			}
		}
	}

	let newBonkSrc = bonkSrc;
	let funcHooks = "";
	smRegexes.funcs.map((function (func) {
		console.log(func);
		let funcInBonk = bonkSrc.match(func.regex)[1];
		funcHooks += `window.${func.name} = ${funcInBonk}; window.${func.name}_OLD = ${funcInBonk}; ${funcInBonk} = ` + (func.isConstructor ? `new Proxy(${funcInBonk}, {\n	construct(target, args) { \n		return new ${func.name}(...args); \n	}\n});\n` : `function(){\n	return ${func.name}(...arguments);\n};\n`);
	}))
	newBonkSrc = newBonkSrc.replace(new RegExp(smRegexes.inject.regex), `${smRegexes.inject.wrap.left}${funcHooks}window.initSM();${smRegexes.inject.wrap.right}`);
	newBonkSrc = newBonkSrc.replace(new RegExp(smRegexes.vars.args, "g"), "var $1 = [arguments]; window.smBonkVars.$1 = () => $1;")
	window.smBonkVars = {};
	return newBonkSrc;
}

if(!window.bonkCodeInjectors)
  window.bonkCodeInjectors = [];

window.bonkCodeInjectors.push(bonkSrc => {
	try {
		return smInjectBonkScript(bonkSrc);
	} catch (error) {
		alert(
			`An error ocurred while loading SneezingMod.


This may have happened because you have an extension that is not \
compatible with SneezingMod, like Bonk Leagues Client. Try disabling \
all other bonk.io extensions, and reload.

If the problem persists, please report this error as it may be due to \
a bonk.io update.`);
		throw error;
	}
 });

window.smInjectOtherBonkVars = function () {
	for (let i = 0, vars = Object.keys(window.smBonkVars); i != vars.length; i++)
		for (let i2 = 0, varChildren = window.smBonkVars[vars[i]](); i2 != varChildren.length; i2++) {
			if (varChildren[i2]) {
				if (varChildren[i2].userName !== undefined) {
					window.smScoped = new Proxy(varChildren[i2], {
						set() {
							return Reflect.set(...arguments);
						}
					})

				}
				if (varChildren[i2].length)
					for (let i3 = 0; i3 != varChildren[i2].length; i3++)
						if (varChildren[i2][i3] && varChildren[i2][i3].connect) {
							window.io = varChildren[i2][i3];
							window.io_OLD = varChildren[i2][i3];
							varChildren[i2][i3] = function () { return window.io(...arguments) }
						}
			}
		}
}

window.initSM = function () {
	window.smInjectOtherBonkVars();

	// make the sm object
	window.sm = {
		physics: {
			init: function(){
				this.initGameState();
			},
			initGameState: function(){
				CurrentGameState = function(){
					let gst = CurrentGameState_OLD(...arguments);
					sm.inputs.allPlayerInputs = arguments[1];
					sm.physics.gameState = gst;
					if(sm.lobby.roundStarting){
						sm.lobby.roundStarting = false;
						sm.blockly.resetVars();
						for(let i = 0; i != sm.physics.gameState.discs.length; i++){
							if(sm.physics.gameState.discs[i]){
								if(!sm.inputs.allPlayerInputs[i]) {
									sm.inputs.allPlayerInputs[i] = { left: false, right: true, up: false, down: false, action: false, action2: false };
								}
								if(sm.blockly.vars[0]){
									sm.blockly.vars[i] = sm.blockly.vars[0];
								}

								sm.physics.onFirstStep(i);
							}
						}
					}
					else if(!sm.physics.forceGameState){
						for(let i = 0; i != sm.physics.gameState.discs.length; i++){
							if(sm.physics.gameState.discs[i]){
								if(!sm.inputs.allPlayerInputs[i]) {
									sm.inputs.allPlayerInputs[i] = { left: false, right: true, up: false, down: false, action: false, action2: false };
								}
								sm.physics.onStep(i);
							}
						}
					}
					if(gst.ftu > 0 && arguments[0].ftu == -1) sm.lobby.roundStarting = true;
					if(sm.physics.forceGameState){
						sm.physics.forceGameState = false;
						gst = sm.physics.gameState;
					}
					sm.physics.gameState = gst;
					return gst;
				}
			},
			gameState: {},
			setGameState: function(newgst){
				this.forceGameState = true;
				this.gameState = newgst;
			},
			forceGameState: false,
			onStep: function(){},
			onFirstStep: function(){},
			getPlayerLastArrow: function(playerid) {
				let projs = this.gameState.projectiles;
				for(let i = projs.length; i != -1; i -= 1){
					if(projs[i] && projs[i].did == playerid){
						return projs[i];
					}
				}
				return null;
			},
			getPlayerObject: function(playerid) {
				let discs = this.gameState.discs;
				return discs[playerid] ? discs[playerid] : null;
			}
		},
		graphics: {
			init: function(){
				this.initBonkGraphics();
			},
			initBonkGraphics: function(){
				BonkGraphics_OLD.gameRenderer.render = (function(){
					var cached_graphicsRender = BonkGraphics_OLD.gameRenderer.render;
					return function(){
						let args = arguments;
						if(sm.physics.gameState && sm.physics.gameState.discs){
							for(let i = 0; i != sm.physics.gameState.discs.length; i++){
								if(sm.physics.gameState.discs[i]){
									if(!sm.inputs.allPlayerInputs[i]) {
										sm.inputs.allPlayerInputs[i] = { left: false, right: true, up: false, down: false, action: false, action2: false };
									}
									sm.graphics.onRender(i);
								}
							}
						}
						if(sm.graphics.objectsToRender_old != sm.graphics.objectsToRender && args[0].children[1] && args[0].children[1].children.length > 2){
							args[0].children[1].removeChildren(2);
						}
						if(args[0].children[1])
							for(let i = 0; i != sm.graphics.objectsToRender.length; i++){
								args[0].children[1].addChild(sm.graphics.objectsToRender[i]);
							}
						sm.graphics.objectsToRender_old = sm.graphics.objectsToRender;
						var result = cached_graphicsRender.apply(this, args); // use .apply() to call it
						return result;
					};
				})();
				GameRendererClass.prototype.render = (function(){
					GameRendererClass.prototype.render_OLD = GameRendererClass.prototype.render;
					return function(){
						if(sm.graphics.rendererClass){
							for(let a = 0; a != sm.graphics.rendererClass.discGraphics.length; a++){
								if(!sm.graphics.objectsToRender_discs[a]) continue;
								if(!sm.graphics.rendererClass.discGraphics[a]) continue;
								if(!arguments[1].discs[a] || sm.graphics.rendererClass.discGraphics[a].playerGraphic.children.length != sm.graphics.objectsToRender_discs[a].length) {
									let discGraphic = sm.graphics.rendererClass.discGraphics[a].playerGraphic;
									discGraphic.removeChildren();
								}
							}
							for(let a = 0; a != sm.graphics.rendererClass.discGraphics.length; a++){
								if(sm.graphics.rendererClass.discGraphics[a] && sm.graphics.objectsToRender_discs[a] && arguments[1].discs[a]) {
									for(let b = 0; b != sm.graphics.objectsToRender_discs[a].length; b++){
										sm.graphics.rendererClass.discGraphics[a].playerGraphic.addChild(sm.graphics.objectsToRender_discs[a][b]);
									}
								}
							}
						}
						var result = this.render_OLD.apply(this, arguments); // use .apply() to call it
						sm.graphics.rendererClass = this;
						return result;
					};
				})();
				GameRendererClass.prototype.destroy = (function(){
					GameRendererClass.prototype.destroy_OLD = GameRendererClass.prototype.destroy;
					return function(){
						if(sm.graphics.rendererClass){
							for(let a = 0; a != sm.graphics.rendererClass.discGraphics.length; a++){
								if(!sm.graphics.rendererClass.discGraphics[a]) continue;
								let discGraphic = sm.graphics.rendererClass.discGraphics[a].playerGraphic;
								while(discGraphic.children[0]) { discGraphic.removeChild(discGraphic.children[0]); }
							}
						}
						var result = this.destroy_OLD.apply(this, arguments); // use .apply() to call it
						return result;
					};
				})();
			},
			rendererClass: null,
			objectsToRender: [],
			objectsToRender_old: [],
			objectsToRender_discs: [],
			onRender: function(){}
		},
		lobby: {
			init: function(){
				this.initSocketio();
				this.initBonkLobby();
				this.initNetworkEngine();
			},
			initSocketio: function(){
				let io_OLDER = io;
				let this_obj = this;
                io = function(){
					let socket = io_OLDER(...arguments); 
					sm.lobby.socket = socket;
					this_obj.selfId = 0;
					socket.on(3, function(playerid){ console.log("yo"); this_obj.selfId = playerid; });
					socket.on("disconnect", function(){sm.blockly.resetAll();});
					return socket;
				}
			},
			initBonkLobby: function(){
				var smObj = this;
				
				NewBonkLobby = (function(){
					var cached_bonklobby = NewBonkLobby;
					
					return function(){
						var result = cached_bonklobby.apply(this, arguments); // use .apply() to call it
						smObj.bonkLobby = this;
						return result;
					};
				})();
			},
			initNetworkEngine: function(){
				var cached_networkengine = window.NetworkEngine;
                window.NetworkEngine = function(i, A, t) {
					var n = new cached_networkengine(i, A, t);
					n.on("scheduleGameStart", () => { sm.blockly.resetVars(); sm.blockly.funcs.clearRenderArrays(); sm.lobby.roundStarting = true; });
                    return sm.lobby.data = A, sm.lobby.mpSession = i, sm.lobby.networkEngine = n, n
				}
			},
			socket: null,
			bonkLobby: null,
			mpSession: null,
			networkEngine: null,
			roundStarting: false,
			selfId: 0
		},
		encoding: {
			init: function(){
				this.initialState.decoder = new dcodeIO.PSON.Decoder(this.initialState.dict);
				this.initialState.encoder = new dcodeIO.PSON.Encoder(this.initialState.dict);
			},
			initialState: {
				dict: ["physics", "shapes", "fixtures", "bodies", "bro", "joints", "ppm", "lights", "spawns", "lasers", "capZones", "type", "w", "h", "c", "a", "v", "l", "s", "sh", "fr", "re", "de", "sn", "fc", "fm", "f", "d", "n", "bg", "lv", "av", "ld", "ad", "fr", "bu", "cf", "rv", "p", "d", "bf", "ba", "bb", "aa", "ab", "axa", "dr", "em", "mmt", "mms", "ms", "ut", "lt", "New body", "Box Shape", "Circle Shape", "Polygon Shape", "EdgeChain Shape", "priority", "Light", "Laser", "Cap Zone", "BG Shape", "Background Layer", "Rotate Joint", "Slider Joint", "Rod Joint", "Gear Joint", 65535, 16777215],
				decoder: null,
				encoder: null,
				decode: function(initialState) {
					let str = '';
					for (let i = 0; i < initialState.length; i++) {
						if (
							i <= 100 &&
							initialState.charAt(i) === initialState.charAt(i).toLowerCase()
						) {
							str += initialState.charAt(i).toUpperCase();
						} else if (
							i <= 100 &&
							initialState.charAt(i) === initialState.charAt(i).toUpperCase()
						) {
							str += initialState.charAt(i).toLowerCase();
						} else {
							str += initialState.charAt(i);
						}
					}
					let decode1 = LZString.decompressFromEncodedURIComponent(str);
					let decode2 = dcodeIO.ByteBuffer.fromBase64(decode1);
					return this.decoder.decode(decode2);
				},
				encode: function(initialState) {
					let encode1 = this.encoder.encode(initialState);
					let encode2 = encode1.toBase64();
					let encode3 = LZString.compressToEncodedURIComponent(encode2);
					let encoded = '';
					for (var i = 0; i < encode3.length; i++) {
						if (i <= 100 && encode3.charAt(i) === encode3.charAt(i).toLowerCase()) {
							encoded += encode3.charAt(i).toUpperCase();
						} else if (
							i <= 100 &&
							encode3.charAt(i) === encode3.charAt(i).toUpperCase()
						) {
							encoded += encode3.charAt(i).toLowerCase();
						} else {
							encoded += encode3.charAt(i);
						}
					}
					return encoded;
				}
			},
			xmlJson: {
				xmlToJson: function(){
				},
				jsonToXml: function(){
					var xml = '';
					for (var prop in obj) {
						if (prop == "@attributes") continue;
						if (obj[prop] instanceof Array) {
							for (var array in obj[prop]) {
								xml += '<' + prop + '>';
								xml += OBJtoXML(new Object(obj[prop][array]));
								xml += '</' + prop + '>';
							}
						} else {
							xml += '<' + prop + '>';
							typeof obj[prop] == 'object' ? xml += OBJtoXML(new Object(obj[prop])) : xml += obj[prop];
							xml += '</' + prop + '>';
						}
					}
					var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
					return xml;
				}
			}
		},
		inputs: {
			init: function(){
				sm.inputs.initLocalInputs();
			},
			initLocalInputs: function(){
				LocalInputs = (function(){
					let cached_localinputs = LocalInputs;
					return function(){
						let result = cached_localinputs.apply(this, arguments); // use .apply() to call it
						sm.inputs.getInputs = sm.inputs.getInputs;
						return result;
					};
				})();
			},
			getInputs: null,
			allPlayerInputs: {}
		},
		blockly: {
			init: function(){
				this.blockDefs = getBlockDefs();
				this.initGMEditor();
			},
			initGMEditor: function(){
				// create the gm editor div
				let GMEditorWindow = document.createElement("div");
				GMEditorWindow.innerHTML = `<div id="gmeditorwindow" style="width: 800px; height: 600px; position: absolute; background-color: #e2e2e2; border-radius: 4px; margin: 0; top: 50%; left: 50%; transform: translate(-50%, -50%);"><div class="windowTopBar windowTopBar_classic">Game Mode Editor</div><div id="gmeditor_helptext" style="font-family: 'futurept_b1'; font-size: 15px; width: 100%; text-align: center; position: absolute; top: 36px;">Feeling lost? Hover over a block to get a brief description of what it does.<br>You can also check the <a href="placeholder">wiki</a> for more info.</div><div id="gmeditor_buttoncontainer" style="display: flex;flex-direction: row;justify-content: space-around;width: 90%;margin: auto;position: absolute;bottom: 12px;left: 0;right: 0;"> <div id="gmeditor_newbutton" class="brownButton brownButtonDisabled brownButton_classic buttonShadow mapeditor_midbox_bottombuttons">NEW</div><div id="gmeditor_loadbutton" class="brownButton brownButtonDisabled brownButton_classic buttonShadow mapeditor_midbox_bottombuttons">LOAD</div><div id="gmeditor_savebutton" class="brownButton brownButton_classic buttonShadow mapeditor_midbox_bottombuttons">SAVE</div></div></div>`;
				GMEditorWindow.style = "position: absolute; width: 100%; height: 100%; background-color: #1a2733;";
				GMEditorWindow.id = "gmeditor";
				document.getElementById('newbonkgamecontainer').appendChild(GMEditorWindow);
				document.getElementById('gmeditor_savebutton').addEventListener("click",sm.blockly.GMESave);
				document.getElementById('newbonklobby_modetext').addEventListener("click",sm.blockly.showGMEWindow);
				document.getElementById('newbonklobby_modetext').style.cursor = "pointer";
				
				
				// create blockly div
				let blocklyDiv = document.createElement("div");
				blocklyDiv.id = 'blocklyDiv';
				blocklyDiv.style = 'width: 700px; height: 450px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
				document.getElementById('gmeditorwindow').appendChild(blocklyDiv);

				// add block defs into blockly
				for(let i = 0; i != this.blockDefs.length; i++){
					Blockly.Blocks[this.blockDefs[i].type] = {
					  init: function() {
						this.jsonInit(sm.blockly.blockDefs[i]);
					  }
					};
				}
				
				defineBlockCode();
				
				let blocklyToolbox = document.createElement("xml");
				document.head.appendChild(blocklyToolbox);
				blocklyToolbox.outerHTML = toolbox;

				// create blockly workspace
				this.workspace = Blockly.inject('blocklyDiv',{
					toolbox: document.getElementById("toolbox"),
				});
			},
			blockDefs: null,
			workspace: null,
			GMESave: function(){
				eval(sm.blockly.generateCode());
				sm.blockly.hideGMEWindow();
			},
			showGMEWindow: function(){
				document.getElementById("gmeditor").style.display = "block";
				sm.blockly.workspace.setVisible(true);
			},
			hideGMEWindow: function(){
				sm.blockly.workspace.setVisible(false);
				document.getElementById("gmeditor").style.display = "none";
			},
			generateCode: function(){
				let code = Blockly.JavaScript.workspaceToCode(sm.blockly.workspace);
				if(code.startsWith("var ")){
					let varNameArray = code.match(/var (.+);/)[1].split(", ").map(v => {return '"'+v+'"'});
					code = code.replace(/var (.+);/, 'sm.blockly.funcs.initVars([' + varNameArray.join(', ') + ']);');
				}
				return code;
			},
			vars: [],
			funcs: {
				createCircle: function(discID, xpos, ypos, radius, color){
					let circle = new PIXI.Graphics();
					circle.beginFill(color); 
					circle.drawCircle(0, 0, radius);
					circle.x = xpos;
					circle.y = ypos;
					circle.discID = discID;
					return circle;
				},
				createRect: function(discID, xpos1, ypos1, xpos2, ypos2, color){
					let rectangle = new PIXI.Graphics();
					rectangle.beginFill(color); 
					rectangle.drawRect(xpos1, ypos1, xpos2, ypos2);
					rectangle.discID = discID;
					return rectangle;
				},
				createLine: function(discID, xpos1, ypos1, xpos2, ypos2, color, width){
					let line = new PIXI.Graphics();
					line.lineStyle(width, color, 1);
					line.moveTo(xpos1, ypos1);
					line.lineTo(xpos2, ypos2);
					line.discID = discID;
					return line;
				},
				createText: function(discID, xpos, ypos, color, str, bold = false, size = 11){
					let text = new PIXI.Text(str, {
						fontFamily: bold ? "futurept_demi" : "futurept_medium",
						fontSize: size * sm.graphics.rendererClass.scaleRatio,
						fill: color,
						align: "center",
						dropShadow: true,
						dropShadowDistance: 3,
						dropShadowAlpha: 0.30
					});
					text.x += xpos;
					text.y += ypos;
					text.discID = discID;
					return text;
				},
				addToRenderArray: function(shape){
					if(sm.graphics.objectsToRender.length <= 300){
						sm.graphics.objectsToRender.push(shape);
					}
				},
				addToRenderArray_discs: function(shape, discID){
					if(sm.graphics.objectsToRender_discs.length <= 300){
						if(!sm.graphics.objectsToRender_discs[discID]){
							sm.graphics.objectsToRender_discs[discID] = [];
						}
						sm.graphics.objectsToRender_discs[discID].push(shape);
					}
				},
				clearRenderArrays: function(){
					sm.graphics.objectsToRender = [];
					sm.graphics.objectsToRender_discs = [];
				},
				clearRenderObjects_id: function(discID){
					for(let i = 0; i != sm.graphics.objectsToRender.length; i++) 
						if(sm.graphics.objectsToRender[i].discID == discID) 
							sm.graphics.objectsToRender = sm.graphics.objectsToRender.splice(i-1, 1);
					sm.graphics.objectsToRender_discs[discID] = [];
				},
				setPlayerProperty: function(gameState, discID, property, value){
					if(gameState.discs[discID])
						gameState.discs[discID][property] = value;
					return gameState;
				},
				getPlayerProperty: function(gameState, discID, property){
					if(gameState.discs[discID] && gameState.discs[discID][property])
						return gameState.discs[discID][property];
					else
						return 0;
				},
				initVars: function(vars){
					sm.blockly.vars = [{}];
					vars.map(v => {
						sm.blockly.vars[0][v] = null;
					})
				},
				setVar: function(varName, discID, value){
					if(typeof sm.blockly.vars[discID] == "object"){
						sm.blockly.vars[discID][varName] = value;
					}
					else{
						sm.blockly.vars[discID] = {};
						sm.blockly.vars[discID][varName] = value;
					}
				},
				getVar: function(varName, discID){
					if(sm.blockly.vars[discID] && sm.blockly.vars[discID][varName])
						return sm.blockly.vars[discID][varName];
					else
						return 0;
				}
			},
			resetVars: function(){
				sm.blockly.vars.map(discVars => {
					for(let i = 0, keys = Object.keys(discVars); i != keys.length; i++)
						discVars[keys[i]] = 0;
					return discVars;
				})
			},
			resetMode: function(){
				sm.physics.onStep = function(){};
				sm.physics.onRender = function(){};
			},
			resetAll: function(){
				sm.blockly.resetVars();
				sm.blockly.resetMode();
				sm.blockly.funcs.clearRenderArrays();
			}
		}
	}

	// init the things inside sm
	for(let i = 0; i != Object.keys(sm).length; i++){
		sm[Object.keys(sm)[i]].init();
	}

	// show epic logo on console
	console.log("%c                                     |\n                #####                |  [SneezingMod v0.5.0]\n                #####                |  Developed by SneezingCactus\n                #####    ###         |  Definitely not a BLC clone\n                #####    ####        |\n                #####    ####        |\n                #####    ####        |\n         ###    #####    ####        |\n        ####    #####   #####        |\n        ####    #############        |\n        #####   ###########          |\n         ############                |\n          ###########                |\n                #####                |\n	            #####                |\n                #####                |\n", "background: black; color: #42f563;");
}

function defineBlockCode(){
	Blockly.JavaScript['draw_line'] = function(block) {
		var line_x1 = Blockly.JavaScript.valueToCode(block, 'line_x1', Blockly.JavaScript.ORDER_ATOMIC);
		var line_y1 = Blockly.JavaScript.valueToCode(block, 'line_y1', Blockly.JavaScript.ORDER_ATOMIC);
		var line_x2 = Blockly.JavaScript.valueToCode(block, 'line_x2', Blockly.JavaScript.ORDER_ATOMIC);
		var line_y2 = Blockly.JavaScript.valueToCode(block, 'line_y2', Blockly.JavaScript.ORDER_ATOMIC);
		var line_width = block.getFieldValue('line_width');
		var line_color = "0x" + block.getFieldValue('line_color').slice(1);
		var line_anchored = block.getFieldValue('line_anchored') == 'TRUE';
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.blockly.funcs.addToRenderArray${line_anchored ? "_discs" : ""}(sm.blockly.funcs.createLine(playerid,${line_x1},${line_y1},${line_x2},${line_y2},${line_color},${line_width})${line_anchored ? ", playerid);" : ");"}`;
		return code;
	};
  
	Blockly.JavaScript['draw_rect'] = function(block) {
		var rect_x1 = Blockly.JavaScript.valueToCode(block, 'rect_x1', Blockly.JavaScript.ORDER_ATOMIC);
		var rect_y1 = Blockly.JavaScript.valueToCode(block, 'rect_y1', Blockly.JavaScript.ORDER_ATOMIC);
		var rect_x2 = Blockly.JavaScript.valueToCode(block, 'rect_x2', Blockly.JavaScript.ORDER_ATOMIC);
		var rect_y2 = Blockly.JavaScript.valueToCode(block, 'rect_y2', Blockly.JavaScript.ORDER_ATOMIC);
		var rect_color = block.getFieldValue('rect_color');
		var rect_anchored = block.getFieldValue('rect_anchored') == 'TRUE';
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.blockly.funcs.addToRenderArray${rect_anchored ? "_discs" : ""}(sm.blockly.funcs.createLine(playerid,${rect_x1},${rect_y1},${rect_x2},${rect_y2},${rect_color},${rect_width})${rect_anchored ? ", playerid);" : ");"}`;
		return code;
	};
  
	Blockly.JavaScript['draw_circle'] = function(block) {
		var circ_x = Blockly.JavaScript.valueToCode(block, 'circ_x', Blockly.JavaScript.ORDER_ATOMIC);
		var circ_y = Blockly.JavaScript.valueToCode(block, 'circ_y', Blockly.JavaScript.ORDER_ATOMIC);
		var circ_radius = Blockly.JavaScript.valueToCode(block, 'circ_radius', Blockly.JavaScript.ORDER_ATOMIC);
		var circ_color = "0x" + block.getFieldValue('circ_color').slice(1);
		var circ_anchored = block.getFieldValue('circ_anchored') == 'TRUE';
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.blockly.funcs.addToRenderArray${circ_anchored ? "_discs" : ""}(sm.blockly.funcs.createCircle(playerid,${circ_x},${circ_y},${circ_radius},${circ_color})${circ_anchored ? ", playerid);" : ");"}`;
		return code;
	};
  
	Blockly.JavaScript['draw_text'] = function(block) {
		var text_string = Blockly.JavaScript.valueToCode(block, 'text_string', Blockly.JavaScript.ORDER_ATOMIC);
		var text_x = Blockly.JavaScript.valueToCode(block, 'text_x', Blockly.JavaScript.ORDER_ATOMIC);
		var text_y = Blockly.JavaScript.valueToCode(block, 'text_y', Blockly.JavaScript.ORDER_ATOMIC);
		var text_color = "0x" + block.getFieldValue('text_color').slice(1);
		var text_size = block.getFieldValue('text_size');
		var text_bold = block.getFieldValue('text_bold') == 'TRUE';
		var text_anchored = block.getFieldValue('text_anchored') == 'TRUE';
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.blockly.funcs.addToRenderArray${text_anchored ? "_discs" : ""}(sm.blockly.funcs.createText(playerid,${text_x},${text_y},${text_color},${text_string},${text_bold},${text_size})${text_anchored ? ", playerid);" : ");"}`;
		return code;
	};

	Blockly.JavaScript['draw_clear'] = function(block) {
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.blockly.funcs.clearRenderObjects_id(playerid);`;
		return code;
	};

	Blockly.JavaScript['set_player_prop'] = function(block) {
		var player_prop = block.getFieldValue('player_prop');
		var set_number = Blockly.JavaScript.valueToCode(block, 'set_number', Blockly.JavaScript.ORDER_ATOMIC);
		var opts = { "xpos": "x", "ypos": "y", "xvel": "xv", "yvel": "yv", "ang": "a" };
		// TODO: Assemble JavaScript into code variable.
		var code = `gst = sm.blockly.funcs.setPlayerProperty(gst, playerid, "${opts[player_prop]}", ${set_number});`;
		return code;
	};
	  
	Blockly.JavaScript['change_player_prop'] = function(block) {
		var player_prop = block.getFieldValue('player_prop');
		var change_number = Blockly.JavaScript.valueToCode(block, 'change_number', Blockly.JavaScript.ORDER_ATOMIC);
		var opts = { "xpos": "x", "ypos": "y", "xvel": "xv", "yvel": "yv", "ang": "a" };
		// TODO: Assemble JavaScript into code variable.
		var code = `gst = sm.blockly.funcs.setPlayerProperty(gst, playerid, "${opts[player_prop]}", ${change_number});`;
		return code;
	};

	Blockly.JavaScript['set_last_arrow_prop'] = function(block) {
		var arrow_prop = block.getFieldValue('arrow_prop');
		var set_number = Blockly.JavaScript.valueToCode(block, 'set_number', Blockly.JavaScript.ORDER_ATOMIC);
		var opts = { "xpos": "x", "ypos": "y", "xvel": "xv", "yvel": "yv", "ang": "a" };
		// TODO: Assemble JavaScript into code variable.
		var code = `gst = sm.blockly.funcs.setPlayerProperty(gst, playerid, "${opts[arrow_prop]}", ${set_number});`;
		return code;
	};

	Blockly.JavaScript['change_last_arrow_prop'] = function(block) {
		var arrow_prop = block.getFieldValue('arrow_prop');
		var change_number = Blockly.JavaScript.valueToCode(block, 'change_number', Blockly.JavaScript.ORDER_ATOMIC);
		var opts = { "xpos": "x", "ypos": "y", "xvel": "xv", "yvel": "yv", "ang": "a" };
		// TODO: Assemble JavaScript into code variable.
		var code = `gst = sm.blockly.funcs.setPlayerProperty(gst, playerid, "${opts[arrow_prop]}", ${change_number});`;
		return code;
	};

	Blockly.JavaScript['get_player_prop'] = function(block) {
		var property = block.getFieldValue('property');
		var opts = { "xpos": "x", "ypos": "y", "xvel": "xv", "yvel": "yv", "ang": "a" };
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.physics.getPlayerObject(playerid) != null ? sm.physics.getPlayerObject(playerid)["${opts[property]}"] : 0`;
		// TODO: Change ORDER_NONE to the correct strength.
		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.JavaScript['get_player_prop_scr'] = function(block) {
		var property = block.getFieldValue('property');
		// TODO: Assemble JavaScript into code variable.
		var code = '...';
		// TODO: Change ORDER_NONE to the correct strength.
		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.JavaScript['get_last_arrow_prop'] = function(block) {
		var property = block.getFieldValue('property');
		var opts = { "xpos": "x", "ypos": "y", "xvel": "xv", "yvel": "yv", "ang": "a" };
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.physics.getPlayerLastArrow(playerid) != null ? sm.physics.getPlayerLastArrow(playerid)["${opts[property]}"] : 0`;
		// TODO: Change ORDER_NONE to the correct strength.
		return [code, Blockly.JavaScript.ORDER_NONE];
	};
	  
	Blockly.JavaScript['get_last_arrow_prop_scr'] = function(block) {
		var property = block.getFieldValue('property');
		// TODO: Assemble JavaScript into code variable.
		var code = '...';
		// TODO: Change ORDER_NONE to the correct strength.
		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.JavaScript['create_arrow'] = function(block) {
		var arrow_xpos = Blockly.JavaScript.valueToCode(block, 'arrow_xpos', Blockly.JavaScript.ORDER_ATOMIC);
		var arrow_ypos = Blockly.JavaScript.valueToCode(block, 'arrow_ypos', Blockly.JavaScript.ORDER_ATOMIC);
		var arrow_xvel = Blockly.JavaScript.valueToCode(block, 'arrow_xvel', Blockly.JavaScript.ORDER_ATOMIC);
		var arrow_yvel = Blockly.JavaScript.valueToCode(block, 'arrow_yvel', Blockly.JavaScript.ORDER_ATOMIC);
		var arrow_deadly = Blockly.JavaScript.valueToCode(block, 'arrow_deadly', Blockly.JavaScript.ORDER_ATOMIC);
		// TODO: Assemble JavaScript into code variable.
		var code = `gst = sm.physics.gameState; if(gst.discs[playerid]){gst.projectiles.push({a: 0, av: 0, did: playerid, fte: 150, team: gst.discs[playerid].team, type: "arrow", x: ${arrow_xpos}, xv: ${arrow_xvel}, y: ${arrow_ypos}, yv: ${arrow_yvel}}); sm.physics.setGameState(gst);}`;
		return code;
	};

	Blockly.JavaScript['player_die'] = function(block) {
		// TODO: Assemble JavaScript into code variable.
		var code = '...;\n';
		return code;
	};

	Blockly.JavaScript['on_round_start'] = function(block) {
		var inside_code = Blockly.JavaScript.statementToCode(block, 'code');
		// TODO: Assemble JavaScript into code variable.
		var code = `sm.physics.onFirstStep = function(playerid){let gst = sm.physics.gameState;${inside_code}sm.physics.setGameState(gst);}`;
		return code;
	};

	Blockly.JavaScript['on_each_phys_frame'] = function(block) {
	  var inside_code = Blockly.JavaScript.statementToCode(block, 'code');
	  // TODO: Assemble JavaScript into code variable.
	  var code = `sm.physics.onStep = function(playerid){let gst = sm.physics.gameState;${inside_code}sm.physics.setGameState(gst);}`;
	  return code;
	};

	Blockly.JavaScript['on_each_render_frame'] = function(block) {
	  var inside_code = Blockly.JavaScript.statementToCode(block, 'code');
	  // TODO: Assemble JavaScript into code variable.
	  var code = `sm.graphics.onRender = function(playerid){let gst = sm.physics.gameState;${inside_code}sm.physics.setGameState(gst);}`;
	  return code;
	};

	Blockly.JavaScript['on_player_collide'] = function(block) {
	  var collide_type = block.getFieldValue('collide_type');
	  var inside_code = Blockly.JavaScript.statementToCode(block, 'code');
	  // TODO: Assemble JavaScript into code variable.
	  var code = '...;\n';
	  return code;
	};

	Blockly.JavaScript['on_last_arrow_collide'] = function(block) {
		var collide_type = block.getFieldValue('collide_type');
		var inside_code = Blockly.JavaScript.statementToCode(block, 'code');
		// TODO: Assemble JavaScript into code variable.
		var code = '...;\n';
		return code;
	};
	  
	Blockly.JavaScript['get_last_arrow_property'] = function(block) {
		var property = block.getFieldValue('property');
		// TODO: Assemble JavaScript into code variable.
		var code = '...';
		// TODO: Change ORDER_NONE to the correct strength.
		return [code, Blockly.JavaScript.ORDER_NONE];
	};
	  
	Blockly.JavaScript['on_player_die'] = function(block) {
		var inside_code = Blockly.JavaScript.statementToCode(block, 'code');
		// TODO: Assemble JavaScript into code variable.
		var code = '...;\n';
		return code;
	};

	Blockly.JavaScript['pressing_key'] = function(block) {
		var key = block.getFieldValue('key');
		// TODO: Assemble JavaScript into code variable.
		var code = `(sm.inputs.allPlayerInputs[playerid] && sm.inputs.allPlayerInputs[playerid]["${key}"])`;
		// TODO: Change ORDER_NONE to the correct strength.
		return [code, Blockly.JavaScript.ORDER_NONE];
	};
	
	// blockly built-in
	Blockly.JavaScript['math_change'] = function(block) {
	  // Add to a variable in place.
	  var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
		  Blockly.JavaScript.ORDER_ADDITION) || '0';
	  var varName = Blockly.JavaScript.variableDB_.getName(
		  block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
	  return 'sm.blockly.funcs.setVar("' + varName + '", playerid, (typeof sm.blockly.funcs.getVar("' + varName + '", playerid) == \'number\' ?  sm.blockly.funcs.getVar("' + varName +
		  '", playerid) : 0) + ' + argument0 + ');\n';
	};
	
	Blockly.JavaScript['variables_set'] = function(block) {
	  // Variable setter.
	  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
		  Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
	  var varName = Blockly.JavaScript.variableDB_.getName(
		  block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
	  return 'sm.blockly.funcs.setVar("' + varName + '", playerid, ' + argument0 + ');\n';
	};
	
	Blockly.JavaScript['variables_get'] = function(block) {
	  // Variable getter.
	  var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
		  Blockly.VARIABLE_CATEGORY_NAME);
	  return ['sm.blockly.funcs.getVar("' + code + '", playerid)', Blockly.JavaScript.ORDER_ATOMIC];
	};
}

// this is temporal i swear
function getBlockDefs(){
	return [{
		"type": "create_arrow",
		"message0": "create arrow %1 x position %2 y position %3 x velocity %4 y velocity %5 angle %6",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_value",
			"name": "arrow_xpos",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "arrow_ypos",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "arrow_xvel",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "arrow_yvel",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "arrow_angle",
			"check": "Number",
			"align": "RIGHT"
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 230,
		"tooltip": "Create an arrow.",
		"helpUrl": ""
	  },
	  {
		"type": "player_die",
		"message0": "kill player",
		"previousStatement": null,
		"colour": 230,
		"tooltip": "Kill the player.",
		"helpUrl": ""
	  },
	  {
		"type": "get_last_arrow_property",
		"message0": "get player's last arrow's %1",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "property",
			"options": [
			  [
				"x position",
				"xpos"
			  ],
			  [
				"y position",
				"ypos"
			  ],
			  [
				"x velocity",
				"xvel"
			  ],
			  [
				"y velocity",
				"yvel"
			  ],
			  [
				"angle",
				"ang"
			  ]
			]
		  }
		],
		"output": "Number",
		"colour": 230,
		"tooltip": "Get a player's last arrow's property.",
		"helpUrl": ""
	  },
	  {
		"type": "draw_line",
		"lastDummyAlign0": "RIGHT",
		"message0": "draw line %1 from x %2 y %3 to x %4 y %5 width %6 %7 color %8 %9 anchored to player? %10",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_value",
			"name": "line_x1",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "line_y1",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "line_x2",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "line_y2",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "field_number",
			"name": "line_width",
			"value": 1,
			"min": 0,
			"max": 9999
		  },
		  {
			"type": "input_dummy",
			"align": "RIGHT"
		  },
		  {
			"type": "field_colour",
			"name": "line_color",
			"colour": "#ff0000"
		  },
		  {
			"type": "input_dummy",
			"align": "RIGHT"
		  },
		  {
			"type": "field_checkbox",
			"name": "line_anchored",
			"checked": false
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 160,
		"tooltip": "Draw a line to the screen.",
		"helpUrl": ""
	  },
	  {
		"type": "draw_rect",
		"lastDummyAlign0": "RIGHT",
		"message0": "draw rectangle %1 from x %2 y %3 to x %4 y %5 color %6 %7 anchored to player? %8",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_value",
			"name": "rect_x1",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "rect_y1",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "rect_x2",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "rect_y2",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "field_colour",
			"name": "rect_color",
			"colour": "#ff0000"
		  },
		  {
			"type": "input_dummy",
			"align": "RIGHT"
		  },
		  {
			"type": "field_checkbox",
			"name": "rect_anchored",
			"checked": false
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 160,
		"tooltip": "Draw a rectangle to the screen.",
		"helpUrl": ""
	  },
	  {
		"type": "draw_circle",
		"lastDummyAlign0": "RIGHT",
		"message0": "draw circle %1 at x %2 y %3 with radius %4 color %5 %6 anchored to player? %7",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_value",
			"name": "circ_x",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "circ_y",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "circ_radius",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "field_colour",
			"name": "circ_color",
			"colour": "#ff0000"
		  },
		  {
			"type": "input_dummy",
			"align": "RIGHT"
		  },
		  {
			"type": "field_checkbox",
			"name": "circ_anchored",
			"checked": false
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 160,
		"tooltip": "Draw a circle to the screen.",
		"helpUrl": ""
	  },
	  {
		"type": "draw_text",
		"lastDummyAlign0": "RIGHT",
		"message0": "draw text %1 text %2 at x %3 y %4 color %5 %6 size %7 %8 bold? %9 %10 anchored to player? %11",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_value",
			"name": "text_string",
			"check": "String",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "text_x",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "input_value",
			"name": "text_y",
			"check": "Number",
			"align": "RIGHT"
		  },
		  {
			"type": "field_colour",
			"name": "text_color",
			"colour": "#ff0000"
		  },
		  {
			"type": "input_dummy",
			"align": "RIGHT"
		  },
		  {
			"type": "field_number",
			"name": "text_size",
			"value": 11
		  },
		  {
			"type": "input_dummy",
			"align": "RIGHT"
		  },
		  {
			"type": "field_checkbox",
			"name": "text_bold",
			"checked": false
		  },
		  {
			"type": "input_dummy",
			"align": "RIGHT"
		  },
		  {
			"type": "field_checkbox",
			"name": "text_anchored",
			"checked": false
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 160,
		"tooltip": "Draw text to the screen.",
		"helpUrl": ""
	  },
	  {
		"type": "draw_clear",
		"message0": "clear player's drawings",
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 160,
		"tooltip": "Clear all previous drawings from the player.",
		"helpUrl": ""
	  },
	  {
		"type": "on_each_phys_frame",
		"message0": "on each physics step %1 %2",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_statement",
			"name": "code"
		  }
		],
		"colour": 20,
		"tooltip": "Executes every time the physics get calculated.",
		"helpUrl": ""
	  },
	  {
		"type": "on_each_render_frame",
		"message0": "on each drawing frame %1 %2",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_statement",
			"name": "code"
		  }
		],
		"colour": 20,
		"tooltip": "Executes every time the game is rendered.",
		"helpUrl": ""
	  },
	  {
		"type": "on_player_collide",
		"message0": "when the player collides with  %1 %2 %3",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "collide_type",
			"options": [
			  [
				"another player",
				"collide_player"
			  ],
			  [
				"an arrow",
				"collide_arrow"
			  ],
			  [
				"a platform",
				"collide_platform"
			  ]
			]
		  },
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_statement",
			"name": "code"
		  }
		],
		"colour": 20,
		"tooltip": "Executes when the player collides with a specified type of object.",
		"helpUrl": ""
	  },
	  {
		"type": "on_round_start",
		"message0": "on round start %1 %2",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_statement",
			"name": "code"
		  }
		],
		"colour": 20,
		"tooltip": "Executes when a round starts.",
		"helpUrl": ""
	  },
	  {
		"type": "set_player_prop",
		"message0": "set player's %1 to %2",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "player_prop",
			"options": [
				[
					"x position",
					"xpos"
				  ],
				  [
					"y position",
					"ypos"
				  ],
				  [
					"x velocity",
					"xvel"
				  ],
				  [
					"y velocity",
					"yvel"
				  ],
				  [
					"angle",
					"ang"
				  ]
			]
		  },
		  {
			"type": "input_value",
			"name": "set_number",
			"check": "Number"
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 230,
		"tooltip": "Set a player's property to a specified value.",
		"helpUrl": ""
	  },
	  {
		"type": "change_player_prop",
		"message0": "change player's %1 by %2",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "player_prop",
			"options": [
				[
					"x position",
					"xpos"
				  ],
				  [
					"y position",
					"ypos"
				  ],
				  [
					"x velocity",
					"xvel"
				  ],
				  [
					"y velocity",
					"yvel"
				  ],
				  [
					"angle",
					"ang"
				  ]
			]
		  },
		  {
			"type": "input_value",
			"name": "change_number",
			"check": "Number"
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 230,
		"tooltip": "Change a player's property by a specified value.",
		"helpUrl": ""
	  },
	  {
		"type": "on_player_die",
		"message0": "when the player dies %1 %2",
		"args0": [
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_statement",
			"name": "code"
		  }
		],
		"colour": 20,
		"tooltip": "Executes when the player dies.",
		"helpUrl": ""
	  },
	  {
		"type": "change_last_arrow_prop",
		"message0": "change player's last arrow's %1 by %2",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "arrow_prop",
			"options": [
				[
					"x position",
					"xpos"
				  ],
				  [
					"y position",
					"ypos"
				  ],
				  [
					"x velocity",
					"xvel"
				  ],
				  [
					"y velocity",
					"yvel"
				  ],
				  [
					"angle",
					"ang"
				  ]
			]
		  },
		  {
			"type": "input_value",
			"name": "change_number",
			"check": "Number"
		  }
		],
		"previousStatement": null,
		"nextStatement": null,
		"colour": 230,
		"tooltip": "Change the player's last arrow's property by a specified value.",
		"helpUrl": ""
	  },
	  {
		"type": "on_last_arrow_collide",
		"message0": "when player's last arrow collides with  %1 %2 %3",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "collide_type",
			"options": [
			  [
				"a player",
				"collide_player"
			  ],
			  [
				"another arrow",
				"collide_arrow"
			  ],
			  [
				"a platform",
				"collide_platform"
			  ]
			]
		  },
		  {
			"type": "input_dummy"
		  },
		  {
			"type": "input_statement",
			"name": "code"
		  }
		],
		"colour": 20,
		"tooltip": "Executes when the player's last arrow collides with a specified type of object.",
		"helpUrl": ""
	  },
	  {
		"type": "get_player_prop",
		"message0": "get player's %1",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "property",
			"options": [
			  [
				"x position",
				"xpos"
			  ],
			  [
				"y position",
				"ypos"
			  ],
			  [
				"x velocity",
				"xvel"
			  ],
			  [
				"y velocity",
				"yvel"
			  ],
			  [
				"angle",
				"ang"
			  ]
			]
		  }
		],
		"output": "Number",
		"colour": 230,
		"tooltip": "Get a player's property.",
		"helpUrl": ""
	  },
	  {
		"type": "get_player_prop_scr",
		"message0": "get player's %1 on screen",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "property",
			"options": [
			  [
				"x position",
				"xpos"
			  ],
			  [
				"y position",
				"ypos"
			  ],
			  [
				"x velocity",
				"xvel"
			  ],
			  [
				"y velocity",
				"yvel"
			  ]
			]
		  }
		],
		"output": "Number",
		"colour": 230,
		"tooltip": "Get a player's property as shown on the screen (in pixels).",
		"helpUrl": ""
	  },
	  {
		"type": "get_last_arrow_prop_scr",
		"message0": "get player's last arrow's %1 on screen",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "property",
			"options": [
			  [
				"x position",
				"xpos"
			  ],
			  [
				"y position",
				"ypos"
			  ],
			  [
				"x velocity",
				"xvel"
			  ],
			  [
				"y velocity",
				"yvel"
			  ]
			]
		  }
		],
		"output": "Number",
		"colour": 230,
		"tooltip": "Get the player's last arrow's property as shown on screen (in pixels).",
		"helpUrl": ""
	  },
	  {
		"type": "get_last_arrow_prop",
		"message0": "get player's last arrow's %1",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "property",
			"options": [
			  [
				"x position",
				"xpos"
			  ],
			  [
				"y position",
				"ypos"
			  ],
			  [
				"x velocity",
				"xvel"
			  ],
			  [
				"y velocity",
				"yvel"
			  ],
			  [
				"angle",
				"ang"
			  ]
			]
		  }
		],
		"output": "Number",
		"colour": 230,
		"tooltip": "Get a player's last arrow's property.",
		"helpUrl": ""
	  },
	  {
		"type": "set_last_arrow_prop",
		"message0": "set player's last arrow's %1 to %2",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "arrow_prop",
			"options": [
			  [
				"x position",
				"xpos"
			  ],
			  [
				"y position",
				"ypos"
			  ],
			  [
				"x velocity",
				"xvel"
			  ],
			  [
				"y velocity",
				"yvel"
			  ],
			  [
				"angle",
				"ang"
			  ]
			]
		  },
		  {
			"type": "input_value",
			"name": "set_number",
			"check": "Number"
		  }
		],
		"inputsInline": false,
		"previousStatement": null,
		"nextStatement": null,
		"colour": 230,
		"tooltip": "Set a player's property to a specified value.",
		"helpUrl": ""
	  },
	  {
		"type": "pressing_key",
		"message0": "the player is pressing %1",
		"args0": [
		  {
			"type": "field_dropdown",
			"name": "key",
			"options": [
			  [
				"up",
				"up"
			  ],
			  [
				"down",
				"down"
			  ],
			  [
				"left",
				"left"
			  ],
			  [
				"right",
				"right"
			  ],
			  [
				"heavy",
				"action"
			  ],
			  [
				"special",
				"action2"
			  ]
			]
		  }
		],
		"output": "Boolean",
		"colour": 20,
		"tooltip": "Returns true if the player is pressing the specified key.",
		"helpUrl": ""
	  }];
}