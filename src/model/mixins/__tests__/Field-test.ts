import { expect } from 'chai';
import { Model, Choice, DataModel } from '@128technology/yinz-json';

import Field from '../Field';
import applyMixins from '../../../util/applyMixins';

describe('Field Mixin', () => {
  class Test implements Field {
    public id: Field['id'];
    public label: Field['label'];
    public customComponent: Field['customComponent'];
    public parent: Field['parent'];
    public type: Field['type'];
    public default: Field['default'];
    public readOnly: Field['readOnly'];
    public required: Field['required'];
    public visibility: Field['visibility'];
    public choice: Field['choice'];
    public addChoice: Field['addChoice'];
    public addDefault: Field['addDefault'];
    public addFieldProps: Field['addFieldProps'];
    public addReadOnly: Field['addReadOnly'];
    public addRequired: Field['addRequired'];
    public addType: Field['addType'];
    public addVisibility: Field['addVisibility'];
    public baseSerialize: Field['baseSerialize'];
    public getDataModel: Field['getDataModel'];
    public getKeyNames: Field['getKeyNames'];
    public getLocation: Field['getLocation'];
    public getLocationDescriptor: Field['getLocationDescriptor'];
    public getPage: Field['getPage'];
    public getPresentationModel: Field['getPresentationModel'];
    public resolveModel: Field['resolveModel'];
    public translateType: Field['translateType'];
    public baseValidate: Field['baseValidate'];
    public model: Model | Choice;
  }

  applyMixins(Test, [Field]);

  const modelElement = {
    keyword: 'container',
    name: 'root',
    namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
    'module-prefix': 'test',
    nsmap: { test: 'http://foo.bar' },
    children: [
      {
        keyword: 'choice',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'foo',
        children: [
          {
            keyword: 'case',
            namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
            name: 'notNested',
            children: [
              {
                keyword: 'leaf',
                namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                name: 'bar',
                children: [
                  {
                    keyword: 'type',
                    namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                    name: 'string'
                  }
                ]
              }
            ]
          },
          {
            keyword: 'case',
            name: 'nested',
            namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
            children: [
              {
                keyword: 'container',
                namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                name: 'wrapper',
                children: [
                  {
                    keyword: 'leaf',
                    namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                    name: 'bar',
                    children: [
                      {
                        keyword: 'type',
                        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                        name: 'string'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const dataModel = new DataModel({
    modelElement,
    getRoot: doc => doc
  });

  it('adds a nested choice', () => {
    const testField = new Field();
    testField.model = dataModel.getModelForPath('root.wrapper.bar');

    testField.addChoice();

    expect(testField.choice).to.deep.equal({ case: 'nested', path: 'root.foo' });
  });

  it('adds a not nested choice', () => {
    const testField = new Field();
    testField.model = dataModel.getModelForPath('root.bar');

    testField.addChoice();

    expect(testField.choice).to.deep.equal({ case: 'notNested', path: 'root.foo' });
  });
});
