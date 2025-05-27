import React, { useEffect, useState, useMemo } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import {
  css,
  getConfigurableProperties,
  SchemaComponent,
  useActionContext,
  useCollectionManager_deprecated,
  useRequest,
  useResourceActionContext,
  useResourceContext,
  useColumnSchema,
  Checkbox,
} from '@nocobase/client';

import { ISchema, useField, useForm } from '@formily/react';

import { uid } from '@formily/shared';
import { cloneDeep } from 'lodash';

const CollectionAttributesForm = ({
  collectionMetaData,
  setCollectionMetaData,
}: {
  collectionMetaData;
  setCollectionMetaData;
}) => {
  const [packages, setPackages] = useState([]);

  const { data, loading } = useRequest({
    resource: 'pm',
    action: 'list',
  });

  return (
    <>
      <Form.Item label="Collection Name" name={'name'}>
        <Form.Item>
          <Input
            name={'name'}
            value={collectionMetaData?.name}
            onChange={(e) => {
              setCollectionMetaData({ ...collectionMetaData, [e.target.name]: e.target.value });
            }}
          />
        </Form.Item>

        <Form.Item name={'title'} label={'title'}>
          <Input
            name={'title'}
            value={collectionMetaData?.title}
            onChange={(e) => {
              setCollectionMetaData({ ...collectionMetaData, [e.target.name]: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item name={'origin'} label={'origin'}>
          <Select
            title={'origin'}
            key={'origin'}
            //@ts-ignore
            options={(data?.data ?? []).map((p) => {
              return {
                label: p.packageName,
                value: p.packageName,
              };
            })}
            onChange={(value, option) => {
              setCollectionMetaData({ ...collectionMetaData, ['origin']: value });
            }}
          />
        </Form.Item>

        <Form.Item name={'sortable'} label={'sortable'}>
          <Input
            name={'sortable'}
            value={collectionMetaData?.sortable ?? 'sort'}
            onChange={(e) => {
              setCollectionMetaData({ ...collectionMetaData, [e.target.name]: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item name={'createdBy'} label={'created By'}>
          <Switch
            title={'createdBy'}
            key={'createdBy'}
            value={true}
            onChange={(e) => {
              setCollectionMetaData({ ...collectionMetaData, ['createdBy']: e });
            }}
          />
        </Form.Item>
        <Form.Item name={'updatedBy'} label={'updated By'}>
          <Switch
            key={'updatedBy'}
            value={true}
            onChange={(e) => {
              setCollectionMetaData({ ...collectionMetaData, ['updatedBy']: e });
            }}
          />
        </Form.Item>
        <Form.Item name={'logging'} label={'logging'}>
          <Switch
            key={'logging'}
            value={true}
            onChange={(e) => {
              setCollectionMetaData({ ...collectionMetaData, ['logging']: e });
            }}
          />
        </Form.Item>
        <Form.Item name={'shared'} label={'shared'}>
          <Switch
            key={'shared'}
            value={true}
            onChange={(e) => {
              setCollectionMetaData({ ...collectionMetaData, ['shared']: e });
            }}
          />
        </Form.Item>
      </Form.Item>
    </>
  );
};

export default CollectionAttributesForm;
