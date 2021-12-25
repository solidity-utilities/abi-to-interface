#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_parameter_list_user_defined_type({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
  user_defined_type_name,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  user_defined_type_name: Solidity.AST.nodeType.UserDefinedTypeName;
}): string {
  if ("UserDefinedTypeName" !== user_defined_type_name.nodeType) {
    const message = [
      `parse_ast_parameter_list_user_defined_type sent incorect node type -> ${user_defined_type_name.nodeType}`,
      'Acceptable type is "Mapping"',
      JSON.stringify(user_defined_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  let type_name;
  const type_string = user_defined_type_name.typeDescriptions.typeString;
  if (type_string.startsWith("contract ")) {
    type_name = type_string.split(" ").at(-1) as string;
  } else if (type_string.startsWith("enum ")) {
    type_name = type_string.split(" ").at(-1) as string;
    parsed_ast_requires_enum({
      configurations,
      parsed_ast,
      type_name,
    });
  } else if (type_string.startsWith("struct ")) {
    type_name = type_string.split(" ").at(-1) as string;
  }

  if (!type_name) {
    const message = [
      `parse_ast_parameter_list_user_defined_type failed to parse type string -> ${type_string}`,
      JSON.stringify(user_defined_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  parsed_ast_requires_import({
    configurations,
    parsed_ast,
    type_name,
  });

  return type_name;
}
