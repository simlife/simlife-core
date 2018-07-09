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
const parseFromDir = require('../../../lib/reader/json_reader').parseFromDir;
const UnaryOptions = require('../../../lib/core/simlife/unary_options').UNARY_OPTIONS;

describe('::parseFromDir', () => {
  describe('when passing invalid parameters', () => {
    describe('such as nil', () => {
      it('throws an error', () => {
        try {
          parseFromDir(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('IllegalArgumentException');
        }
      });
    });
    describe('such as a file', () => {
      it('throws an error', () => {
        try {
          parseFromDir('../../test_files/invalid_file.txt');
          fail();
        } catch (error) {
          expect(error.name).to.eq('WrongDirException');
        }
      });
    });
    describe('such as a dir that does not exist', () => {
      it('throws an error', () => {
        try {
          parseFromDir('nodir');
          fail();
        } catch (error) {
          expect(error.name).to.eq('WrongDirException');
        }
      });
    });
  });
  describe('when passing valid arguments', () => {
    describe('when reading a simlife app dir', () => {
      const content = parseFromDir('./test/test_files/simlife_app');
      it('reads it', () => {
        expect(content.entities.Country).not.to.be.undefined;
        expect(content.entities.Department).not.to.be.undefined;
        expect(content.entities.Employee).not.to.be.undefined;
        expect(content.entities.Job).not.to.be.undefined;
        expect(content.entities.JobHistory).not.to.be.undefined;
        expect(content.entities.Region).not.to.be.undefined;
        expect(content.entities.Task).not.to.be.undefined;
        expect(content.entities.NoEntity).to.be.undefined;
        expect(content.entities.BadEntity).to.be.undefined;
        expect(content.getOptions().filter(o => o.name === UnaryOptions.SKIP_CLIENT).length).eq(1);
        expect(content.getOptions().filter(o => o.name === UnaryOptions.SKIP_SERVER).length).eq(1);
      });
    });
  });
});
