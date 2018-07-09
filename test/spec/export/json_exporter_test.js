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
const fs = require('fs');

const fail = expect.fail;
const Exporter = require('../../../lib/export/json_exporter');
const JDLParser = require('../../../lib/parser/jdl_parser');
const EntityParser = require('../../../lib/parser/entity_parser');
const parseFromFiles = require('../../../lib/reader/jdl_reader').parseFromFiles;

describe('::exportToJSON', () => {
  describe('when passing invalid parameters', () => {
    describe('such as undefined', () => {
      it('throws an error', () => {
        try {
          Exporter.exportToJSON();
          fail();
        } catch (error) {
          expect(error.name).to.eq('NullPointerException');
        }
      });
    });
  });
  describe('when passing valid arguments', () => {
    describe('when exporting JDL to entity json for SQL type', () => {
      const input = parseFromFiles(['./test/test_files/complex_jdl.jdl']);
      const content = EntityParser.parse({
        jdlObject: JDLParser.parse(input, 'sql'),
        databaseType: 'sql'
      });
      Exporter.exportToJSON(content);
      const department = JSON.parse(fs.readFileSync('.simlife/Department.json', { encoding: 'utf-8' }));
      const jobHistory = JSON.parse(fs.readFileSync('.simlife/JobHistory.json', { encoding: 'utf-8' }));
      it('exports it', () => {
        expect(fs.statSync('.simlife/Department.json').isFile()).to.be.true;
        expect(fs.statSync('.simlife/JobHistory.json').isFile()).to.be.true;
        expect(fs.statSync('.simlife/Job.json').isFile()).to.be.true;
        expect(fs.statSync('.simlife/Employee.json').isFile()).to.be.true;
        expect(fs.statSync('.simlife/Location.json').isFile()).to.be.true;
        expect(fs.statSync('.simlife/Task.json').isFile()).to.be.true;
        expect(fs.statSync('.simlife/Country.json').isFile()).to.be.true;
        expect(fs.statSync('.simlife/Region.json').isFile()).to.be.true;
        expect(department.relationships).to.deep.eq([
          {
            relationshipType: 'one-to-one',
            relationshipName: 'location',
            otherEntityName: 'location',
            otherEntityField: 'id',
            ownerSide: true,
            otherEntityRelationshipName: 'department'
          },
          {
            relationshipType: 'one-to-many',
            javadoc: 'A relationship',
            relationshipName: 'employee',
            otherEntityName: 'employee',
            otherEntityRelationshipName: 'department'
          }
        ]);
        expect(department.fields).to.deep.eq([
          {
            fieldName: 'departmentId',
            fieldType: 'Long'
          },
          {
            fieldName: 'departmentName',
            fieldType: 'String',
            fieldValidateRules: ['required']
          },
          {
            fieldName: 'description',
            fieldType: 'byte[]',
            fieldTypeBlobContent: 'text'
          },
          {
            fieldName: 'advertisement',
            fieldType: 'byte[]',
            fieldTypeBlobContent: 'any'
          },
          {
            fieldName: 'logo',
            fieldType: 'byte[]',
            fieldTypeBlobContent: 'image'
          }
        ]);
        expect(department.dto).to.eq('no');
        expect(department.service).to.eq('no');
        expect(department.pagination).to.eq('no');
        expect(jobHistory.relationships).to.deep.eq([
          {
            relationshipType: 'one-to-one',
            relationshipName: 'department',
            otherEntityName: 'department',
            otherEntityField: 'id',
            ownerSide: true,
            otherEntityRelationshipName: 'jobHistory'
          },
          {
            relationshipType: 'one-to-one',
            relationshipName: 'job',
            otherEntityName: 'job',
            otherEntityField: 'id',
            ownerSide: true,
            otherEntityRelationshipName: 'jobHistory'
          },
          {
            relationshipType: 'one-to-one',
            relationshipName: 'employee',
            otherEntityName: 'employee',
            otherEntityField: 'id',
            ownerSide: true,
            otherEntityRelationshipName: 'jobHistory'
          }
        ]);
        expect(jobHistory.fields).to.deep.eq([
          {
            fieldName: 'startDate',
            fieldType: 'ZonedDateTime'
          },
          {
            fieldName: 'endDate',
            fieldType: 'ZonedDateTime'
          },
          {
            fieldName: 'language',
            fieldType: 'Language',
            fieldValues: 'FRENCH,ENGLISH,SPANISH'
          }
        ]);
        expect(jobHistory.dto).to.eq('no');
        expect(jobHistory.service).to.eq('no');
        expect(jobHistory.pagination).to.eq('infinite-scroll');
        // clean up the mess...
        fs.unlinkSync('.simlife/Department.json');
        fs.unlinkSync('.simlife/JobHistory.json');
        fs.unlinkSync('.simlife/Job.json');
        fs.unlinkSync('.simlife/Employee.json');
        fs.unlinkSync('.simlife/Location.json');
        fs.unlinkSync('.simlife/Task.json');
        fs.unlinkSync('.simlife/Country.json');
        fs.unlinkSync('.simlife/Region.json');
        fs.rmdirSync('.simlife');
      });
    });
    describe('when exporting JDL to entity json for an existing entity', () => {
      let input = parseFromFiles(['./test/test_files/valid_jdl.jdl']);
      let content = EntityParser.parse({
        jdlObject: JDLParser.parse(input, 'sql'),
        databaseType: 'sql'
      });
      it('exports it with same changeLogDate', (done) => {
        Exporter.exportToJSON(content);
        expect(fs.statSync('.simlife/A.json').isFile()).to.be.true;
        const changeLogDate = JSON.parse(fs.readFileSync('.simlife/A.json', { encoding: 'utf-8' })).changelogDate;
        setTimeout(() => {
          input = parseFromFiles(['./test/test_files/valid_jdl.jdl']);
          content = EntityParser.parse({
            jdlObject: JDLParser.parse(input, 'sql'),
            databaseType: 'sql'
          });
          Exporter.exportToJSON(content, true);
          expect(fs.statSync('.simlife/A.json').isFile()).to.be.true;
          const newChangeLogDate = JSON.parse(fs.readFileSync('.simlife/A.json', { encoding: 'utf-8' })).changelogDate;
          expect(newChangeLogDate).to.eq(changeLogDate);
          // clean up the mess...
          fs.unlinkSync('.simlife/A.json');
          fs.unlinkSync('.simlife/B.json');
          fs.unlinkSync('.simlife/C.json');
          fs.unlinkSync('.simlife/D.json');
          fs.rmdirSync('.simlife');
          done();
        }, 1000);
      });
    });
  });
});
