#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parsed_ast_requires_contract({
  configurations,
  parsed_ast,
  type_name,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  type_name: string;
}) {
  if (parsed_ast.contracts.hasOwnProperty(type_name)) {
    parsed_ast.contracts[type_name].required = true;
    return;
  }
}
