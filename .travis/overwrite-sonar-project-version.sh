#!/usr/bin/env bash

sed -i '/sonar.projectVersion=/d' ./sonar-project.properties

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "sonar.projectVersion=$PACKAGE_VERSION" >> ./sonar-project.properties