// CodeEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-beautify";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

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
},[code,codeData])

  useEffect(() => {
    if(code!=codeData){
      setCode(codeData);
    }
  }, [codeData]);
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
        wrapEnabled={true}
        readOnly={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          enableMobileMenu: true,
          showLineNumbers: true,
          tabSize: 2,
          wrap: true,
        }} />
    </div>
  );
};

export default CodeEditor;
