#!/usr/bin/env bash

sed -i '/sonar.projectVersion=/d' ./sonar-project.properties
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "sonar.projectVersion=$PACKAGE_VERSION" >> ./sonar-project.properties

sed -i '/sonar.branch.name=/d' ./sonar-project.properties
echo "sonar.branch.name=$GITHUB_REF" >> ./sonar-project.properties

sed -i '/sonar.branch.target=/d' ./sonar-project.properties
if [ ${GITHUB_REF:0:8} = feature/ ] || [ ${GITHUB_REF:0:7} = develop ]
then
    echo "sonar.branch.target=develop" >> ./sonar-project.properties
else
    echo "sonar.branch.target=master" >> ./sonar-project.properties
fi

