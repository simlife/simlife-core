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

const JDLReader = require('../../../lib/reader/jdl_reader');
const DocumentParser = require('../../../lib/parser/document_parser');
const JDLEntity = require('../../../lib/core/jdl_entity');
const JDLEnum = require('../../../lib/core/jdl_enum');
const JDLField = require('../../../lib/core/jdl_field');
const JDLValidation = require('../../../lib/core/jdl_validation');
const JDLUnaryOption = require('../../../lib/core/jdl_unary_option');
const JDLBinaryOption = require('../../../lib/core/jdl_binary_option');
const ApplicationTypes = require('../../../lib/core/simlife/application_types');
const FieldTypes = require('../../../lib/core/simlife/field_types').CommonDBTypes;
const Validations = require('../../../lib/core/simlife/validations');
const UnaryOptions = require('../../../lib/core/simlife/unary_options');
const BinaryOptions = require('../../../lib/core/simlife/binary_options').Options;
const BinaryOptionValues = require('../../../lib/core/simlife/binary_options').Values;

describe('DocumentParser', () => {
  describe('::parse', () => {
    context('when passing invalid args', () => {
      context('because there is no document', () => {
        it('fails', () => {
          expect(() => {
            DocumentParser.parseFromConfigurationObject({});
          }).to.throw('The parsed JDL content must be passed.');
        });
      });
    });
    context('when passing valid args', () => {
      context('with no error', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/complex_jdl.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('builds a JDLObject', () => {
          expect(content).not.to.be.null;
          expect(content.entities.Department).to.deep.eq(new JDLEntity({
            name: 'Department',
            tableName: 'Department',
            fields: {
              name: new JDLField({
                name: 'name',
                type: FieldTypes.STRING,
                validations: { required: new JDLValidation({ name: Validations.REQUIRED }) }
              }),
              description: new JDLField({
                name: 'description',
                type: FieldTypes.TEXT_BLOB
              }),
              advertisement: new JDLField({
                name: 'advertisement',
                type: FieldTypes.BLOB
              }),
              logo: new JDLField({
                name: 'logo',
                type: FieldTypes.IMAGE_BLOB
              })
            }
          }));
          expect(content.entities.JobHistory).to.deep.eq(new JDLEntity({
            name: 'JobHistory',
            tableName: 'JobHistory',
            fields: {
              startDate: new JDLField({
                name: 'startDate',
                type: FieldTypes.ZONED_DATE_TIME
              }),
              endDate: new JDLField({
                name: 'endDate',
                type: FieldTypes.ZONED_DATE_TIME
              }),
              language: new JDLField({ name: 'language', type: 'Language' })
            },
            comment: 'JobHistory comment.'
          }));
          expect(content.enums.JobType).to.deep.eq(new JDLEnum({
            name: 'JobType',
            values: ['TYPE1', 'TYPE2']
          }));
          expect(content.entities.Job).to.deep.eq(new JDLEntity({
            name: 'Job',
            tableName: 'Job',
            fields: {
              jobTitle: new JDLField({
                name: 'jobTitle',
                type: FieldTypes.STRING,
                validations: {
                  minlength: new JDLValidation({
                    name: Validations.MINLENGTH,
                    value: 5
                  }),
                  maxlength: new JDLValidation({
                    name: Validations.MAXLENGTH,
                    value: 25
                  })
                }
              }),
              jobType: new JDLField({ name: 'jobType', type: 'JobType' }),
              minSalary: new JDLField({
                name: 'minSalary',
                type: FieldTypes.LONG
              }),
              maxSalary: new JDLField({
                name: 'maxSalary',
                type: FieldTypes.LONG
              })
            }
          }));
          expect(content.getOptions()).to.deep.eq([
            new JDLUnaryOption({
              name: UnaryOptions.SKIP_SERVER,
              entityNames: ['Country']
            }),
            new JDLBinaryOption({
              name: BinaryOptions.DTO,
              entityNames: ['Employee'],
              value: BinaryOptionValues.dto.MAPSTRUCT
            }),
            new JDLBinaryOption({
              name: BinaryOptions.SERVICE,
              entityNames: ['Employee'],
              value: BinaryOptionValues.service.SERVICE_CLASS
            }),
            new JDLBinaryOption({
              name: BinaryOptions.PAGINATION,
              entityNames: ['JobHistory', 'Employee'],
              value: BinaryOptionValues.pagination['INFINITE-SCROLL']
            }),
            new JDLBinaryOption({
              name: BinaryOptions.PAGINATION,
              entityNames: ['Job'],
              value: BinaryOptionValues.pagination.PAGINATION
            }),
            new JDLBinaryOption({
              name: BinaryOptions.MICROSERVICE,
              entityNames: ['*'],
              value: 'mymicroservice'
            }),
            new JDLBinaryOption({
              name: BinaryOptions.SEARCH_ENGINE,
              entityNames: ['Employee'],
              value: BinaryOptionValues.searchEngine.ELASTIC_SEARCH
            })
          ]);
        });
      });
      context('with an application type', () => {
        let input = null;

        before(() => {
          input = JDLReader.parseFromFiles(['./test/test_files/invalid_field_type.jdl']);
        });

        it('doesn\'t check for field types', () => {
          DocumentParser.parseFromConfigurationObject({
            document: input,
            applicationType: ApplicationTypes.GATEWAY
          });
        });
      });
      context('with a required relationship', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/required_relationships.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('adds it', () => {
          expect(content.relationships.relationships.OneToOne['OneToOne_A{b}_B{a}'].isInjectedFieldInFromRequired).to.be.true;
          expect(content.relationships.relationships.OneToOne['OneToOne_A{b}_B{a}'].isInjectedFieldInToRequired).to.be.false;
        });
      });
      context('with a field name \'id\'', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/id_field.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('doesn\'t add it', () => {
          expect(content.entities.A).to.deep.eq(new JDLEntity({
            name: 'A',
            tableName: 'A',
            fields: {
              email: new JDLField({ name: 'email', type: FieldTypes.STRING })
            }
          }));
        });
      });
      context('with User entity as destination for a relationship', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/user_entity_to_relationship.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('is processed', () => {
          expect(content.relationships.relationships.ManyToOne['ManyToOne_A{user}_User{a}'].to.name).to.eq('User');
          expect(content.relationships.relationships.OneToOne['OneToOne_B{user}_User'].to.name).to.eq('User');
        });
      });
      context('with an invalid option', () => {
        let input = null;

        before(() => {
          input = JDLReader.parseFromFiles(['./test/test_files/invalid_option.jdl']);
        });

        it('fails', () => {
          expect(() => {
            DocumentParser.parseFromConfigurationObject({
              document: input
            });
          }).to.throw('The option\'s name and value must be valid, got value \'wrong\' for \'dto\'.');
        });
      });
      context('with a required enum', () => {
        let content = null;
        let enumField = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/enum.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
          enumField = new JDLField({
            name: 'sourceType',
            type: 'MyEnum'
          });
          enumField.addValidation(new JDLValidation({
            name: Validations.REQUIRED
          }));
        });

        it('adds it', () => {
          expect(content.enums.MyEnum).to.deep.eq(new JDLEnum({
            name: 'MyEnum',
            values: ['AAA', 'BBB', 'CCC']
          }));
          expect(content.entities.MyEntity.fields.sourceType).to.deep.eq(enumField);
        });
      });
      context('when using the noFluentMethods option', () => {
        let input = null;
        let content = null;

        before(() => {
          input = JDLReader.parseFromFiles(['./test/test_files/fluent_methods.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('adds it correctly', () => {
          expect(content.getOptions()).to.deep.eq([
            new JDLUnaryOption({
              name: UnaryOptions.NO_FLUENT_METHOD,
              entityNames: ['A']
            })
          ]);
        });
      });
      context('when having following comments', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/following_comments.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('accepts them', () => {
          expect(content.entities.A.fields.name.comment).to.eq('abc');
          expect(content.entities.A.fields.thing.comment).to.eq('def');
          expect(content.entities.A.fields.another.comment).to.eq('ghi');
        });
        context('when having both forms of comments', () => {
          it('only accepts the one defined first', () => {
            expect(content.entities.B.fields.name.comment).to.eq('xyz');
          });
        });
        context('when using commas', () => {
          it('assigns the comment to the next field', () => {
            expect(content.entities.C.fields.name.comment).to.be.undefined;
            expect(content.entities.C.fields.thing.comment).to.eq('abc');
          });
        });
      });
      context('when parsing another complex JDL file', () => {
        let content = null;
        let options = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/complex_jdl_2.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
          options = content.getOptions();
        });

        context('checking the entities', () => {
          it('parses them', () => {
            expect(content.entities.A).to.deep.eq({
              name: 'A',
              tableName: 'A',
              fields: {},
              comment: undefined
            });
            expect(content.entities.B).to.deep.eq({
              name: 'B',
              tableName: 'B',
              fields: {},
              comment: undefined
            });
            expect(content.entities.C).to.deep.eq({
              name: 'C',
              tableName: 'C',
              fields: {
                name: {
                  comment: undefined,
                  name: 'name',
                  type: 'String',
                  validations: {
                    required: {
                      name: 'required',
                      value: ''
                    }
                  }
                }
              },
              comment: undefined
            });
            expect(content.entities.D).to.deep.eq({
              name: 'D',
              tableName: 'D',
              fields: {
                name: {
                  comment: undefined,
                  name: 'name',
                  type: 'String',
                  validations: {
                    required: {
                      name: 'required',
                      value: ''
                    },
                    minlength: {
                      name: 'minlength',
                      value: 1
                    },
                    maxlength: {
                      name: 'maxlength',
                      value: 42
                    }
                  }
                },
                count: {
                  comment: undefined,
                  name: 'count',
                  type: 'Integer',
                  validations: {}
                }
              },
              comment: undefined
            });
            expect(content.entities.E).to.deep.eq({
              name: 'E',
              tableName: 'E',
              fields: {},
              comment: undefined
            });
            expect(content.entities.F).to.deep.eq({
              name: 'F',
              tableName: 'F',
              fields: {
                name: {
                  comment: 'My comment for name of F.',
                  name: 'name',
                  type: 'String',
                  validations: {}
                },
                count: {
                  comment: undefined,
                  name: 'count',
                  type: 'Integer',
                  validations: {}
                },
                flag: {
                  comment: 'My comment for flag of F.',
                  name: 'flag',
                  type: 'Boolean',
                  validations: {
                    required: {
                      name: 'required',
                      value: ''
                    }
                  }
                }
              },
              comment: 'My comment for F.'
            });
            expect(content.entities.G).to.deep.eq({
              name: 'G',
              tableName: 'G',
              fields: {
                name: {
                  comment: 'xyz',
                  name: 'name',
                  type: 'String',
                  validations: {
                    required: {
                      name: 'required',
                      value: ''
                    }
                  }
                },
                count: {
                  comment: 'def',
                  name: 'count',
                  type: 'Integer',
                  validations: {}
                }
              },
              comment: undefined
            });
          });
        });
        context('checking the options', () => {
          it('parses them', () => {
            expect(options.length).to.eq(7);
            expect(options[0].name).to.eq('skipClient');
            expect(options[0].entityNames.toString()).to.eq('[G]');
            expect(options[0].excludedNames.toString()).to.eq('[]');
            expect(options[1].name).to.eq('skipServer');
            expect(options[1].entityNames.toString()).to.eq('[B,D]');
            expect(options[1].excludedNames.toString()).to.eq('[D]');
            expect(options[2].name).to.eq('dto');
            expect(options[2].value).to.eq('mapstruct');
            expect(options[2].entityNames.toString()).to.eq('[*]');
            expect(options[2].excludedNames.toString()).to.eq('[G]');
            expect(options[3].name).to.eq('service');
            expect(options[3].entityNames.toString()).to.eq('[G]');
            expect(options[3].excludedNames.toString()).to.eq('[]');
            expect(options[3].value).to.eq('serviceImpl');
            expect(options[4].name).to.eq('service');
            expect(options[4].entityNames.toString()).to.eq('[A,C,D]');
            expect(options[4].excludedNames.toString()).to.eq('[]');
            expect(options[4].value).to.eq('serviceClass');
            expect(options[5].name).to.eq('pagination');
            expect(options[5].entityNames.toString()).to.eq('[*]');
            expect(options[5].excludedNames.toString()).to.eq('[G]');
            expect(options[5].value).to.eq('pager');
            expect(options[6].name).to.eq('pagination');
            expect(options[6].entityNames.toString()).to.eq('[G]');
            expect(options[6].excludedNames.toString()).to.eq('[]');
            expect(options[6].value).to.eq('pagination');
          });
        });
      });
      context('when having two consecutive comments for fields', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/field_comments.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('assigns them correctly', () => {
          expect(content.entities.TestEntity.fields).to.deep.eq({
            first: {
              name: 'first',
              comment: 'first comment',
              type: 'String',
              validations: {}
            },
            second: {
              name: 'second',
              comment: 'second comment',
              type: 'String',
              validations: {}
            },
            third: {
              name: 'third',
              comment: undefined,
              type: 'Integer',
              validations: {}
            },
            fourth: {
              name: 'fourth',
              comment: 'another',
              type: 'String',
              validations: {}
            }
          });
          expect(content.entities.TestEntity2.fields).to.deep.eq({
            first: {
              name: 'first',
              comment: 'first comment',
              type: 'String',
              validations: {
                required: {
                  name: 'required',
                  value: ''
                }
              }
            },
            second: {
              name: 'second',
              comment: 'second comment',
              type: 'String',
              validations: {}
            }
          });
        });
      });
      context('when having constants', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/constants.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('assigns the constants\' value when needed', () => {
          expect(content.entities.A.fields).to.deep.eq({
            name: {
              name: 'name',
              comment: undefined,
              type: 'String',
              validations: {
                minlength: {
                  name: 'minlength',
                  value: 1
                },
                maxlength: {
                  name: 'maxlength',
                  value: 42
                }
              }
            },
            content: {
              name: 'content',
              comment: undefined,
              type: 'TextBlob',
              validations: {
                minbytes: {
                  name: 'minbytes',
                  value: 20
                },
                maxbytes: {
                  name: 'maxbytes',
                  value: 40
                }
              }
            },
            count: {
              name: 'count',
              comment: undefined,
              type: 'Integer',
              validations: {
                min: {
                  name: 'min',
                  value: 0
                },
                max: {
                  name: 'max',
                  value: 41
                }
              }
            }
          });
        });
      });
      context('when having a cassandra app with paginated entities', () => {
        let input = null;

        before(() => {
          input = JDLReader.parseFromFiles(['./test/test_files/cassandra_jdl.jdl']);
        });

        it('fails', () => {
          try {
            DocumentParser.parseFromConfigurationObject({
              document: input
            });
          } catch (error) {
            expect(error.name).to.eq('IllegalOptionException');
          }
        });
      });
      context('when parsing applications', () => {
        let application = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/application.jdl']);
          const content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
          application = content.applications.toto.config;
        });

        it('parses it', () => {
          expect(application.languages.has('en') && application.languages.has('fr')).to.be.true;
          expect(application.jwtSecretKey).not.to.be.undefined;
          expect(application.testFrameworks.size()).to.equal(0);
          delete application.languages;
          delete application.jwtSecretKey;
          delete application.testFrameworks;

          expect(application).to.deep.equal({
            applicationType: 'monolith',
            authenticationType: 'jwt',
            baseName: 'toto',
            buildTool: 'maven',
            cacheProvider: 'ehcache',
            clientFramework: 'angularX',
            clientPackageManager: 'yarn',
            databaseType: 'sql',
            devDatabaseType: 'h2Disk',
            enableHibernateCache: true,
            enableSwaggerCodegen: false,
            enableTranslation: false,
            simPrefix: 'sim',
            messageBroker: false,
            nativeLanguage: 'en',
            packageFolder: 'com/mathieu/sample',
            packageName: 'com.mathieu.sample',
            prodDatabaseType: 'mysql',
            searchEngine: false,
            serverPort: '8080',
            serviceDiscoveryType: false,
            skipClient: false,
            skipServer: false,
            skipUserManagement: false,
            useSass: false,
            websocket: false
          });
        });
      });
      context('when parsing filtered entities', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/filtering_without_service.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input,
          });
        });

        it('works', () => {
          expect(content.options.options.filter.entityNames.has('*')).to.be.true;
          expect(content.options.options.filter.excludedNames.has('B')).to.be.true;
        });
      });
      context('when parsing entities with a custom client root folder', () => {
        context('inside a microservice app', () => {
          let content = null;

          before(() => {
            const input = JDLReader.parseFromFiles(['./test/test_files/client_root_folder.jdl']);
            content = DocumentParser.parseFromConfigurationObject({
              document: input,
              applicationType: ApplicationTypes.MICROSERVICE
            });
          });

          it('is ignored', () => {
            expect(content.options.options['clientRootFolder_test-root']).to.be.undefined;
          });
        });
        context('inside any other app', () => {
          let content = null;

          before(() => {
            const input = JDLReader.parseFromFiles(['./test/test_files/client_root_folder.jdl']);
            content = DocumentParser.parseFromConfigurationObject({
              document: input,
              applicationType: ApplicationTypes.MONOLITH
            });
          });

          it('works', () => {
            expect(content.options.options['clientRootFolder_test-root'].entityNames.has('*')).to.be.true;
            expect(content.options.options['clientRootFolder_test-root'].excludedNames.has('C')).to.be.true;
            expect(content.options.options['clientRootFolder_test-root'].value).to.equal('test-root');
          });
        });
      });
      context('when parsing a JDL inside a microservice app', () => {
        context('without the microservice option in the JDL', () => {
          let content = null;

          before(() => {
            const input = JDLReader.parseFromFiles(['./test/test_files/no_microservice.jdl']);
            content = DocumentParser.parseFromConfigurationObject({
              document: input,
              applicationType: ApplicationTypes.MICROSERVICE,
              applicationName: 'toto'
            });
          });

          it('adds it to every entity', () => {
            expect(Object.keys(content.options.options).length).to.equal(1);
            expect(content.options.options.microservice_toto.entityNames.toString()).to.equal('[A,B,C,D,E,F,G]');
          });
        });
        context('with the microservice option in the JDL', () => {
          let content = null;

          before(() => {
            const input = JDLReader.parseFromFiles(['./test/test_files/simple_microservice_setup.jdl']);
            content = DocumentParser.parseFromConfigurationObject({
              document: input,
              applicationType: ApplicationTypes.MICROSERVICE,
              applicationName: 'toto'
            });
          });

          it('does not automatically setup the microservice option', () => {
            expect(Object.keys(content.options.options).length).to.equal(1);
            expect(content.options.options.microservice_ms.entityNames.toString()).to.equal('[A]');
          });
        });
      });
      context('when parsing a JDL microservice application with entities', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/application_with_entities.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input
          });
        });

        it('adds the application entities in the application object', () => {
          expect(content.applications.MyApp.entities.has('BankAccount')).to.be.true;
          expect(content.applications.MyApp.entities.size()).to.equal(1);
        });
      });
      context('when parsing a relationship with no injected field', () => {
        let content = null;

        before(() => {
          const input = JDLReader.parseFromFiles(['./test/test_files/no_injected_field.jdl']);
          content = DocumentParser.parseFromConfigurationObject({
            document: input,
            applicationType: ApplicationTypes.MONOLITH
          });
        });

        it('adds a default one', () => {
          expect(content.relationships.relationships.OneToOne['OneToOne_A{a}_B'].injectedFieldInFrom).to.equal('a');
        });
      });
    });
  });
});
