#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parsed_ast_requires_import({
  configurations,
  parsed_ast,
  type_name,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  type_name: string;
}) {
  for (const [key, data] of Object.entries(parsed_ast.imports)) {
    if (data.symbolAliases.hasOwnProperty(type_name)) {
      data.symbolAliases[type_name].required = true;
      break;
    }
  }
}
