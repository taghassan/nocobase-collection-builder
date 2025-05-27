import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CollectionFieldInterface } from '@nocobase/client';
import { getFieldTitle } from '../../../utils';

const DraggableField = ({ field }: { field: CollectionFieldInterface }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: field.name,
    data: field,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8, cursor: 'grab' }}
    >
      {getFieldTitle({ field })}
    </div>
  );
};
export default DraggableField;
