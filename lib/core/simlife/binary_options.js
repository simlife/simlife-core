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

const values = require('../../utils/object_utils').values;

const Options = {
  DTO: 'dto',
  SERVICE: 'service',
  PAGINATION: 'pagination',
  MICROSERVICE: 'microservice',
  SEARCH_ENGINE: 'searchEngine',
  ANGULAR_SUFFIX: 'angularSuffix',
  CLIENT_ROOT_FOLDER: 'clientRootFolder'
};
const Values = {
  dto: { MAPSTRUCT: 'mapstruct' },
  service: { SERVICE_CLASS: 'serviceClass', SERVICE_IMPL: 'serviceImpl' },
  pagination: {
    PAGER: 'pager',
    PAGINATION: 'pagination',
    'INFINITE-SCROLL': 'infinite-scroll'
  },
  searchEngine: { ELASTIC_SEARCH: 'elasticsearch' }
};

function exists(passedOption, passedValue) {
  const options = Object.keys(Options).map(key => Options[key]);
  return options.some(option => passedOption === option
      && (passedOption === Options.MICROSERVICE
      || passedOption === Options.ANGULAR_SUFFIX
      || passedOption === Options.CLIENT_ROOT_FOLDER
      || values(Values[option]).includes(passedValue)));
}

module.exports = {
  Options,
  Values,
  exists
};
