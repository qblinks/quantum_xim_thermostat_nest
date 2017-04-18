#!/bin/bash

quantum-local -r $AWS_REGION -l index.js -h handler -e event-samples/authenticate.js -t 15
