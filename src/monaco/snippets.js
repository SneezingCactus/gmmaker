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
            label: 'sh!eventStepAllDiscs',
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
            label: 'sh!eventDiscCollideDisc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "discCollision" targetting collisions with other discs.',
            insertText: 'game.events.addEventListener(\'discCollision\', {collideWith: \'disc\'}, function(discId, otherPlayerId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventDiscCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "discCollision" targetting collisions with arrows.',
            insertText: 'game.events.addEventListener(\'discCollision\', {collideWith: \'arrow\'}, function(discId, arrowId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventDiscCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "discCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'discCollision\', {collideWith: \'body\'}, function(discId, bodyData) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          // arrow collision events
          {
            label: 'sh!eventArrowCollideDisc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with discs.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'disc\'}, function(arrowId, discId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventArrowCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with other arrows.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'arrow\'}, function(arrowId, otherArrowId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventArrowCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'body\'}, function(arrowId, bodyData) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          // body collision events
          {
            label: 'sh!eventBodyCollideDisc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with discs.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'disc\'}, function(bodyData, discId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventBodyCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with arrows.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'arrow\'}, function(bodyData, arrowId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'sh!eventBodyCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'body\'}, function(bodyData, otherBodyData) {\n  //code goes here\n})',
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
          {
            label: 'sh!graphicsDefineImageShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining an image shape for a drawing.',
            insertText: `{
  type: 'im',
  id: 'image',
  region: {   // Only for demonstration purposes. Remove or edit to show full image instead of a 32x32 portion of it.
    xPos: 0,
    yPos: 0,
    width: 32,
    height: 32,
  },
  colour: 0xffffff,
  alpha: 1,
  xPos: 0,
  yPos: 0,
  angle: 0,
  width: 5,
  height: 5,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
        ],
      };
    },
  });
};
