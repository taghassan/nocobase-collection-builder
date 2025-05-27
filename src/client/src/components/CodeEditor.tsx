// CodeEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-beautify";

const CodeEditor = ({codeData}:{codeData:string}) => {
  const [code, setCode] = useState<string>(codeData);
  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value || '');

  };

  const onLoad = () => {

  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(code), null, 2);
      setCode(formatted);
    } catch (err) {
      alert("Invalid JSON format");
    }
  };
useEffect(() => {
  handleFormat()
},[code])
  return (
    <div style={{ height: '90vh', padding: '1rem' }}>

      <AceEditor
        ref={editorRef}
        placeholder="Placeholder Text"
        mode="json"
        theme="monokai"
        name="blah2"
        onLoad={onLoad}
        onChange={handleEditorChange}
        fontSize={14}
        lineHeight={19}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          enableMobileMenu: true,
          showLineNumbers: true,
          tabSize: 2,
        }} />
    </div>
  );
};

export default CodeEditor;
