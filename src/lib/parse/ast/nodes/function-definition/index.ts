#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

/***/
function parse_ast_contract_function_definition({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
  node,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  node: Solidity.AST.nodeType.FunctionDefinition;
}): Parsed.AST.FunctionDefinition {
  if ("FunctionDefinition" !== node.nodeType) {
    const message = [
      `parse_ast_contract_function_definition sent incorect node type -> ${node.nodeType}`,
      'Acceptable type is "FunctionDefinition"',
      JSON.stringify(node, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const function_definition = {
    name: node.name,
    visibility: node.visibility,
    stateMutability: node.stateMutability,
  } as Parsed.AST.FunctionDefinition;

  function_definition.parameters = parse_ast_parameter_list({
    configurations,
    contract_definition,
    parsed_ast,
    solidity_data,
    parameters: node.parameters,
  });

  function_definition.returns = parse_ast_parameter_list({
    configurations,
    contract_definition,
    parsed_ast,
    solidity_data,
    parameters: node.returnParameters,
  });

  if (configurations.include_documentation) {
    const parameter_types = node.parameters.parameters.map((parameter) => {
      return parameter.typeDescriptions.typeString.split(" ")[0];
    });
    const keyName = `${function_definition.name}(${parameter_types.join(",")})`;

    const customs = Object.entries(
      solidity_data.devdoc.methods[keyName]
    ).reduce((accumulator, [key, value]) => {
      if (key.startsWith("custom:")) {
        accumulator[key] = value as string;
      }
      return accumulator;
    }, {} as { [key: string]: string });

    function_definition.documentation = {
      customs,
      details: solidity_data.devdoc.methods[keyName]?.details,
      keyName,
      notice: solidity_data.userdoc.methods[keyName]?.notice,
      params: solidity_data.devdoc.methods[keyName]?.params,
      returns: solidity_data.devdoc.methods[keyName]?.returns,
    };
  }

  return function_definition;
}
