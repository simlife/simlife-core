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

const fs = require('fs');
const path = require('path');

module.exports = {
  doesFileExist,
  doesDirectoryExist,
  createDirectory
};

/**
 * Checks the file exists.
 * @param file the file to check.
 * @returns {boolean} whether the file exists and is actually a file.
 */
function doesFileExist(file) {
  const statObject = getStatObject(file);
  return statObject && statObject.isFile();
}

/**
 * Checks the directory exists.
 * @param directory the directory to check.
 * @returns {boolean} whether the directory exists and is actually a directory.
 */
function doesDirectoryExist(directory) {
  const statObject = getStatObject(directory);
  return statObject && statObject.isDirectory();
}

/**
 * Creates a directory, if it doesn't exist already.
 * @param directory the directory to create.
 * @throws WrongDirException if the directory to create exists and is a file.
 */
function createDirectory(directory) {
  if (!directory) {
    throw new Error('A directory must be passed.');
  }
  const statObject = getStatObject(directory);
  if (statObject && statObject.isFile()) {
    throw new Error(`The directory to create '${directory}' is a file.`);
  }
  const folderStructure = directory.split('/');
  folderStructure.reduce((previous, folder) => {
    const currentStructure = path.join(previous, folder);
    const statObject = getStatObject(currentStructure);
    if (!statObject) {
      fs.mkdirSync(currentStructure);
    }
    return currentStructure;
  }, '.');
}

function getStatObject(file) {
  try {
    return fs.statSync(file);
  } catch (error) {
    return false;
  }
}