import React from 'react';
import { Input, Button, Form } from 'antd';

export interface BasicField {
  id: string;
  name: string;
  type?: string;
  [key: string]: any;
}

const BasicFieldEditor = ({ item, onChange, onRemove }: { item: BasicField; onChange: (it: BasicField) => void; onRemove: (id: string) => void }) => {
  return (
    <Form layout="vertical">
      <Form.Item label="Name">
        <Input value={item.name} onChange={(e) => onChange({ ...item, name: e.target.value })} />
      </Form.Item>
      {item.type !== undefined && (
        <Form.Item label="Type">
          <Input value={item.type} onChange={(e) => onChange({ ...item, type: e.target.value })} />
        </Form.Item>
      )}
      <Button danger onClick={() => onRemove(item.id)}>
        Delete
      </Button>
    </Form>
  );
};

export default BasicFieldEditor;
