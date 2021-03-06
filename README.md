# Solidity ABI To Interface
[heading__top]:
  #solidity-abi-to-interface
  "&#x2B06; Node JS CLI script for converting Solidity ABI to interface contract"


Node JS CLI script for converting Solidity ABI to interface contract


## [![Byte size of Abi To Interface][badge__main__abi_to_interface__source_code]][abi_to_interface__main__source_code] [![Open Issues][badge__issues__abi_to_interface]][issues__abi_to_interface] [![Open Pull Requests][badge__pull_requests__abi_to_interface]][pull_requests__abi_to_interface] [![Latest commits][badge__commits__abi_to_interface__main]][commits__abi_to_interface__main] [![License][badge__license]][branch__current__license]


---


- [:arrow_up: Top of Document][heading__top]

- [:building_construction: Requirements][heading__requirements]

- [:zap: Quick Start][heading__quick_start]

- [&#x1F9F0; Usage][heading__usage]

- [&#x1F5D2; Notes][heading__notes]

- [:chart_with_upwards_trend: Contributing][heading__contributing]

  - [:trident: Forking][heading__forking]
  - [:currency_exchange: Sponsor][heading__sponsor]

- [:card_index: Attribution][heading__attribution]

- [:balance_scale: Licensing][heading__license]


---



## Requirements
[heading__requirements]:
  #requirements
  "&#x1F3D7; Prerequisites and/or dependencies that this project needs to function properly"


> Prerequisites and/or dependencies that this project needs to function properly


Node JS and NPM, or similar Node JS package manager, is required to utilize this
project and dependencies.


______


## Quick Start
[heading__quick_start]:
  #quick-start
  "&#9889; Perhaps as easy as one, 2.0,..."


> Perhaps as easy as one, 2.0,...


Install project globally...


```bash
npm install --global @solidity-utilities/abi-to-interface
```


Available CLI parameters may be listed via `--help` option...


```bash
solidity-abi-to-interface --help
```


---


Note, if `solidity-abi-to-interface` reports errors similar to...


    bash: solidity-abi-to-interface: command not found


... then please ensure the `PATH` variable includes a reference to the NPM
prefixed `bin/` directory, eg.


```bash
# Add prefix if not defined
grep -qE '^prefix ' <(npm config ls) || {
  tee -a "${HOME}/.npmrc" 1>/dev/null <<EOF
prefix = "${HOME}/.npm"
EOF
}


# Append to PATH variable if not defined
_npm_prefix="$(awk '/^prefix / {
  gsub("\"", "");
  print $3;
}' <(npm config ls))"

grep -qE "(:)?(${_npm_prefix}/bin)(:)?" <<<"${PATH}" || {
  tee -a "${HOME}/.bashrc" 1>/dev/null <<EOF
export PATH="${PATH}:${_npm_prefix}/bin"
EOF
}


# Reload Bash RC file
source "${HOME}/.bashrc"
```


______


## Usage
[heading__usage]:
  #usage
  "&#x1F9F0; How to utilize this repository"


> How to utilize this repository


Change current working directory to a Solidity project...


```bash
cd ~/git/hub/solidity-utilities/example
```


Compile contract(s) into ABI JSON file(s)...


```bash
truffle compile
```


Generate an interface contract based on _`Account`_ contract ABI...


```bash
solidity-abi-to-interface --abi build/contracts/Account.json\
                          --out contracts/InterfaceAccount.sol
```


---


A source contract such as...


**`contracts/Account.sol`**


```solidity
// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.7;

contract Account {
    string public name;
    address payable public owner;

    function updateName(string calldata _new_name) external {
        require(msg.sender == owner, "Owner required");
        name = _new_name;
    }
}
```


Will result in an interface similar to...


**`contracts/InterfaceAccount.sol`**


```solidity
// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.7;

/// @title Automatically generated by `@solidity-utilities/abi-to-interface`
interface InterfaceAccount {
    /* Variable getters */

    function name() external view returns (string memory);

    function owner() external view returns (address payable);

    /* Function definitions */

    function updateName(string calldata _new_name) external;
}
```


______


## Notes
[heading__notes]:
  #notes
  "&#x1F5D2; Additional things to keep in mind when utilizing this project"


> Additional things to keep in mind when utilizing this project


This repository may not be feature complete and/or fully functional, Pull
Requests that add features or fix bugs are certainly welcomed.


______


## Contributing
[heading__contributing]:
  #contributing
  "&#x1F4C8; Options for contributing to abi-to-interface and solidity-utilities"


> Options for contributing to abi-to-interface and solidity-utilities


---


### Forking
[heading__forking]:
  #forking
  "&#x1F531; Tips for forking abi-to-interface"


> Tips for forking `abi-to-interface`


Make a [Fork][abi_to_interface__fork_it] of this repository to an account that
you have write permissions for.


- Clone fork URL. The URL syntax is _`git@github.com:<NAME>/<REPO>.git`_, then add this repository as a remote...


```bash
mkdir -p ~/git/hub/solidity-utilities

cd ~/git/hub/solidity-utilities

git clone --origin fork git@github.com:<NAME>/abi-to-interface.git

git remote add origin git@github.com:solidity-utilities/abi-to-interface.git
```


- Install development dependencies


```bash
cd ~/git/hub/solidity-utilities/abi-to-interface

npm ci
```


> Note, the `ci` option above is recommended instead of `install` to avoid
> mutating the `package.json`, and/or `package-lock.json`, file(s) implicitly


- Commit your changes and push to your fork, eg. to fix an issue...


```bash
cd ~/git/hub/solidity-utilities/abi-to-interface


git commit -F- <<'EOF'
:bug: Fixes #42 Issue


**Edits**


- `<SCRIPT-NAME>` script, fixes some bug reported in issue
EOF


git push fork main
```


- Then on GitHub submit a Pull Request through the Web-UI, the URL syntax is _`https://github.com/<NAME>/<REPO>/pull/new/<BRANCH>`_


> Note; to decrease the chances of your Pull Request needing modifications
> before being accepted, please check the
> [dot-github](https://github.com/solidity-utilities/.github) repository for
> detailed contributing guidelines.



---


### Sponsor
  [heading__sponsor]:
  #sponsor
  "&#x1F4B1; Methods for financially supporting solidity-utilities that maintains abi-to-interface"


> Methods for financially supporting `solidity-utilities` that maintains
> `abi-to-interface`


Thanks for even considering it!


Via Liberapay you may
<sub>[![sponsor__shields_io__liberapay]][sponsor__link__liberapay]</sub> on a
repeating basis.


For non-repeating contributions Ethereum is accepted via the following public address;


    0x5F3567160FF38edD5F32235812503CA179eaCbca


Regardless of if you're able to financially support projects such as
`abi-to-interface` that `solidity-utilities` maintains, please consider sharing
projects that are useful with others, because one of the goals of maintaining
Open Source repositories is to provide value to the community.


______


## Attribution
[heading__attribution]:
  #attribution
  "&#x1F4C7; Resources that where helpful in building this project so far."


- [Etherum StackExchange -- How to create interface to read Struct in mapping?](https://ethereum.stackexchange.com/questions/61366/)

- [GitHub -- `github-utilities/make-readme`](https://github.com/github-utilities/make-readme)

- [Medium -- Build and Publish Your First Command Line Application with Node.JS and NPM](https://medium.com/@cruzw/build-and-publish-your-first-command-line-application-with-npm-6192f4044779)

- [Solidity Docs -- Contracts -- Interfaces](https://docs.soliditylang.org/en/v0.8.9/contracts.html#interfaces)


______


## License
[heading__license]:
  #license
  "&#x2696; Legal side of Open Source"


```
Node JS CLI script for converting Solidity ABI to interface contract
Copyright (C) 2021 S0AndS0

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```


For further details review full length version of [AGPL-3.0][branch__current__license] License.



[branch__current__license]:
  /LICENSE
  "&#x2696; Full length version of AGPL-3.0 License"

[badge__license]:
  https://img.shields.io/github/license/solidity-utilities/abi-to-interface

[badge__commits__abi_to_interface__main]:
  https://img.shields.io/github/last-commit/solidity-utilities/abi-to-interface/main.svg

[commits__abi_to_interface__main]:
  https://github.com/solidity-utilities/abi-to-interface/commits/main
  "&#x1F4DD; History of changes on this branch"


[abi_to_interface__community]:
  https://github.com/solidity-utilities/abi-to-interface/community
  "&#x1F331; Dedicated to functioning code"


[issues__abi_to_interface]:
  https://github.com/solidity-utilities/abi-to-interface/issues
  "&#x2622; Search for and _bump_ existing issues or open new issues for project maintainer to address."

[abi_to_interface__fork_it]:
  https://github.com/solidity-utilities/abi-to-interface/fork
  "&#x1F531; Fork it!"

[pull_requests__abi_to_interface]:
  https://github.com/solidity-utilities/abi-to-interface/pulls
  "&#x1F3D7; Pull Request friendly, though please check the Community guidelines"

[abi_to_interface__main__source_code]:
  https://github.com/solidity-utilities/abi-to-interface/
  "&#x2328; Project source!"

[badge__issues__abi_to_interface]:
  https://img.shields.io/github/issues/solidity-utilities/abi-to-interface.svg

[badge__pull_requests__abi_to_interface]:
  https://img.shields.io/github/issues-pr/solidity-utilities/abi-to-interface.svg

[badge__main__abi_to_interface__source_code]:
  https://img.shields.io/github/repo-size/solidity-utilities/abi-to-interface


[sponsor__shields_io__liberapay]:
  https://img.shields.io/static/v1?logo=liberapay&label=Sponsor&message=solidity-utilities

[sponsor__link__liberapay]:
  https://liberapay.com/solidity-utilities
  "&#x1F4B1; Sponsor developments and projects that solidity-utilities maintains via Liberapay"


[badge__github_actions]:
  https://github.com/solidity-utilities/abi-to-interface/actions/workflows/test.yaml/badge.svg?branch=main

[activity_log__github_actions]:
  https://github.com/solidity-utilities/abi-to-interface/deployments/activity_log

[truffle__package_management_via_npm]:
  https://www.trufflesuite.com/docs/truffle/getting-started/package-management-via-npm
  "Documentation on how to install, import, and interact with Solidity packages"

