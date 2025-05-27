import { Plugin } from '@nocobase/client';

// @ts-ignore
import { name } from '../../package.json';
import SchemaBuilderComponent from './src/components/SchemaBuilderComponent';

export class CollectionBuilderClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.pluginSettingsManager.add(name, {
      title: 'Schema Builder',
      icon: 'HighlightOutlined',
      Component: SchemaBuilderComponent,
      // Component: SchemaBuilderComponent,
    });
  }
}

export default CollectionBuilderClient;
