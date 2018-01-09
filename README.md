# Yarn Lazy Lock

As opposed to `npm install`, `yarn` always try to get the latest versions if
it's not locked down in the `yarn.lock` file. This tool updates the lock file
to lock versions mentionned in the `package.json` file if the installed version
are good enough.

This should make the follow up `yarn` command faster as it won't try to update
those packages.

The tool also outputs the package that would still need to be installed or
updated because they are not installed or their version do not match.

## Installation

```
npm -g i yarn-lazy-lock
```

## Usage

Run the tool in your folder containing `package.json` and `yarn.lock`:
```
yarn-lazy-lock
```
