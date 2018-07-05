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

const ApplicationTypes = require('../lib/core/simlife/application_types');
const BinaryOptions = require('../lib/core/simlife/binary_options');
const UnaryOptions = require('../lib/core/simlife/unary_options');
const RelationshipTypes = require('../lib/core/simlife/relationship_types');
const FieldTypes = require('../lib/core/simlife/field_types');
const Validations = require('../lib/core/simlife/validations');
const DatabaseTypes = require('../lib/core/simlife/database_types');

const JDLObject = require('../lib/core/jdl_object');
const JDLApplication = require('../lib/core/jdl_application');
const JDLEntity = require('../lib/core/jdl_entity');
const JDLField = require('../lib/core/jdl_field');
const JDLValidation = require('../lib/core/jdl_validation');
const JDLEnum = require('../lib/core/jdl_enum');
const JDLRelationship = require('../lib/core/jdl_relationship');
const JDLRelationships = require('../lib/core/jdl_relationships');
const JDLUnaryOption = require('../lib/core/jdl_unary_option');
const JDLBinaryOption = require('../lib/core/jdl_binary_option');
const JDLOptions = require('../lib/core/jdl_options');

const JDLImporter = require('../lib/jdl/jdl_importer');
const JDLReader = require('../lib/reader/jdl_reader');
const JsonReader = require('../lib/reader/json_reader');
const DocumentParser = require('../lib/parser/document_parser');
const EntityParser = require('../lib/parser/entity_parser');
const JsonParser = require('../lib/parser/json_parser');
const SimlifeApplicationExporter = require('../lib/export/simlife_application_exporter');
const SimlifeEntityExporter = require('../lib/export/simlife_entity_exporter');
const JDLExporter = require('../lib/export/jdl_exporter');
const JSONFileReader = require('../lib/reader/json_file_reader');
const ReservedKeywords = require('../lib/core/simlife/reserved_keywords');
const FileUtils = require('../lib/utils/file_utils');
const ObjectUtils = require('../lib/utils/object_utils');
const FormatUtils = require('../lib/utils/format_utils');
const StringUtils = require('../lib/utils/string_utils');

module.exports = {
  /* Simlife notions */
  SimlifeApplicationTypes: ApplicationTypes,
  SimlifeBinaryOptions: BinaryOptions,
  SimlifeUnaryOptions: UnaryOptions,
  SimlifeRelationshipTypes: RelationshipTypes,
  SimlifeValidations: Validations,
  SimlifeFieldTypes: FieldTypes,
  SimlifeDatabaseTypes: DatabaseTypes,
  isReservedKeyword: ReservedKeywords.isReserved,
  isReservedClassName: ReservedKeywords.isReservedClassName,
  isReservedTableName: ReservedKeywords.isReservedTableName,
  isReservedFieldName: ReservedKeywords.isReservedFieldName,
  /* JDL objects */
  JDLObject,
  JDLApplication,
  JDLEntity,
  JDLField,
  JDLValidation,
  JDLEnum,
  JDLRelationship,
  JDLRelationships,
  JDLUnaryOption,
  JDLBinaryOption,
  JDLOptions,
  /* JDL Importer */
  JDLImporter,
  /* JDL reading */
  parseFromFiles: JDLReader.parseFromFiles,
  /* JSON reading */
  parseJsonFromDir: JsonReader.parseFromDir,
  /* JDL conversion */
  convertToJDLFromConfigurationObject: DocumentParser.parseFromConfigurationObject,
  convertToSimlifeJSON: EntityParser.parse,
  /* JSON  conversion */
  convertJsonEntitiesToJDL: JsonParser.parseEntities,
  convertJsonServerOptionsToJDL: JsonParser.parseServerOptions,
  /* Entity exporting to JSON */
  exportEntities: SimlifeEntityExporter.exportEntities,
  exportEntitiesInApplications: SimlifeEntityExporter.exportEntitiesInApplications,
  /* Application exporting */
  exportApplications: SimlifeApplicationExporter.exportApplications,
  exportApplication: SimlifeApplicationExporter.exportApplication,
  /* JDL exporting */
  exportToJDL: JDLExporter.exportToJDL,
  /* JDL utils */
  isJDLFile: JDLReader.checkFileIsJDLFile,
  /* JSON utils */
  ObjectUtils,
  readEntityJSON: JSONFileReader.readEntityJSON,
  toFilePath: JSONFileReader.toFilePath,
  /* Utils */
  FileUtils,
  camelCase: StringUtils.camelCase,
  dateFormatForLiquibase: FormatUtils.dateFormatForLiquibase
};
