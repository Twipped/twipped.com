#!/bin/bash
HASH=$(find $1 -type f -print0 | sort -z | xargs -0 shasum | shasum | awk '{print $1;}')
echo -n "{\"hash\":\"${HASH}\"}"
