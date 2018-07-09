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

const fail = expect.fail;
const Reader = require('../../../lib/reader/json_file_reader');
const Parser = require('../../../lib/parser/json_parser');
const UnaryOptions = require('../../../lib/core/simlife/unary_options').UNARY_OPTIONS;
const BinaryOptions = require('../../../lib/core/simlife/binary_options').BINARY_OPTIONS;
const BinaryOptionValues = require('../../../lib/core/simlife/binary_options').BINARY_OPTION_VALUES;

describe('::parseEntities', () => {
  const entities = {
    Employee: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Employee.json'),
    Country: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Country.json'),
    Department: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Department.json'),
    JobHistory: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/JobHistory.json'),
    Location: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Location.json'),
    Region: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Region.json'),
    Job: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Job.json'),
    Task: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Task.json')
  };
  entities.Employee.relationships.filter(r => r.relationshipName === 'department')[0].javadoc = undefined;
  const content = Parser.parseEntities(entities);
  describe('when parsing a JSON entity to JDL', () => {
    it('parses entity javadoc', () => {
      expect(content.entities.Employee.comment).eq('The Employee entity.');
    });
    it('parses tableName', () => {
      expect(content.entities.Employee.tableName).eq('emp');
    });
    it('parses mandatory fields', () => {
      expect(content.entities.Country.fields.countryId.type).eq('Long');
      expect(content.entities.Country.fields.countryName.type).eq('String');
    });
    it('parses field javadoc', () => {
      expect(content.entities.Country.fields.countryId.comment).eq('The country Id');
      expect(content.entities.Country.fields.countryName.comment).to.be.undefined;
    });
    it('parses validations', () => {
      expect(content.entities.Department.fields.departmentName.validations.required.name).eq('required');
      expect(content.entities.Department.fields.departmentName.validations.required.value).to.be.undefined;
      expect(content.entities.Employee.fields.salary.validations.min.value).eq(10000);
      expect(content.entities.Employee.fields.salary.validations.max.value).eq(1000000);
      expect(content.entities.Employee.fields.employeeId.validations).to.be.empty;
    });
    it('parses enums', () => {
      expect(content.enums.Language.name).eq('Language');
      expect(content.enums.Language.values.has('FRENCH')).to.be.true;
      expect(content.enums.Language.values.has('ENGLISH')).to.be.true;
      expect(content.enums.Language.values.has('SPANISH')).to.be.true;
    });
    it('parses options', () => {
      expect(
        content.getOptions().filter(
          option => option.name === BinaryOptions.DTO
            && option.value === BinaryOptionValues.dto.MAPSTRUCT
            && option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option => option.name === BinaryOptions.PAGINATION
            && option.value === BinaryOptionValues.pagination['INFINITE-SCROLL']
            && option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option => option.name === BinaryOptions.SERVICE
            && option.value === BinaryOptionValues.service.SERVICE_CLASS
            && option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option => option.name === BinaryOptions.SEARCH_ENGINE
            && option.value === BinaryOptionValues.searchEngine.ELASTIC_SEARCH
            && option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option => option.name === BinaryOptions.MICROSERVICE
            && option.value === 'mymicroservice'
            && option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option => option.name === BinaryOptions.ANGULAR_SUFFIX
            && option.value === 'myentities'
            && option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option =>
            option.name === UnaryOptions.NO_FLUENT_METHOD &&
          option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option =>
            option.name === UnaryOptions.FILTER &&
            option.entityNames.has('Employee')
        ).length
      ).to.eq(1);
    });
  });

  describe('when parsing JSON entities to JDL', () => {
    it('parses unidirectional OneToOne relationships', () => {
      expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Department{location}_Location');
    });
    it('parses bidirectional OneToOne relationships', () => {
      expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Country{region}_Region{country}');
    });
    it('parses bidirectional OneToMany relationships', () => {
      expect(
        content.relationships.relationships.OneToMany
      ).has.property('OneToMany_Department{employee}_Employee{department(foo)}');
    });
    it('parses unidirectional ManyToOne relationships', () => {
      expect(content.relationships.relationships.ManyToOne).has.property('ManyToOne_Employee{manager}_Employee');
    });
    it('parses ManyToMany relationships', () => {
      expect(content.relationships.relationships.ManyToMany).has.property('ManyToMany_Job{task(title)}_Task{job}');
    });
    it('parses comments in relationships for owner', () => {
      expect(
        content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInFrom
      ).to.eq('A relationship');
      expect(
        content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInTo
      ).to.be.undefined;
    });
    it('parses comments in relationships for owned', () => {
      const entities = {
        Department: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Department.json'),
        Employee: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Employee.json')
      };
      entities.Department.relationships.filter(r => r.relationshipName === 'employee')[0].javadoc = undefined;
      const content = Parser.parseEntities(entities);
      expect(
        content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInFrom
      ).to.be.undefined;
      expect(
        content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInTo
      ).to.eq('Another side of the same relationship');
    });
    it('parses required relationships in owner', () => {
      expect(
        content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].isInjectedFieldInFromRequired
      ).to.be.true;
      expect(
        content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].isInjectedFieldInToRequired
      ).to.be.undefined;
    });
    it('parses required relationships in owned', () => {
      expect(
        content.relationships.relationships.ManyToMany['ManyToMany_Job{task(title)}_Task{job}'].isInjectedFieldInToRequired
      ).to.be.true;
      expect(
        content.relationships.relationships.ManyToMany['ManyToMany_Job{task(title)}_Task{job}'].isInjectedFieldInFromRequired
      ).to.be.undefined;
    });
  });

  describe('when parsing app config file to JDL', () => {
    const yoRcJson = Reader.readEntityJSON('./test/test_files/simlife_app/.yo-rc.json');
    const content = Parser.parseServerOptions(yoRcJson['generator-simlife']);
    it('parses server options', () => {
      expect(content.getOptions().filter(
        option => option.name === UnaryOptions.SKIP_CLIENT && option.entityNames.has('*')).length
      ).to.eq(1);
      expect(
        content.getOptions().filter(
          option => option.name === UnaryOptions.SKIP_SERVER && option.entityNames.has('*')).length
      ).to.eq(1);
    });
  });

  describe('when parsing entities with relationships to User', () => {
    describe('when skipUserManagement flag is not set', () => {
      describe('when there is no User.json entity', () => {
        const entities = {
          Country: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Country.json')
        };
        const content = Parser.parseEntities(entities);
        it('parses relationships to the Simlife managed User entity', () => {
          expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Country{user}_User');
        });
      });
      describe('when there is a User.json entity', () => {
        it('throws an error ', () => {
          try {
            Parser.parseEntities({
              Country: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Country.json'),
              User: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Region.json')
            });
            fail();
          } catch (error) {
            expect(error.name).to.eq('IllegalNameException');
          }
        });
      });
    });
    describe('when skipUserManagement flag is set', () => {
      const entities = {
        Country: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Country.json'),
        User: Reader.readEntityJSON('./test/test_files/simlife_app/.simlife/Region.json')
      };
      entities.User.relationships[0].otherEntityRelationshipName = 'user';
      const yoRcJson = Reader.readEntityJSON('./test/test_files/simlife_app/.yo-rc.json');
      yoRcJson['generator-simlife'].skipUserManagement = true;
      const content = Parser.parseServerOptions(yoRcJson['generator-simlife']);
      Parser.parseEntities(entities, content);
      it('parses the User.json entity if skipUserManagement flag is set', () => {
        expect(content.entities.Country).not.to.be.undefined;
        expect(content.entities.User).not.to.be.undefined;
        expect(content.entities.User.fields.regionId).not.to.be.undefined;
        expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Country{user}_User{country}');
      });
    });
  });
});
