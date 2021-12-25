#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

/***/
function parse_ast_struct_definition({
  configurations,
  parsed_ast,
  solidity_data,
  struct_definition,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  struct_definition: Solidity.AST.nodeType.StructDefinition;
}): Parsed.AST.StructDefinition {
  if ("StructDefinition" !== struct_definition.nodeType) {
    const message = [
      `parse_ast_struct_definition sent incorect node type -> ${struct_definition.nodeType}`,
      'Acceptable type is "StructDefinition"',
      JSON.stringify(struct_definition, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  if (struct_definition.canonicalName.includes(".")) {
    const contract_name = struct_definition.canonicalName.split(".")[0];
    if (
      parsed_ast.contracts.hasOwnProperty(contract_name) &&
      parsed_ast.contracts[contract_name].structs.hasOwnProperty(struct_definition.name)
    ) {
      return parsed_ast.contracts[contract_name].structs[struct_definition.name];
    }
  }

  const members = struct_definition.members.map((member) => {
    let type_name;
    if ("ArrayTypeName" === member.typeName.nodeType) {
      type_name = parse_ast_type_name_array({
        array_type_name: member.typeName,
        configurations,
        parsed_ast,
        parsed_variable_declaration: {} as Parsed.AST.VariableDeclaration,
        solidity_data,
      });
    } else if ("ElementaryTypeName" === member.typeName.nodeType) {
      type_name = member.typeName.typeDescriptions.typeString;
    } else if ("Mapping" === member.typeName.nodeType) {
      const key = parse_ast_type_name_mapping_key({
        configurations,
        mapping: member.typeName,
        parsed_ast,
        solidity_data,
      });
      const value = parse_ast_type_name_mapping_value({
        configurations,
        mapping: member.typeName,
        parsed_ast,
        solidity_data,
      });
      type_name = `mapping(${key} => ${value})`;
    } else if ("UserDefinedTypeName" === member.typeName.nodeType) {
      type_name = parse_ast_type_name_user_defined({
        configurations,
        parsed_ast,
        solidity_data,
        user_defined_type_name: member.typeName,
      });
    }

    return `${type_name} ${member.name}`;
  });

  return {
    canonicalName: struct_definition.canonicalName,
    name: struct_definition.name,
    members,
    required: false,
  } as Parsed.AST.StructDefinition;
}
