import React, { useMemo, useState } from 'react';
import { Layout, Typography, Form } from 'antd';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import DraggableField from './BuilderComponents/DraggableField';
import CollectionAttributesForm from './BuilderComponents/AttributesForms/CollectionAttributesForm';
import { useCollectionManager_deprecated } from '@nocobase/client';
import DroppableAreaItems from './BuilderComponents/DroppableArea/DroppableAreaItems';
import BasicFieldEditor, { BasicField } from './BuilderComponents/BasicFieldEditor';

const { Sider, Content } = Layout;
const { Title } = Typography;


type InterfaceField = {
  group?: string;
  [key: string]: any;
};

type InterfacesMap = Record<string, InterfaceField>;

const SchemaBuilderComponent = () => {
  const {
    getTemplate,
    templates: collectionTemplates,
    getCollections,
    interfaces,
    getInterface,
    getCollectionFields,
  } = useCollectionManager_deprecated();

  const [searchTerm, setSearchTerm] = useState('');

  const [items, setItems] = useState<BasicField[]>([]);
  const [selectedItem, setSelectedItem] = useState<BasicField | null>(null);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [collectionMetaData, setCollectionMetaData] = useState({});

  const updateItem = (item: BasicField) => {
    setItems((prev) => prev.map((it) => (it.id === item.id ? item : it)));
    setSelectedItem(item);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
    }
  };

  const generateCode = () => {
    const collection = {
      ...collectionMetaData,
      fields: items.map(({ id, ...rest }) => rest),
    };
    return `import { defineCollection } from '@nocobase/database';\n\nexport default defineCollection(${JSON.stringify(
      collection,
      null,
      2,
    )});`;
  };

  const handleDragStart = (event) => {
    setActiveDragItem(event.active);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveDragItem(null);
      return;
    }

    const activeIndex = items.findIndex((i) => i.id === active.id);
    const overIndex = items.findIndex((i) => i.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      if (activeIndex !== overIndex) {
        setItems(arrayMove(items, activeIndex, overIndex));
      }
    } else if (over.id === 'drop-area' || overIndex !== -1) {
      const newItem = { ...(active.data.current || {}), id: `${active.id}-${Date.now()}` } as BasicField;
      const insertIndex = overIndex === -1 ? items.length : overIndex;
      const newItems = [...items];
      newItems.splice(insertIndex, 0, newItem);
      setItems(newItems);
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


  // Filter and group interfaces by "group"
  const groupedFields = useMemo(() => {
    return Object.entries(interfaces || {}).reduce((acc, [key, field]) => {
      // @ts-ignore
      const group = field.group || 'Ungrouped';
      const matchesSearch =
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(field).toLowerCase().includes(searchTerm.toLowerCase());

      if (matchesSearch) {
        if (!acc[group]) acc[group] = [];
        acc[group].push({ key, field });
      }

      return acc;
    }, {} as Record<string, { key: string; field: InterfaceField }[]>);
  }, [interfaces, searchTerm]);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Layout style={{ height: '85vh' }}>
        {/* Sidebar with field types */}
        <Sider width={200} style={{ background: '#fff', padding: 16, overflowY: 'auto' }}>
          <Title level={4}>Fields</Title>

          {Object.values(
            Object.entries(interfaces || {}).reduce((acc, [key, value]) => {
              // @ts-ignore
              const group = value.group || 'Ungrouped';
              if (!acc[group]) acc[group] = [];
              acc[group].push({ key, field: value });
              return acc;
            }, {} as Record<string, { key: string; field: any }[]>)
          ).map((groupedFields, i) => (
            <div key={i}>
              <h4>{groupedFields[0].field.group || 'Ungrouped'}</h4>
              {groupedFields.map(({ key, field }) => (
                <DraggableField key={key} field={field} />
              ))}
            </div>
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
          <DroppableAreaItems items={items} handleDragEnd={handleDragEnd} setSelectedItem={setSelectedItem} onDelete={removeItem} />
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
              <BasicFieldEditor
                item={selectedItem}
                onChange={updateItem}
                onRemove={removeItem}
              />
            )}
          </Form>
        </Sider>
      </Layout>

      <div style={{ textAlign: 'right', padding: '8px' }}>
        <button
          onClick={() => {
            const code = generateCode();
            navigator.clipboard.writeText(code);
          }}
        >
          Copy Code
        </button>
      </div>

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
