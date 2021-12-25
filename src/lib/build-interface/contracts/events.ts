#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_contracts_events({
  configurations,
  events,
}: {
  configurations: CLI.parsed;
  events: { [key: string]: Parsed.AST.EventDefinition };
}): string[] {
  return Object.entries(events).map(([key, data]) => {
    return `    event ${data.name}(${data.parameters.join(", ")};)`;
  });
}
