#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/**
 * Build object by parsing `process.argv` with `configurations`
 * @param {Object} first - Object with list of CLI arguments and parsing configurations
 * @param {string[]} first.parameters - Array of CLI arguments
 * @param {CLI.configurations} first.configurations - Object configuring how to parse CLI arguments
 * @returns {CLI.parsed}
 * @example
 * ```javascript
 * const parameters = [ '--help', '--file-path', 'some/where/file.ext' ];
 *
 * const configurations = {
 *   help: {
 *     help: "Print usage tips and exit"
 *     parameters: ["-h", "--help", "--usage"],
 *     value_default: false,
 *     value_type: "boolean",
 *   },
 *   file_path: {
 *     help: "Path to somewhere on the file system",
 *     parameters: ["--file-path"],
 *     value_type: "string",
 *   },
 * };
 *
 * const parsed = parseCLI({ parameters, configurations });
 *
 * assert.equal(parsed.help, true, "Failed to parse `--help`");
 *
 * assert.equal(
 *   parsed.file_path,
 *   "some/where/file.ext",
 *   "Failed to parse `--file-path`"
 * );
 * ```
 */
function parseCLI({
  parameters,
  configurations,
}: {
  parameters: string[];
  configurations: CLI.configurations;
}): CLI.parsed {
  return Object.entries(configurations).reduce((accumulator, [key, config]) => {
    accumulator[key] = config.value_default;
    for (let index = 0; index < parameters.length; index++) {
      let parameter = parameters[index];
      if (parameter.includes("=")) {
        parameter = parameter.split("=")[0];
      }

      if (!config.parameters.includes(parameter)) {
        continue;
      }

      if (config.value_type === "boolean") {
        accumulator[key] = !config.value_default;
      } else {
        let value;

        if (parameters[index].includes("=")) {
          value = parameters[index].split("=").slice(1).join("=");
        } else {
          index++;
          value = parameters[index];
        }

        if (config.value_type === "number") {
          index++;
          accumulator[key] = Number(value);
        } else if (config.value_type === "string") {
          index++;
          accumulator[key] = value;
        }
      }
    }
    return accumulator;
  }, {} as CLI.parsed);
}
