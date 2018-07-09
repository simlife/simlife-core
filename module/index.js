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

const BINARY_OPTIONS = require('../lib/core/simlife/binary_options');
const UNARY_OPTIONS = require('../lib/core/simlife/unary_options');
const RELATIONSHIP_TYPES = require('../lib/core/simlife/relationship_types');
const FIELD_TYPES = require('../lib/core/simlife/field_types');
const VALIDATIONS = require('../lib/core/simlife/validations');
const DATABASE_TYPES = require('../lib/core/simlife/database_types');
const JDLReader = require('../lib/reader/jdl_reader');
const JsonReader = require('../lib/reader/json_reader');
const JDLParser = require('../lib/parser/jdl_parser');
const convertToSimlifeJSON = require('../lib/parser/entity_parser').parse;
const JsonParser = require('../lib/parser/json_parser');
const JDLObject = require('../lib/core/jdl_object');
const JDLEntity = require('../lib/core/jdl_entity');
const JDLField = require('../lib/core/jdl_field');
const JDLValidation = require('../lib/core/jdl_validation');
const JDLEnum = require('../lib/core/jdl_enum');
const JDLRelationship = require('../lib/core/jdl_relationship');
const JDLRelationships = require('../lib/core/jdl_relationships');
const JDLUnaryOption = require('../lib/core/jdl_unary_option');
const JDLBinaryOption = require('../lib/core/jdl_binary_option');
const JDLOptions = require('../lib/core/jdl_options');
const JSONExporter = require('../lib/export/json_exporter');
const exportToJDL = require('../lib/export/jdl_exporter').exportToJDL;
const JSONFileReader = require('../lib/reader/json_file_reader');
const ReservedKeywords = require('../lib/core/simlife/reserved_keywords');
const ObjectUtils = require('../lib/utils/object_utils');
const FormatUtils = require('../lib/utils/format_utils');
const StringUtils = require('../lib/utils/string_utils');
const Set = require('../lib/utils/objects/set');

module.exports = {
  /* Simlife notions */
  SimlifeBinaryOptions: BINARY_OPTIONS,
  SimlifeUnaryOptions: UNARY_OPTIONS,
  SimlifeRelationshipTypes: RELATIONSHIP_TYPES,
  SimlifeValidations: VALIDATIONS,
  SimlifeFieldTypes: FIELD_TYPES,
  SimlifeDatabaseTypes: DATABASE_TYPES,
  isReservedKeyword: ReservedKeywords.isReserved,
  isReservedClassName: ReservedKeywords.isReservedClassName,
  isReservedTableName: ReservedKeywords.isReservedTableName,
  isReservedFieldName: ReservedKeywords.isReservedFieldName,
  /* JDL objects */
  JDLObject,
  JDLEntity,
  JDLField,
  JDLValidation,
  JDLEnum,
  JDLRelationship,
  JDLRelationships,
  JDLUnaryOption,
  JDLBinaryOption,
  JDLOptions,
  /* JDL reading */
  parse: JDLReader.parse,
  parseFromFiles: JDLReader.parseFromFiles,
  /* Json reading */
  parseJsonFromDir: JsonReader.parseFromDir,
  /* JDL conversion */
  convertToJDL: JDLParser.parse,
  convertToJDLFromConfigurationObject: JDLParser.parseFromConfigurationObject,
  convertToSimlifeJSON,
  /* Json conversion */
  convertJsonEntitiesToJDL: JsonParser.parseEntities,
  convertJsonServerOptionsToJDL: JsonParser.parseServerOptions,
  /* JSON exporting */
  exportToJSON: JSONExporter.exportToJSON,
  /* JDL exporting */
  exportToJDL,
  /* JDL utils */
  isJDLFile: JDLReader.checkFileIsJDLFile,
  /* JSON utils */
  ObjectUtils,
  createSimlifeJSONFolder: JSONExporter.createSimlifeJSONFolder,
  filterOutUnchangedEntities: JSONExporter.filterOutUnchangedEntities,
  readEntityJSON: JSONFileReader.readEntityJSON,
  toFilePath: JSONFileReader.toFilePath,
  /* Objects */
  Set,
  /* Utils */
  camelCase: StringUtils.camelCase,
  dateFormatForLiquibase: FormatUtils.dateFormatForLiquibase
};
