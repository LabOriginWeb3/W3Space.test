#!/bin/zsh

for i in {1..200}; do
    nohup node pressure.js &
done

