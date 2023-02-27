#!/bin/zsh

for i in {1..50}; do
    nohup node pressure.js &
done

