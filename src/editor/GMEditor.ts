import { mount } from 'svelte';
import EditorRoot from '../ui/EditorRoot.svelte';
import * as monaco from 'monaco-editor';

import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker&inline';
import TSWorker from 'monaco-editor/language/typescript/ts.worker.js?worker&inline';
import 'monaco-editor/languages/features/typescript/register';

globalThis.MonacoEnvironment = {
  getWorker: (_, label) => {
    if (label === 'typescript' || label === 'javascript')
      return new TSWorker();

    return new EditorWorker();
  },
};

export default class GMEditor {
  constructor() {
    mount(EditorRoot, {
      target: document.getElementById('pagecontainer') as HTMLElement,
    });

    monaco.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.typescript.ScriptTarget.ES2020,
      allowJs: true,
      allowNonTsExtensions: true,
      lib: ['es2015'],
    });

    const editor = monaco.editor.create(document.getElementById('gm-editor-workspace') as HTMLElement, {
      value: 'function hello() {\n\talert(\'Hello world!\');\n}',
      language: 'typescript',
    });

    const model = editor.getModel();
    console.log(model?.getLanguageId());
  }
}
