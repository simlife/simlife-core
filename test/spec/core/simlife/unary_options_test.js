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
const UNARY_OPTIONS = require('../../../../lib/core/simlife/unary_options').UNARY_OPTIONS;
const exists = require('../../../../lib/core/simlife/unary_options').exists;

describe('UNARY_OPTIONS', () => {
  describe('::exists', () => {
    describe('when checking for a valid unary option', () => {
      it('returns true', () => {
        expect(exists(UNARY_OPTIONS.SKIP_CLIENT)).to.be.true;
      });
    });
    describe('when checking for an invalid unary option', () => {
      it('returns false', () => {
        expect(exists('NOTHING')).to.be.false;
      });
    });
  });
});
