#!/usr/bin/env sh
. "$(dirname -- "$0")/_/hook.sh"

deno lint
deno fmt --check
deno test