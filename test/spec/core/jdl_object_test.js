/**
 * Copyright 2013-2018 the original author or authors from the Simlife project.
 *
 * This file is part of the Simlife project, see http://www.simlife.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-new, no-unused-expressions */
const expect = require('chai').expect;

const BinaryOptions = require('../../../lib/core/simlife/binary_options');
const UnaryOptions = require('../../../lib/core/simlife/unary_options');
const RelationshipTypes = require('../../../lib/core/simlife/relationship_types');
const JDLObject = require('../../../lib/core/jdl_object');
const JDLApplication = require('../../../lib/core/jdl_application');
const JDLEntity = require('../../../lib/core/jdl_entity');
const JDLField = require('../../../lib/core/jdl_field');
const JDLValidation = require('../../../lib/core/jdl_validation');
const JDLEnum = require('../../../lib/core/jdl_enum');
const JDLRelationship = require('../../../lib/core/jdl_relationship');
const JDLUnaryOption = require('../../../lib/core/jdl_unary_option');
const JDLBinaryOption = require('../../../lib/core/jdl_binary_option');

describe('JDLObject', () => {
  describe('#addApplication', () => {
    context('when adding an invalid application', () => {
      const object = new JDLObject();

      context('such as a nil application', () => {
        it('fails', () => {
          expect(() => {
            object.addApplication(null);
          }).to.throw('The application must be valid in order to be added.\nErrors: No application');
        });
      });
      context('such as an incomplete application', () => {
        it('fails', () => {
          expect(() => {
            object.addApplication({
              config: {
                baseName: 'toto'
              }
            });
          }).to.throw('The application must be valid in order to be added.\n' +
            'Errors: No authentication type, No build tool');
        });
      });
    });
    context('when adding a valid application', () => {
      let object = null;
      let application = null;

      before(() => {
        object = new JDLObject();
        application = new JDLApplication({ simlifeVersion: '4.9.0' });
        object.addApplication(application);
      });

      it('works', () => {
        expect(object.applications[application.config.baseName]).to.deep.eq(application);
      });
    });
  });
  describe('#getApplicationQuantity', () => {
    let jdlObject = null;

    before(() => {
      jdlObject = new JDLObject();
    });

    context('when having no application', () => {
      it('returns 0', () => {
        expect(jdlObject.getApplicationQuantity()).to.equal(0);
      });
    });

    context('when having one or more applications', () => {
      before(() => {
        jdlObject.addApplication(new JDLApplication({}));
      });

      it('returns the number of applications', () => {
        expect(jdlObject.getApplicationQuantity()).to.equal(1);
      });
    });
  });
  describe('#addEntity', () => {
    context('when adding an invalid entity', () => {
      const object = new JDLObject();

      context('such as a nil object', () => {
        it('fails', () => {
          expect(() => {
            object.addEntity(null);
          }).to.throw('The entity must be valid in order to be added.\nErrors: No entity');
        });
      });
      context('such as an incomplete entity', () => {
        expect(() => {
          object.addEntity({
            name: 'Something',
            tableName: 't_something',
            fields: [{
              type: 'String',
              comment: 'comment',
              validations: []
            }]
          });
        }).to.throw('The entity must be valid in order to be added.\nErrors: For field #1: No field name');
      });
    });
    context('when adding a valid entity', () => {
      let object = null;
      let entity = null;

      before(() => {
        object = new JDLObject();
        entity = new JDLEntity({
          name: 'Valid',
          tableName: 't_valid',
          fields: []
        });
        object.addEntity(entity);
      });

      it('works', () => {
        expect(object.entities[entity.name]).to.deep.eq(entity);
      });
    });
    context('when adding an entity with the same name', () => {
      let object = null;
      let entity = null;
      let entity2 = null;

      before(() => {
        object = new JDLObject();
        entity = new JDLEntity({
          name: 'Valid',
          tableName: 't_valid',
          fields: []
        });
        object.addEntity(entity);
        entity2 = new JDLEntity({
          name: 'Valid',
          tableName: 't_valid2',
          fields: []
        });
        object.addEntity(entity2);
      });

      it('replaces the former one', () => {
        expect(object.entities[entity.name]).to.deep.eq(entity2);
      });
    });
  });
  describe('#getEntityQuantity', () => {
    let jdlObject = null;

    before(() => {
      jdlObject = new JDLObject();
    });

    context('when having no entity', () => {
      it('returns 0', () => {
        expect(jdlObject.getEntityQuantity()).to.equal(0);
      });
    });

    context('when having one or more entities', () => {
      before(() => {
        jdlObject.addEntity(new JDLEntity({
          name: 'toto'
        }));
      });

      it('returns the number of entities', () => {
        expect(jdlObject.getEntityQuantity()).to.equal(1);
      });
    });
  });
  describe('#getEntityNames', () => {
    let jdlObject = null;

    before(() => {
      jdlObject = new JDLObject();
    });

    afterEach(() => {
      jdlObject = new JDLObject();
    });

    context('when having no entity', () => {
      it('returns an empty list', () => {
        expect(jdlObject.getEntityNames()).to.be.empty;
      });
    });
    context('when having entities', () => {
      before(() => {
        jdlObject.addEntity(new JDLEntity({ name: 'A' }));
        jdlObject.addEntity(new JDLEntity({ name: 'B' }));
        jdlObject.addEntity(new JDLEntity({ name: 'C' }));
      });

      it('returns the entity names', () => {
        expect(jdlObject.getEntityNames()).to.deep.equal(['A', 'B', 'C']);
      });
    });
  });
  describe('#addEnum', () => {
    context('when adding an invalid enum', () => {
      const object = new JDLObject();

      context('such as a nil enum', () => {
        it('fails', () => {
          expect(() => {
            object.addEnum(null);
          }).to.throw('The enum must be valid in order to be added.\nErrors: No enumeration');
        });
      });
      context('such as an incomplete enum', () => {
        it('fails', () => {
          expect(() => {
            object.addEnum({ values: ['A', 'B'] });
          }).to.throw('The enum must be valid in order to be added.\nErrors: No enumeration name');
        });
      });
    });
    context('when adding a valid enum', () => {
      let object = null;
      let enumObject = null;

      before(() => {
        object = new JDLObject();
        enumObject = new JDLEnum({ name: 'Valid' });
        object.addEnum(enumObject);
      });

      it('works', () => {
        expect(object.enums[enumObject.name]).to.deep.eq(enumObject);
      });
    });
    context('when adding an enum with the same name', () => {
      let object = null;
      let enumObject = null;
      let enumObject2 = null;

      before(() => {
        object = new JDLObject();
        enumObject = new JDLEnum({ name: 'Valid' });
        object.addEnum(enumObject);
        enumObject2 = new JDLEnum({ name: 'Valid', values: ['A', 'B'] });
        object.addEnum(enumObject2);
      });

      it('replaces the old one', () => {
        expect(object.enums[enumObject.name]).to.deep.eq(enumObject2);
      });
    });
  });
  describe('#getEnumQuantity', () => {
    let jdlObject = null;

    before(() => {
      jdlObject = new JDLObject();
    });

    context('when having no enum', () => {
      it('returns 0', () => {
        expect(jdlObject.getEnumQuantity()).to.equal(0);
      });
    });

    context('when having one or more enums', () => {
      before(() => {
        jdlObject.addEnum(new JDLEnum({
          name: 'toto'
        }));
      });

      it('returns the number of enums', () => {
        expect(jdlObject.getEnumQuantity()).to.equal(1);
      });
    });
  });
  describe('#addRelationship', () => {
    context('when adding an invalid relationship', () => {
      const object = new JDLObject();

      context('such as a nil relationship', () => {
        it('fails', () => {
          expect(() => {
            object.addRelationship(null);
          }).to.throw('The relationship must be valid in order to be added.\nErrors: No relationship');
        });
      });
      context('such as an incomplete relationship', () => {
        it('fails', () => {
          expect(() => {
            object.addRelationship({
              from: {},
              to: { name: 'Valid', tableName: 't_valid', fields: [] },
              type: RelationshipTypes.MANY_TO_MANY,
              injectedFieldInFrom: 'something'
            });
          }).to.throw('The relationship must be valid in order to be added.\n' +
            'Errors: Wrong source entity: No entity name, No table name, No fields object');
        });
      });
    });
    context('when adding a valid relationship', () => {
      let object = null;
      let relationship = null;

      before(() => {
        object = new JDLObject();
        relationship = new JDLRelationship({
          from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
          to: { name: 'Valid', tableName: 't_valid', fields: [] },
          type: RelationshipTypes.MANY_TO_MANY,
          injectedFieldInFrom: 'something'
        });
        object.addRelationship(relationship);
      });

      it('works', () => {
        expect(object.relationships.relationships.ManyToMany[relationship.getId()]).to.deep.eq(relationship);
      });
    });
    context('when adding twice the same relationship', () => {
      let object = null;

      before(() => {
        object = new JDLObject();
        const relationship = new JDLRelationship({
          from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
          to: { name: 'Valid', tableName: 't_valid', fields: [] },
          type: RelationshipTypes.MANY_TO_MANY,
          injectedFieldInFrom: 'something'
        });
        object.addRelationship(relationship);
        object.addRelationship(relationship);
      });

      it('doesn\'t do anything', () => {
        expect(Object.keys(object.relationships.relationships.ManyToMany)).to.have.lengthOf(1);
      });
    });
  });
  describe('#getRelationshipQuantity', () => {
    let jdlObject = null;

    before(() => {
      jdlObject = new JDLObject();
    });

    context('when having no relationship', () => {
      it('returns 0', () => {
        expect(jdlObject.getRelationshipQuantity()).to.equal(0);
      });
    });

    context('when having one or more relationships', () => {
      before(() => {
        jdlObject.addRelationship(new JDLRelationship({
          from: new JDLEntity({ name: 'a' }),
          to: new JDLEntity({ name: 'b' }),
          type: RelationshipTypes.ONE_TO_ONE,
          injectedFieldInFrom: 'b'
        }));
      });

      it('returns the number of relationships', () => {
        expect(jdlObject.getRelationshipQuantity()).to.equal(1);
      });
    });
  });
  describe('#addOption', () => {
    context('when adding an invalid option', () => {
      const object = new JDLObject();

      context('such as a nil option', () => {
        it('fails', () => {
          expect(() => {
            object.addOption(null);
          }).to.throw('The option must be valid in order to be added.\nErrors: No option');
        });
      });
      context('such as an empty object', () => {
        it('fails', () => {
          expect(() => {
            object.addOption({});
          }).to.throw('The option must be valid in order to be added.\n' +
            'Errors: No option name, No entity names, No excluded names, No type');
        });
      });
      context('such as a wrong option/value', () => {
        it('fails', () => {
          expect(() => {
            object.addOption({
              name: UnaryOptions.SKIP_CLIENT,
              type: 'WrongType'
            });
          }).to.throw('The option must be valid in order to be added.\n' +
            'Errors: No entity names, No excluded names, No type');
        });
      });
    });
    context('when adding a valid option', () => {
      it('works', () => {
        new JDLObject().addOption(new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT }));
      });
    });
  });
  describe('#getOptionsForName', () => {
    let jdlObject = null;

    before(() => {
      jdlObject = new JDLObject();
    });

    afterEach(() => {
      jdlObject = new JDLObject();
    });

    context('when passing an invalid name', () => {
      it('returns an empty array', () => {
        expect(jdlObject.getOptionsForName()).to.be.empty;
      });
    });
    context('when checking for an absent option', () => {
      it('returns an empty array', () => {
        expect(jdlObject.getOptionsForName(UnaryOptions.SKIP_CLIENT)).to.be.empty;
      });
    });
    context('when checking for a present option', () => {
      let option1 = null;
      let option2 = null;
      let option3 = null;

      before(() => {
        option1 = new JDLUnaryOption({
          name: UnaryOptions.SKIP_CLIENT
        });
        option2 = new JDLBinaryOption({
          name: BinaryOptions.Options.SERVICE,
          value: BinaryOptions.Values.service.SERVICE_CLASS
        });
        option3 = new JDLBinaryOption({
          name: BinaryOptions.Options.SERVICE,
          value: BinaryOptions.Values.service.SERVICE_IMPL
        });

        jdlObject.addOption(option1);
        jdlObject.addOption(option2);
        jdlObject.addOption(option3);
      });

      it('returns it', () => {
        expect(jdlObject.getOptionsForName(UnaryOptions.SKIP_CLIENT)).to.deep.equal([option1]);
        expect(jdlObject.getOptionsForName(BinaryOptions.Options.SERVICE)).to.deep.equal([option2, option3]);
      });
    });
  });
  describe('#getOptionQuantity', () => {
    let jdlObject = null;

    before(() => {
      jdlObject = new JDLObject();
    });

    context('when having no option', () => {
      it('returns 0', () => {
        expect(jdlObject.getOptionQuantity()).to.equal(0);
      });
    });

    context('when having one or more options', () => {
      before(() => {
        jdlObject.addOption(new JDLUnaryOption({
          name: UnaryOptions.SKIP_CLIENT
        }));
      });

      it('returns the number of options', () => {
        expect(jdlObject.getOptionQuantity()).to.equal(1);
      });
    });
  });
  describe('#isEntityInMicroservice', () => {
    let jdlObject = null;

    context('when an entity is in a microservice', () => {
      context('because no entity name has been specified', () => {
        before(() => {
          jdlObject = new JDLObject();
          const microserviceOption = new JDLBinaryOption({
            name: BinaryOptions.Options.MICROSERVICE,
            value: 'toto'
          });
          jdlObject.addOption(microserviceOption);
        });

        it('returns true', () => {
          expect(jdlObject.isEntityInMicroservice('A')).to.be.true;
        });
      });

      context('because entity names have been specified', () => {
        before(() => {
          jdlObject = new JDLObject();
          const microserviceOption = new JDLBinaryOption({
            name: BinaryOptions.Options.MICROSERVICE,
            value: 'toto',
            entityNames: ['A']
          });
          jdlObject.addOption(microserviceOption);
        });

        it('returns true', () => {
          expect(jdlObject.isEntityInMicroservice('A')).to.be.true;
        });
      });
    });
    context('when an entity is not in a microservice', () => {
      before(() => {
        jdlObject = new JDLObject();
        const microserviceOption = new JDLBinaryOption({
          name: BinaryOptions.Options.MICROSERVICE,
          value: 'toto',
          entityNames: ['A']
        });
        jdlObject.addOption(microserviceOption);
      });

      it('returns false', () => {
        expect(jdlObject.isEntityInMicroservice('B')).to.be.false;
      });
    });
  });
  describe('#toString', () => {
    let application = null;
    let object = null;
    let entityA = null;
    let entityB = null;
    let enumObject = null;
    let relationship = null;
    let option = null;
    let option2 = null;

    before(() => {
      object = new JDLObject();
      application = new JDLApplication({ simlifeVersion: '4.9.0' });
      object.addApplication(application);
      entityA = new JDLEntity({ name: 'EntityA', tableName: 't_entity_a' });
      const field = new JDLField({ name: 'myField', type: 'String' });
      field.addValidation(new JDLValidation());
      entityA.addField(field);
      object.addEntity(entityA);
      entityB = new JDLEntity({ name: 'EntityB', tableName: 't_entity_b' });
      object.addEntity(entityB);
      enumObject = new JDLEnum({ name: 'MyEnum', values: ['A', 'B'] });
      object.addEnum(enumObject);
      relationship = new JDLRelationship({
        from: entityA,
        to: entityB,
        type: RelationshipTypes.ONE_TO_ONE,
        injectedFieldInFrom: 'entityB',
        injectedFieldInTo: 'entityA(myField)'
      });
      object.addRelationship(relationship);
      option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      option.excludeEntity(entityA);
      object.addOption(option);
      option2 = new JDLBinaryOption({
        name: BinaryOptions.Options.DTO,
        value: BinaryOptions.Values.dto.MAPSTRUCT
      });
      option2.addEntity(entityB);
      object.addOption(option2);
    });

    it('stringifies the JDL object', () => {
      expect(object.toString()).to.eq(
        `${application.toString()}

${entityA.toString()}
${entityB.toString()}
${enumObject.toString()}

${relationship.toString()}

${option.toString()}
${option2.toString()}
`);
    });
  });
});
