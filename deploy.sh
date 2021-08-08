#!/bin/bash

DIR="/Users/ryuse/Desktop/NEET_observer"
 
if [ ! -d $DIR ];then
  mkdir $DIR
fi
if [ ! -d "${DIR}/capture" ];then
  mkdir "${DIR}/capture"
fi

cp -f camera.py $DIR
cp -f main.py $DIR
cp -f NEET_env.yml $DIR
cp -f README.md $DIR
cp -f secret.json $DIR
