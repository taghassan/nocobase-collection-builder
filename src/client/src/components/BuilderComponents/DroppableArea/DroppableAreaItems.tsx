import React from 'react';
import DroppableArea from '../DroppableArea';
import { Card } from 'antd';
import { CollectionFieldInterface } from '@nocobase/client';

const DroppableAreaItems = ({
  items,
  setSelectedItem,
  handleDragEnd,
}: {
  items: CollectionFieldInterface[];
  setSelectedItem;
  handleDragEnd;
}) => {
  return (
    <>
      <DroppableArea
        children={
          items.map((item) => (
            <Card key={item.name} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => setSelectedItem(item)}>
              {item.name}
            </Card>
          )) ?? []
        }
        onDrop={handleDragEnd}
      />
    </>
  );
};
export default DroppableAreaItems;
