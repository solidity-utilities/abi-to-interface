#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_variable_declaration_returns_user_defined({
  configurations,
  parsed_ast,
  solidity_data,
  user_defined_type_name,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  user_defined_type_name: Solidity.AST.nodeType.UserDefinedTypeName;
}): string {
  if ("UserDefinedTypeName" !== user_defined_type_name.nodeType) {
    const message = [
      `parse_ast_variable_declaration_returns_user_defined sent incorect node type -> ${user_defined_type_name.nodeType}`,
      'Acceptable type is "UserDefinedTypeName"',
      JSON.stringify(user_defined_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  return parse_ast_type_name_user_defined({
    configurations,
    parsed_ast,
    solidity_data,
    user_defined_type_name,
  });
}
