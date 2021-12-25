#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/**
 *
 */
function formatHelp({
  configurations,
  package_data,
}: {
  configurations: CLI.configurations;
  package_data: { [key: string]: unknown };
}): string {
  const message = [
    `${package_data.description}\n\n`,
    `Usage: solidity-abi-to-interface [OPTIONS]...\n\n`,
  ];
  const usage = Object.entries(configurations).forEach(([key, config]) => {
    message.push(config.parameters.join("    "));
    message.push(`    ${config.help}\n`);
  });
  return message.join("\n");
}
