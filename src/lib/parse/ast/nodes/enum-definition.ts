#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast_enum_definition({
  configurations,
  parsed_ast,
  solidity_data,
  enum_definition,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  enum_definition: Solidity.AST.nodeType.EnumDefinition;
}): Parsed.AST.EnumDefinition {
  if ("EnumDefinition" !== enum_definition.nodeType) {
    const message = [
      `parse_ast_enum_definition sent incorect node type -> ${enum_definition.nodeType}`,
      'Acceptable type is "EnumDefinition"',
      JSON.stringify(enum_definition, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  if (enum_definition.canonicalName.includes(".")) {
    const contract_name = enum_definition.canonicalName.split(".")[0];
    if (
      parsed_ast.contracts.hasOwnProperty(contract_name) &&
      parsed_ast.contracts[contract_name].enums.hasOwnProperty(
        enum_definition.name
      )
    ) {
      return parsed_ast.contracts[contract_name].enums[enum_definition.name];
    }
  }

  return {
    canonicalName: enum_definition.canonicalName,
    members: enum_definition.members.map((member) => {
      return member.name;
    }),
    name: enum_definition.name,
    required: false,
  } as Parsed.AST.EnumDefinition;
}
