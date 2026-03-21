#!/bin/bash
git add .
git commit -m "$1"
git push origin main
wrangler pages deploy . --project-name=puntico
