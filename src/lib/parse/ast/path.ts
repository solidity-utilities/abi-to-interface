#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

// const path = require("path");

/***/
function parse_ast_path({
  solidity_data: {
    sourcePath,
    ast: { absolutePath },
  },
}: {
  solidity_data: Solidity.data;
}): string {
  const project_name = sourcePath
    .replace(absolutePath.replace("project:", ""), "")
    .split(path.sep)
    .slice(-1)[0];
  return absolutePath.replace("project:", project_name);
}
