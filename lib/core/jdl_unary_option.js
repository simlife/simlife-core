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

const AbstractJDLOption = require('./abstract_jdl_option');
const UnaryOptions = require('./simlife/unary_options');

/**
 * For flags such as skipServer, skipClient, etc.
 */
class JDLUnaryOption extends AbstractJDLOption {
  constructor(args) {
    super(args);
    if (!UnaryOptions.exists(this.name)) {
      throw new Error(`The option's name must be valid, got '${this.name}'.`);
    }
  }

  getType() {
    return 'UNARY';
  }

  toString() {
    const entityNames = this.entityNames.join(', ');
    entityNames.slice(1, entityNames.length - 1);
    const firstPart = `${this.name} ${entityNames}`;
    if (this.excludedNames.size() === 0) {
      return firstPart;
    }
    const excludedNames = this.excludedNames.join(', ');
    excludedNames.slice(1, this.excludedNames.length - 1);
    return `${firstPart} except ${excludedNames}`;
  }

  static isValid(option) {
    return AbstractJDLOption.isValid(option);
  }
}

module.exports = JDLUnaryOption;
