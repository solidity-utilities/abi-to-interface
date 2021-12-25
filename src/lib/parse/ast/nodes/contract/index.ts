#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast_contract({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
}): Parsed.AST.Contract {
  if ("ContractDefinition" !== contract_definition.nodeType) {
    const message = [
      `parse_ast_contract sent incorect node type -> ${contract_definition.nodeType}`,
      'Acceptable type is "ContractDefinition"',
      JSON.stringify(contract_definition, null, 2),
    ];
    throw new Error(message.join("\n"));
  }
  const contract_name: string = contract_definition.name;
  const parsed_ast_contract = parsed_ast.hasOwnProperty(contract_name)
    ? (parsed_ast[contract_name] as Parsed.AST.Contract)
    : {
        enums: {},
        events: {},
        functions: {},
        name: contract_name,
        structs: {},
        variables: {},
      };

  return contract_definition.nodes.reduce((accumulator, node) => {
    if (
      "EnumDefinition" === node.nodeType &&
      !accumulator.enums.hasOwnProperty(node.name)
    ) {
      accumulator.enums[node.canonicalName] = parse_ast_enum_definition({
        configurations,
        parsed_ast,
        solidity_data,
        enum_definition: node,
      });
    } else if (
      "EventDefinition" === node.nodeType &&
      !configurations.exclude_events &&
      !accumulator.events.hasOwnProperty(node.name)
    ) {
      accumulator.events[node.name] = parse_ast_contract_event_definition({
        configurations,
        contract_definition,
        parsed_ast,
        solidity_data,
        event_definition: node,
      });
    } else if (
      "FunctionDefinition" === node.nodeType &&
      !configurations.exclude_functions &&
      "constructor" !== node.kind &&
      "internal" !== node.visibility &&
      !accumulator.functions.hasOwnProperty(node.name)
    ) {
      accumulator.functions[node.name] = parse_ast_contract_function_definition(
        {
          configurations,
          contract_definition,
          parsed_ast,
          solidity_data,
          node,
        }
      );
    } else if (
      "StructDefinition" === node.nodeType &&
      !accumulator.structs.hasOwnProperty(node.name)
    ) {
      accumulator.structs[node.canonicalName] = parse_ast_struct_definition({
        configurations,
        parsed_ast,
        solidity_data,
        struct_definition: node,
      });
    } else if (
      "VariableDeclaration" === node.nodeType &&
      !configurations.exclude_variables &&
      !accumulator.variables.hasOwnProperty(node.name)
    ) {
      accumulator.variables[node.name] = parse_ast_variable_declaration({
        configurations,
        parsed_ast,
        solidity_data,
        node,
      });
    }
    return accumulator;
  }, parsed_ast_contract);
}
