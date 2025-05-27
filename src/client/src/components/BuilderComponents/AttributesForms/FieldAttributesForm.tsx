import React, { useEffect, useMemo, useState } from 'react';
import {
  AddCollectionField,
  AddFieldAction,
  CollectionFieldInterface,
  Divider,
  IdFieldInterface,
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useCancelAction,
  useCollectionField_deprecated,
  useCollectionManager_deprecated,
  useCompile,
  useRecord,
  useResourceActionContext,
  useResourceContext,
} from '@nocobase/client';
import { getFieldTitle, useAsyncDataSource, useCreateCollectionField } from '../../../../utils';
import { Form, Select, Input } from 'antd';
import { useField, useForm } from '@formily/react';
import { cloneDeep, omit } from 'lodash';
import { ArrayTable } from '@formily/antd-v5';
import useDialect from '@nocobase/client/es/collection-manager/hooks/useDialect';
import { useTranslation } from 'react-i18next';


import CodeEditor from '../../CodeEditor';

import hash from 'object-hash';

// import * as components from '@nocobase/client/es/collection-manager/Configuration';


const useSyncFromDatabase = () => {
  const form = useForm();
  const { refreshCM } = useCollectionManager_deprecated();
  const ctx = useActionContext();
  const { refresh } = useResourceActionContext();
  const { targetKey } = useResourceContext();
  const { [targetKey]: filterByTk } = useRecord();
  const api = useAPIClient();
  const field = useField();
  return {
    async run() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      try {
        await api.resource(`collections`).setFields({
          filterByTk,
          values: omit(form.values, 'preview'),
        });
        ctx.setVisible(false);
        await form.reset();
        field.data.loading = false;
        refresh();
        await refreshCM();
      } catch (error) {
        field.data.loading = false;
      }
    },
  };
};

const FieldAttributesForm = (props: { selectedItem: CollectionFieldInterface }) => {
  const { selectedItem } = props;
  // @ts-ignore
  const { scope, getContainer,  children, trigger, align, database } = props;

  const record = useRecord();

  const collectionField = useCollectionField_deprecated();
  const collectionManager = useCollectionManager_deprecated();
  const generalTemplate = collectionManager.getTemplate('general');
  const { collections, getCollection } = collectionManager;
  const compile = useCompile();
  const [targetScope, setTargetScope] = useState();
  // const { isDialect } = useDialect();

  const fields = getCollection(record?.name)?.options?.fields || record?.fields || [];
  const { t } = useTranslation();

  const currentCollections = useMemo(() => {
    return collections.map((v) => {
      return {
        label: compile(v.title),
        value: v.name,
      };
    });
  }, []);

  const scopeKeyOptions = useMemo(() => {
    return fields
      .filter((v) => {
        return ['string', 'bigInt', 'integer'].includes(v.type);
      })
      .map((k) => {
        return {
          value: k.name,
          label: compile(k.uiSchema?.title),
        };
      });
  }, [fields?.length]);


  return (
    <>
      {/*{generalTemplate?.supportDataSourceType}*/}

      {getFieldTitle({ field: selectedItem })}
      {/*<AddCollectionField name={'id'}  />*/}
      <SchemaComponent
        schema={{
          'x-decorator': 'Form',
          'x-component': 'div',

          'x-component-props': {
            // width: width,
            style: {
              // maxWidth: width ? width : '520px',
              width: '100%',
            },
            afterOpenChange: () => {
              // initializerSetVisible(false);
            },
          },
          type: 'void',
          title: '',
          properties: {
            ...(selectedItem?.properties || {}),
          },
        }}
        distributed={false}
        //@ts-ignore
        //                components={{ ...components, ArrayTable }}
        scope={{
          createOnly: true,
          createMainOnly: true,
          isOverride: false,
          useSyncFromDatabase,

          // getContainer,
          useCancelAction,

          override: false,
          useCreateCollectionField: useCreateCollectionField,
          record,
          showReverseFieldConfig: true,
          targetScope,
          collections: currentCollections,
          // isDialect,
          disabledJSONB: false,
          scopeKeyOptions,
          editMainOnly: true,
          useAsyncDataSource:useAsyncDataSource,

          // ...scope,
          ...selectedItem?.default
        }}
      />

      <div>

        <CodeEditor codeData={JSON.stringify(selectedItem?.properties)}  />
        <CodeEditor codeData={JSON.stringify(selectedItem?.default)}  />


      </div>
    </>
  );
};
export default FieldAttributesForm;
