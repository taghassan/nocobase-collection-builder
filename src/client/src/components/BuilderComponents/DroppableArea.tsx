import React, { useState } from 'react';

import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

const DroppableArea = ({ onDrop, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id: 'drop-area' });
  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 400,
        padding: 16,
        border: '2px dashed #aaa',
        background: isOver ? '#f0f0f0' : '#fff',
      }}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
