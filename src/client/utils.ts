import {
  APIClient,
  CollectionFieldInterface,
  useActionContext,
  useCollectionManager_deprecated,
  useResourceActionContext,
  useResourceContext,
} from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import { useField, useForm } from '@formily/react';
import { cloneDeep } from 'lodash';

export const getFieldTitle = ({ field }: { field: CollectionFieldInterface }) => {
  const match = field.title.match(/{{t\("([^"]+)"\)}}/);
  const { t } = useTranslation();

  return t((match && match[1]) ?? field.name);
};

export const useCreateCollectionField = () => {
  const form = useForm();
  const { refreshCM } = useCollectionManager_deprecated();
  const ctx = useActionContext();
  const { refresh } = useResourceActionContext();
  const { resource } = useResourceContext();
  const field = useField();
  return {
    async run() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      const values = cloneDeep(form.values);
      if (values.autoCreateReverseField) {
        /* empty */
      } else {
        delete values.reverseField;
      }
      delete values.autoCreateReverseField;
      try {
        await resource.create({ values });
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

export const useAsyncDataSource = (api: APIClient) => async (field) => {
  // field.loading = true;
  console.log('useAsyncDataSource');
  const res = await api.request({ resource: 'collections', action: 'list' });
  return res?.data?.data || [];
};
