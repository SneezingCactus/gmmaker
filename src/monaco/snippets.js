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
            insertText: 'game.events.addEventListener(\'step\', {perPlayer: false}, function() {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'aa',
          },
          {
            label: 'sh!eventStepAllPlayers',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "step" that gets called for every player that was in the room when the game started.',
            insertText: 'game.events.addEventListener(\'step\', {perPlayer: true}, function(id) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'aa',
          },
          {
            label: 'sh!eventRoundStartOnce',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "roundStart" that only happens once.',
            insertText: 'game.events.addEventListener(\'roundStart\', {perPlayer: false}, function() {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'aa',
          },
          {
            label: 'sh!eventRoundStartAllPlayers',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "roundStart" that gets called for every player that was in the room when the game started.',
            insertText: 'game.events.addEventListener(\'roundStart\', {perPlayer: true}, function(id) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'aa',
          },
          {
            label: 'sh!eventPlayerDie',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "playerDie".',
            insertText: 'game.events.addEventListener(\'playerDie\', null, function(id) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'aa',
          },

          // player collision events
          {
            label: 'sh!eventDiscCollideDisc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "discCollision" targetting collisions with other discs.',
            insertText: 'game.events.addEventListener(\'discCollision\', {collideWith: \'disc\'}, function(discId, otherPlayerId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'aba',
          },
          {
            label: 'sh!eventDiscCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "discCollision" targetting collisions with arrows.',
            insertText: 'game.events.addEventListener(\'discCollision\', {collideWith: \'arrow\'}, function(discId, arrowId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'abb',
          },
          {
            label: 'sh!eventDiscCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "discCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'discCollision\', {collideWith: \'body\'}, function(discId, bodyData) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'abc',
          },

          // arrow collision events
          {
            label: 'sh!eventArrowCollideDisc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with discs.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'disc\'}, function(arrowId, discId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'aca',
          },
          {
            label: 'sh!eventArrowCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with other arrows.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'arrow\'}, function(arrowId, otherArrowId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'acb',
          },
          {
            label: 'sh!eventArrowCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "arrowCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'arrowCollision\', {collideWith: \'body\'}, function(arrowId, bodyData) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'acc',
          },

          // body collision events
          {
            label: 'sh!eventBodyCollideDisc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with discs.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'disc\'}, function(bodyData, discId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'ada',
          },
          {
            label: 'sh!eventBodyCollideArrow',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with arrows.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'arrow\'}, function(bodyData, arrowId) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'adb',
          },
          {
            label: 'sh!eventBodyCollideBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Creates an event listener for "bodyCollision" targetting collisions with bodies.',
            insertText: 'game.events.addEventListener(\'bodyCollision\', {collideWith: \'body\'}, function(bodyData, otherBodyData) {\n  //code goes here\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'adc',
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
  pos: [0, 0],
  angle: 0,
  scale: [1, 1],
  attachTo: 'world',
  isBehind: false,
  shapes: [],
});`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'ba',
          },
          {
            label: 'sh!graphicsDefineBoxShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a box shape for a drawing.',
            insertText: `{
  type: 'bx',
  colour: 0xff0000,
  alpha: 1,
  pos: [0, 0],
  size: [5, 5],
  angle: 0,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'bb',
          },
          {
            label: 'sh!graphicsDefineCircleShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a circle shape for a drawing.',
            insertText: `{
  type: 'ci',
  colour: 0xff0000,
  alpha: 1,
  pos: [0, 0],
  size: [5, 5],
  angle: 0,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'bc',
          },
          {
            label: 'sh!graphicsDefinePolygonShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a polygon shape for a drawing. The vertices make up a simple isosceles triangle, as an example.',
            insertText: `{
  type: 'po',
  colour: 0xff0000,
  alpha: 1,
  pos: [0, 0],
  angle: 0,
  scale: [1, 1],
  vertices: [
    [2.5, 0],
    [5, 5],
    [0, 5],
  ],
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'bd',
          },
          {
            label: 'sh!graphicsDefineLineShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a line shape for a drawing.',
            insertText: `{
  type: 'li',
  colour: 0xff0000,
  alpha: 1,
  pos: [0, 0],
  end: [0, 0],
  width: 1,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'be',
          },
          {
            label: 'sh!graphicsDefineTextShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a text shape for a drawing.',
            insertText: `{
  type: 'tx',
  colour: 0xff0000,
  alpha: 1,
  pos: [0, 0],
  angle: 0,
  text: 'Hello World!',
  size: 1,
  align: 'left',
  bold: false,
  italic: false,
  shadow: true,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'bf',
          },
          {
            label: 'sh!graphicsDefineImageShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining an image shape for a drawing.',
            insertText: `{
  type: 'im',
  id: 'image',
  region: {   // Only for demonstration purposes. Remove or edit to show full image instead of a 32x32 portion of it.
    pos: [0, 0],
    size: [32, 32],
  },
  colour: 0xffffff,
  alpha: 1,
  pos: [0, 0],
  size: [1, 1],
  angle: 0,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'bg',
          },
          // -------------------------------------------------------------------------------------------------------- //
          // WORLD
          // -------------------------------------------------------------------------------------------------------- //
          {
            label: 'sh!worldCreateBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for creating a body, with a red fixture and a box shape.',
            insertText: `game.world.createBody({
  viewOrder: 0,
  bodyDef: {
    type: 'd',
    p: [0, 0],
    lv: [0, 0],
    a: 0,
    av: 0,
    fricp: false,
    fric: 1,
    de: 0.3,
    re: 0.8,
    ld: 0,
    ad: 0,
    fr: false,
    bu: false,
    cf: {
      x: 0,
      y: 0,
      w: true,
      ct: 0,
    },
    f_c: 1,
    f_p: true,
    f_1: true,
    f_2: true,
    f_3: true,
    f_4: true
  },
  fixtureDefs: [
    {
      f: 0xff0000,
      fp: null,
      fr: null,
      re: null,
      de: null,
      d: false,
      np: false,
      ng: false,
      ig: false
    }
  ],
  shapeDefs: [
    {
      type: 'bx',
      c: [0, 0],
      a: 0,
      w: 5,
      h: 5,
      sk: false
    }
  ],
});`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'ca',
          },
          {
            label: 'sh!worldAddFixtureShapeToBody',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for adding a fixture with a box shape to a body with id 0.',
            insertText: `game.world.addFixtureShapeToBody({
  bodyId: 0,
  fixtureDef: {
    f: 0xff0000,
    fp: null,
    fr: null,
    re: null,
    de: null,
    d: false,
    np: false,
    ng: false,
    ig: false
  },
  shapeDef: {
    type: 'bx',
    c: [0, 0],
    a: 0,
    w: 5,
    h: 5,
    sk: false
  },
});`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'cab',
          },
          {
            label: 'sh!worldDefineFixture',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a fixture to use in `game.graphics.createBody`.',
            insertText: `{
  n: 'fixture',
  f: 0xff0000,
  fp: null,
  fr: null,
  re: null,
  de: null,
  d: false,
  np: false,
  ng: false,
  ig: false,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'cb',
          },
          {
            label: 'sh!worldDefineBoxShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a box shape to use in `game.graphics.createBody`.',
            insertText: `{
  type: 'bx',
  c: [0, 0],
  a: 0,
  w: 5,
  h: 5,
  sk: false,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'cc',
          },
          {
            label: 'sh!worldDefineCircleShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a circle shape to use in `game.graphics.createBody`.',
            insertText: `{
  type: 'ci',
  c: [0, 0],
  r: 2.5,
  sk: false,
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'cd',
          },
          {
            label: 'sh!worldDefinePolygonShape',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Shortcut template for defining a polygon shape to use in `game.graphics.createBody`.',
            insertText: `{
  type: 'po',
  v: [
    [0, 0],
    [2.5, 0],
    [0, 2.5],
  ],
}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: 'ce',
          },
        ],
      };
    },
  });
};
