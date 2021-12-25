#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast_contract_event_definition({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
  event_definition,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  event_definition: Solidity.AST.nodeType.EventDefinition;
}): Parsed.AST.EventDefinition {
  if ("EventDefinition" !== event_definition.nodeType) {
    const message = [
      `parse_ast_contract_event_definition sent incorect event_definition type -> ${event_definition.nodeType}`,
      'Acceptable type is "EventDefinition"',
      JSON.stringify(event_definition, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  return {
    name: event_definition.name,
    parameters: parse_ast_parameter_list({
      configurations,
      contract_definition,
      parsed_ast,
      solidity_data,
      parameters: event_definition.parameters,
    }),
  };
}
