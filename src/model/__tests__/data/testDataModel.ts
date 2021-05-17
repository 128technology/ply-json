import * as fs from 'fs';
import * as path from 'path';

import { DataModel } from '@128technology/yinz-json';

const modelText = fs.readFileSync(path.join(__dirname, './/consolidatedT128Model.json'), 'utf8');

const dataModel = new DataModel({
  modelElement: JSON.parse(modelText),
  getRoot: doc => doc.children!.find(x => x.name === 'config')!.children!.find(x => x.name === 'authority')!
});

export default dataModel;
