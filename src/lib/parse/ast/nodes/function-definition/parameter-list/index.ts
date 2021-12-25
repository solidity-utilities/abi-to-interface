#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_parameter_list({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
  parameters,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  parameters: Solidity.AST.nodeType.ParameterList;
}): string[] {
  if ("ParameterList" !== parameters.nodeType) {
    const message = [
      `parse_ast_parameter_list sent incorect node type -> ${parameters.nodeType}`,
      'Acceptable type is "ContractDefinition"',
      JSON.stringify(parameters, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  return parameters.parameters.map((parameter) => {
    const parts: string[] = [];

    if ("ArrayTypeName" === parameter.typeName.nodeType) {
      const parameter_type = parse_ast_parameter_list_array_type({
        configurations,
        contract_definition,
        parsed_ast,
        solidity_data,
        array_type_name: parameter.typeName,
      });
      parts.push(parameter_type, "memory");
    } else if ("ElementaryTypeName" === parameter.typeName.nodeType) {
      const parameter_type = parse_ast_parameter_list_elementary({
        configurations,
        contract_definition,
        parsed_ast,
        solidity_data,
        elementary_type_name: parameter.typeName,
      });
      parts.push(parameter_type);
      if ("string" === parameter.typeName.typeDescriptions.typeString) {
        parts.push("memory");
      }
    } else if ("Mapping" === parameter.typeName.nodeType) {
      const parameter_type = parse_ast_parameter_list_mapping_type({
        configurations,
        contract_definition,
        parsed_ast,
        solidity_data,
        mapping: parameter.typeName,
      });
      parts.push(parameter_type, "storage");
    } else if ("UserDefinedTypeName" === parameter.typeName.nodeType) {
      const parameter_type = parse_ast_type_name_user_defined({
        configurations,
        parsed_ast,
        solidity_data,
        user_defined_type_name: parameter.typeName,
      });
      if (parameter.typeName.typeDescriptions.typeString.startsWith("struct ")) {
        parts.push(parameter_type, "memory");
      } else {
        parts.push(parameter_type);
      }
    }

    if (!parts.length) {
      console.log(JSON.stringify(parameter, null, 2));
      throw new Error(
        "parse_ast_parameter_list failed to parse above parameter"
      );
    }

    if (!!parameter.name && parameter.name !== parts[0]) {
      parts.push(parameter.name);
    }

    return parts.join(" ");
  });
}
