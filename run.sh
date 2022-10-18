#!/bin/zsh

for i in {1..120}; do
    nohup node pressure.js &
done

