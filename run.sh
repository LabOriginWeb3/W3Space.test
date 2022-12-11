#!/bin/zsh

for i in {1..150}; do
    nohup node pressure.js &
done

