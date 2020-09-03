#!/bin/sh
INPUT_FOLDER=./test/input
OUT_FOLDER=./test/out
echo "Setting up for tests:\n\
delete content of\n\
	- 'test/out/'\n\
	- 'test/input/\n"
if [[ -e "$INPUT_FOLDER" ]]; then
		echo "Removing '$INPUT_FOLDER'"
		rm -r ./test/input
fi

if [[ -e "$OUT_FOLDER" ]]; then
	if [[ "$(ls -A $OUT_FOLDER)" ]]; then
		echo "Removing contents of 'out/'"
		rm -r ./test/out/*
	else
		echo "No files in '$OUT_FOLDER'"
	fi
fi