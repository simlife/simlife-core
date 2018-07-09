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
const toFilePath = require('../../../lib/reader/json_file_reader').toFilePath;
const doesfileExist = require('../../../lib/reader/json_file_reader').doesfileExist;
const readEntityJSON = require('../../../lib/reader/json_file_reader').readEntityJSON;

describe('JSONFileReader', () => {
  describe('::readEntityJSON', () => {
    describe('when passing an invalid argument', () => {
      describe('because it is nil', () => {
        it('fails', () => {
          try {
            readEntityJSON();
            fail();
          } catch (error) {
            expect(error.name).to.eq('NullPointerException');
          }
        });
      });
      describe('because it is empty', () => {
        it('fails', () => {
          try {
            readEntityJSON('');
            fail();
          } catch (error) {
            expect(error.name).to.eq('NullPointerException');
          }
        });
      });
      describe('because the file does not exist', () => {
        it('fails', () => {
          try {
            readEntityJSON('test/test_files/WrongFile.json');
            fail();
          } catch (error) {
            expect(error.name).to.eq('FileNotFoundException');
          }
        });
      });
      describe('because the file is a folder', () => {
        it('fails', () => {
          try {
            readEntityJSON('test/test_files/');
            fail();
          } catch (error) {
            expect(error.name).to.eq('FileNotFoundException');
          }
        });
      });
    });
    describe('when passing a valid entity name', () => {
      const content = readEntityJSON('test/test_files/MyEntity.json');
      it('reads the file', () => {
        expect(content).to.deep.eq(
          {
            relationships: [],
            fields: [
              {
                fieldName: 'myField',
                fieldType: 'String'
              }
            ],
            changelogDate: '20160705183933',
            dto: 'no',
            service: 'no',
            entityTableName: 'my_entity',
            pagination: 'no'
          }
        );
      });
    });
  });
  describe('::toFilePath', () => {
    describe('when converting an entity name to a path', () => {
      describe('with a nil entity name', () => {
        it('fails', () => {
          try {
            toFilePath();
            fail();
          } catch (error) {
            expect(error.name).to.eq('NullPointerException');
          }
        });
      });
      describe('with an empty entity name', () => {
        it('fails', () => {
          try {
            toFilePath('');
            fail();
          } catch (error) {
            expect(error.name).to.eq('NullPointerException');
          }
        });
      });
      describe('with a valid entity name', () => {
        it('returns the path', () => {
          const name = 'MyEntity';
          expect(toFilePath(name)).to.eq(`.simlife/${name}.json`);
        });
      });
      describe('with a valid entity name with the first letter lowercase', () => {
        it('returns the path, with the first letter upper-cased', () => {
          const expectedFirstLetter = 'M';
          const name = 'myEntity';
          expect(
            toFilePath(name)
          ).to.eq(`.simlife/${expectedFirstLetter}${name.slice(1, name.length)}.json`);
        });
      });
    });
  });
  describe('::doesfileExist', () => {
    describe('when checking a file path', () => {
      describe('with a nil file path', () => {
        it('return false', () => {
          expect(doesfileExist()).to.be.false;
        });
      });
      describe('with an invalid file path', () => {
        it('return false', () => {
          expect(doesfileExist('someInvalidPath')).to.be.false;
        });
      });
      describe('with a valid file path', () => {
        it('return true', () => {
          expect(doesfileExist('./test/test_files/MyEntity.json')).to.be.true;
        });
      });
    });
  });
});
