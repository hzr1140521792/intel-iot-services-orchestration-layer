#!/bin/sh



cd message
echo "----- message"
npm install
npm link ../base


cd ../store
echo "----- store"
npm install
npm link ../base


cd ../entity
echo "----- entity"
npm install
npm link ../base


cd ../entity-store
echo "----- entity-store"
npm install
npm link ../base
npm link ../store


cd ../session-manager
echo "----- session-manager"
npm install
npm link ../base

cd ../hub-center-shared
echo "----- hub-center-shared"
npm install
npm link ../base

cd ../hub
echo "----- hub"
npm install
npm link ../base
npm link ../hub-center-shared
npm link ../store
npm link ../message
npm link ../entity
npm link ../entity-store
npm link ../session-manager


cd ../wfe
echo "----- wfe"
npm install
npm link ../base


cd ../center
echo "----- center"
npm install
npm link ../base
npm link ../ui-widgets
npm link ../hub-center-shared
npm link ../store
npm link ../message
npm link ../entity
npm link ../entity-store
npm link ../session-manager
npm link ../hub
npm link ../wfe

cd ../ui-widgets
echo "----- ui-widgets"
npm install
bower --allow-root install
gulp build

cd ../ui-dev
echo "----- ui-dev"
npm install
npm link ../ui-widgets
bower --allow-root install
gulp build

cd ../ui-user
echo "----- ui-user"
npm install
npm link ../ui-widgets
bower --allow-root install
gulp build
