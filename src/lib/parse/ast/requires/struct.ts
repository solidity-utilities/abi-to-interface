#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parsed_ast_requires_struct({
  configurations,
  parsed_ast,
  type_name,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  type_name: string;
}) {
  if (parsed_ast.structs.hasOwnProperty(type_name)) {
    parsed_ast.structs[type_name].required = true;
    return;
  }

  for (const [key, contract] of Object.entries(parsed_ast.contracts)) {
    if (contract.structs.hasOwnProperty(type_name)) {
      contract.structs[type_name].required = true;
      return;
    }
  }
}


