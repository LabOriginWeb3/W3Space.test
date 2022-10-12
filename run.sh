#!/bin/zsh

for i in {1..100}; do
    nohup node pressure.js &
done

