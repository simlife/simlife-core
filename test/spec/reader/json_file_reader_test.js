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

const JSONFileReader = require('../../../lib/reader/json_file_reader');

describe('JSONFileReader', () => {
  describe('::readEntityJSON', () => {
    context('when passing an invalid argument', () => {
      context('because it is nil', () => {
        it('fails', () => {
          expect(() => {
            JSONFileReader.readEntityJSON();
          }).to.throw('The passed file path must not be nil.');
        });
      });
      context('because it is empty', () => {
        it('fails', () => {
          expect(() => {
            JSONFileReader.readEntityJSON('');
          }).to.throw('The passed file path must not be nil.');
        });
      });
      context('because the file does not exist', () => {
        it('fails', () => {
          expect(() => {
            JSONFileReader.readEntityJSON('test/test_files/WrongFile.json');
          }).to.throw('The passed file \'test/test_files/WrongFile.json\' must exist and must not be a directory.');
        });
      });
      context('because the file is a folder', () => {
        it('fails', () => {
          expect(() => {
            JSONFileReader.readEntityJSON('test/test_files/');
          }).to.throw('The passed file \'test/test_files/\' must exist and must not be a directory.');
        });
      });
    });
    context('when passing a valid entity name', () => {
      const content = JSONFileReader.readEntityJSON('test/test_files/MyEntity.json');
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
    context('when converting an entity name to a path', () => {
      context('with a nil entity name', () => {
        it('fails', () => {
          expect(() => {
            JSONFileReader.toFilePath();
          }).to.throw('The passed entity name must not be nil.');
        });
      });
      context('with an empty entity name', () => {
        it('fails', () => {
          expect(() => {
            JSONFileReader.toFilePath('');
          }).to.throw('The passed entity name must not be nil.');
        });
      });
      context('with a valid entity name', () => {
        it('returns the path', () => {
          const name = 'MyEntity';
          expect(JSONFileReader.toFilePath(name)).to.eq(`.simlife/${name}.json`);
        });
      });
      context('with a valid entity name with the first letter lowercase', () => {
        it('returns the path, with the first letter upper-cased', () => {
          const expectedFirstLetter = 'M';
          const name = 'myEntity';
          expect(
            JSONFileReader.toFilePath(name)
          ).to.eq(`.simlife/${expectedFirstLetter}${name.slice(1, name.length)}.json`);
        });
      });
    });
  });
});
