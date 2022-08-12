/* eslint-disable require-jsdoc */
import * as monaco from 'monaco-editor';

export default function() {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: () => {
      return {
        suggestions: [
          // -------------------------------------------------------------------------------------------------------- //
          // EVENTS
          // -------------------------------------------------------------------------------------------------------- //

          // the other ones
          {
            label: 'sh!eventStepOnce',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "step" that only happens once.',
            insertText: 'game.events.addEventListener(\'step\', {runOnce: true}, function() {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventStepAllPlayers',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "step" that gets called for every player that was in the room when the game started.',
            insertText: 'game.events.addEventListener(\'step\', {runOnce: false}, function(id) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventRoundStartOnce',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "roundStart" that only happens once.',
            insertText: 'game.events.addEventListener(\'roundStart\', {runOnce: true}, function() {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventRoundStartAllPlayers',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "roundStart" that gets called for every player that was in the room when the game started.',
            insertText: 'game.events.addEventListener(\'roundStart\', {runOnce: false}, function(id) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventPlayerDie',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "playerDie".',
            insertText: 'game.events.addEventListener(\'playerDie\', null, function(id) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          // player collision events
          {
            label: 'sh!eventPlayerCollidePlayer',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "playerCollision" targetting collisions with other players.',
            insertText: 'game.events.addEventListener(\'playerCollision\', {collideWith: \'player\'}, function(playerIdA, playerIdB) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventPlayerCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "playerCollision" targetting collisions with arrows.',
            insertText: 'game.events.addEventListener(\'playerCollision\', {collideWith: \'arrow\'}, function(playerId, arrowId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventPlayerCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "playerCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'playerCollision\', {collideWith: \'body\'}, function(playerId, bodyId, fixtureId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          // arrow collision events
          {
            label: 'sh!eventArrowCollidePlayer',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with players.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'player\'}, function(arrowId, playerId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventArrowCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with other arrows.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'arrow\'}, function(arrowIdA, arrowIdB) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventArrowCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'body\'}, function(arrowId, bodyId, fixtureId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          // body collision events
          {
            label: 'sh!eventBodyCollidePlayer',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with players.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'player\'}, function(bodyId, fixtureId, playerId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventBodyCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with arrows.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'arrow\'}, function(bodyId, fixtureId, arrowIdB) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventBodyCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'body\'}, function(bodyIdA, fixtureIdA, bodyIdB, fixtureIdB) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          // -------------------------------------------------------------------------------------------------------- //
          // GRAPHICS
          // -------------------------------------------------------------------------------------------------------- //

          {
            label: 'sh!graphicsCreateDrawing',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for creating a drawing. This defines every single property of the drawing (except attachId since it is set to attach to world), but you can remove the ones that you don\'t need to define right now and GMMaker will fill them in for you with the defaults.',
            insertText: `game.graphics.createDrawing({
  alpha: 1,
  xPos: 0,
  yPos: 0,
  angle: 0,
  xScale: 1,
  yScale: 1,
  attachTo: 'world',
  isBehind: false,
  noLerp: false,
  shapes: [],
});`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!graphicsDefineBoxShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a box shape for a drawing.',
            insertText: `{
  type: 'bx', 
  colour: 0xff0000,
  alpha: 1,
  xPos: 0,
  yPos: 0,
  angle: 0,
  width: 5,
  height: 5,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!graphicsDefineCircleShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a circle shape for a drawing.',
            insertText: `{
  type: 'ci', 
  colour: 0xff0000,
  alpha: 1,
  xPos: 0,
  yPos: 0,
  angle: 0,
  width: 5,
  height: 5,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!graphicsDefinePolygonShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a polygon shape for a drawing. The vertices make up a simple isosceles triangle, as an example.',
            insertText: `{
  type: 'po', 
  colour: 0xff0000,
  alpha: 1,
  xPos: 0,
  yPos: 0,
  angle: 0,
  xScale: 1,
  yScale: 1,
  vertices: [
    [2.5, 0],
    [5, 5],
    [0, 5],
  ],
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!graphicsDefineLineShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a line shape for a drawing.',
            insertText: `{
  type: 'li', 
  colour: 0xff0000,
  alpha: 1,
  xPos: 0,
  yPos: 0,
  xEnd: 2.5,
  yEnd: 5,
  width: 1,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!graphicsDefineTextShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a text shape for a drawing.',
            insertText: `{
  type: 'tx', 
  colour: 0xff0000,
  alpha: 1,
  xPos: 0,
  yPos: 0,
  angle: 0,
  text: 'Hello World!',
  size: 1,
  align: 'left',
  bold: false,
  italic: false,
  shadow: true,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
        ],
      };
    },
  });
};
