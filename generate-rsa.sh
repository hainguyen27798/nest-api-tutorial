#!/bin/bash

DIRECTORY="secrets"
AC_PRIVATE_KEY_FILE="$DIRECTORY/private.pem"
AC_PUBLIC_KEY_FILE="$DIRECTORY/public.pem"
FR_PRIVATE_KEY_FILE="$DIRECTORY/rf-private.pem"

if [ ! -d "$DIRECTORY" ]; then
  mkdir "$DIRECTORY"
fi

if [ ! -f "$AC_PRIVATE_KEY_FILE" ]; then
  # Generate a 2048-bit private key
  openssl genpkey -algorithm RSA -out "$AC_PRIVATE_KEY_FILE" -pkeyopt rsa_keygen_bits:2048
  echo "Access private key generated: $AC_PRIVATE_KEY_FILE"
else
  echo "$AC_PRIVATE_KEY_FILE already exists."
fi

if [ ! -f "$AC_PUBLIC_KEY_FILE" ]; then
  # Extract the public key
  openssl rsa -in "$AC_PRIVATE_KEY_FILE" -pubout -out "$AC_PUBLIC_KEY_FILE"
  echo "Access public key generated: $AC_PUBLIC_KEY_FILE"
else
  echo "$AC_PUBLIC_KEY_FILE already exists."
fi

if [ ! -f "$FR_PRIVATE_KEY_FILE" ]; then
  # Generate a 2048-bit private key
  openssl genpkey -algorithm RSA -out "$FR_PRIVATE_KEY_FILE" -pkeyopt rsa_keygen_bits:2048
  echo "Refresh private key generated: $FR_PRIVATE_KEY_FILE"
else
  echo "$FR_PRIVATE_KEY_FILE already exists."
fi
