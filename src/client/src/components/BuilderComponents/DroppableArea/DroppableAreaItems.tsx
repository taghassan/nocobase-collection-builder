import React from 'react';
import DroppableArea from '../DroppableArea';
import { Card, Button } from 'antd';
import { CollectionFieldInterface } from '@nocobase/client';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ item, onClick, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    cursor: 'move',
  } as React.CSSProperties;

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onClick(item)}>
      {item.name}
      <Button danger size="small" style={{ float: 'right' }} onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
        delete
      </Button>
    </Card>
  );
};

const DroppableAreaItems = ({
  items,
  setSelectedItem,
  handleDragEnd,
  onDelete,
}: {
  items: CollectionFieldInterface[];
  setSelectedItem;
  handleDragEnd;
  onDelete: (id: string) => void;
}) => {
  return (
    <DroppableArea onDrop={handleDragEnd}
      children={
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} onClick={setSelectedItem} onDelete={onDelete} />
          ))}
        </SortableContext>
      }
    />
  );
};

export default DroppableAreaItems;
