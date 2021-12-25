#!/usr/bin/env node

/**
 * @file CLI script for converting Solidity ABI JSON file to Solidity interface contract
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

require("source-map-support").install();

const fs = require("fs");
const path = require("path");

/**
 *
 */
(function () {
  const package_data = require(path.join(
    path.dirname(__dirname),
    "package.json"
  ));

  const configurations: CLI.configurations = package_data.cli;

  const cli_parameters: CLI.parsed = parseCLI({
    parameters: process.argv,
    configurations,
  });

  if (cli_parameters.verbose) {
    console.log({ cli_parameters });
  }

  if (cli_parameters.help) {
    console.log(formatHelp({ configurations, package_data }));
    return;
  } else if (cli_parameters.version) {
    console.log(formatVersion(package_data));
    return;
  }

  if (!cli_parameters.abi) {
    throw new Error("Missing '--abi' CLI argument");
  } else if (!fs.existsSync(cli_parameters["abi"])) {
    throw new Error(`ABI file does not exist -> ${cli_parameters.abi}`);
  }

  let writter_callback = ({
    path,
    content,
  }: {
    path?: string;
    content: string;
  }) => {
    console.log(content);
  };

  if (cli_parameters.out) {
    if (fs.existsSync(cli_parameters.out) && !cli_parameters.clobber) {
      throw new Error("Missing '--clobber' CLI argument");
    }
    writter_callback = ({
      path,
      content,
    }: {
      path?: string;
      content: string;
    }) => {
      fs.writeFileSync(path, content);
    };
  }

  if (cli_parameters.abi && !fs.existsSync(cli_parameters.abi)) {
    throw new Error(`ABI file does not exist -> ${cli_parameters.abi}`);
  }

  const solidity_data: Solidity.data = JSON.parse(
    fs.readFileSync(cli_parameters.abi)
  );

  const parsed_ast = parse_ast({
    configurations: cli_parameters,
    solidity_data,
  });

  const content = build_interface({
    configurations: cli_parameters,
    parsed_ast,
  });

  if (cli_parameters.verbose) {
    console.log(JSON.stringify(parsed_ast, null, 2));
  }

  writter_callback({ content, path: cli_parameters.out as string });
})();
