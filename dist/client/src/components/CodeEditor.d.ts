import React from 'react';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
declare const CodeEditor: ({ codeData }: {
    codeData: string;
}) => React.JSX.Element;
export default CodeEditor;
