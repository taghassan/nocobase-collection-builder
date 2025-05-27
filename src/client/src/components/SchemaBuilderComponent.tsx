import React, { useState } from 'react';
import { Layout, Typography, Form } from 'antd';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import DraggableField from './BuilderComponents/DraggableField';
import CollectionAttributesForm from './BuilderComponents/AttributesForms/CollectionAttributesForm';
import { useCollectionManager_deprecated } from '@nocobase/client';
import DroppableAreaItems from './BuilderComponents/DroppableArea/DroppableAreaItems';
import FieldAttributesForm from './BuilderComponents/AttributesForms/FieldAttributesForm';

const { Sider, Content } = Layout;
const { Title } = Typography;

const SchemaBuilderComponent = () => {
  const {
    getTemplate,
    templates: collectionTemplates,
    getCollections,
    interfaces,
    getInterface,
    getCollectionFields,
  } = useCollectionManager_deprecated();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [collectionMetaData, setCollectionMetaData] = useState({});

  const handleDragStart = (event) => {
    setActiveDragItem(event.active);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id === 'drop-area') {
      const newItem = { ...active.data.current, id: `${active.id}-${Date.now()}` };
      setItems([...items, newItem]);
    }
    setActiveDragItem(null);
  };

  useDndMonitor({
    onDragStart(event) {
      console.log('====================================');
      console.log('onDragStart:', event);
      console.log('====================================');
    },
    onDragMove(event) {
      console.log('====================================');
      console.log('onDragMove:', event);
      console.log('====================================');
    },
    onDragOver(event) {
      console.log('====================================');
      console.log('onDragOver:', event);
      console.log('====================================');
    },
    onDragEnd(event) {
      console.log('====================================');
      console.log('onDragEnd:', event);
      console.log('====================================');
    },
    onDragCancel(event) {
      console.log('====================================');
      console.log('onDragCancel:', event);
      console.log('====================================');
    },
  });

  // Step 1: Convert object to entries

  const sortedEntries = Object.entries(interfaces)
    // Step 2: Sort by the `order` value
    // @ts-ignore
    .sort(([, a], [, b]) => a.order - b.order);
  // Step 3: Convert back to an object
  const sortedObject = Object.fromEntries(sortedEntries);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Layout style={{ height: '85vh' }}>
        {/* Sidebar with field types */}
        <Sider width={200} style={{ background: '#fff', padding: 16, overflowY: 'auto' }}>
          <Title level={4}>Fields</Title>

          {(Object.keys(interfaces) ?? []).map((index) => (
            <DraggableField key={index} field={interfaces[index] || {}} />
          ))}
        </Sider>

        {/* Workspace */}
        <Content
          id={'DroppableAreaContent'}
          style={{ padding: 24, background: '#f9f9f9', flex: 1 }}
          onClick={(event) => {
            // @ts-ignore
            if (event?.target?.className != 'ant-card-body') {
              setSelectedItem(null);
            }
          }}
        >
          <Title level={4}>Workspace</Title>
          <DroppableAreaItems items={items} handleDragEnd={handleDragEnd} setSelectedItem={setSelectedItem} />
        </Content>

        {/* Properties Panel */}
        <Sider width={'60%'} style={{ background: '#fff', padding: 16, overflowY: 'auto' }}>
          <Title level={4}>Properties</Title>
          <Form layout="vertical">
            {!selectedItem ? (
              <CollectionAttributesForm
                collectionMetaData={collectionMetaData}
                setCollectionMetaData={setCollectionMetaData}
              />
            ) : (
              <FieldAttributesForm selectedItem={selectedItem} />
            )}
          </Form>
        </Sider>
      </Layout>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragItem ? (
          <div
            style={{
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            {activeDragItem?.data?.current?.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SchemaBuilderComponent;
