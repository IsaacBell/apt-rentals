#!/bin/sh -e

bin/rails server -p 3005 &
cd react/packages && exec yarn start:apt
