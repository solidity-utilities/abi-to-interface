#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function formatVersion({
  package_data,
}: {
  package_data: { [key: string]: unknown };
}): string {
  return [
    `${package_data.name} - ${package_data.version}`,
    package_data.license,
    `Written by ${package_data.author}`,
  ].join("\n");
}
