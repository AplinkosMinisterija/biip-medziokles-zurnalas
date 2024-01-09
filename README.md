# Medžioklės žurnalas

[![License](https://img.shields.io/github/license/AplinkosMinisterija/biip-medziokles-zurnalas)](https://github.com/AplinkosMinisterija/biip-medziokles-zurnalas/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/AplinkosMinisterija/biip-medziokles-zurnalas)](https://github.com/AplinkosMinisterija/biip-medziokles-zurnalas/issues)
[![GitHub stars](https://img.shields.io/github/stars/AplinkosMinisterija/biip-medziokles-zurnalas)](https://github.com/AplinkosMinisterija/biip-medziokles-zurnalas/stargazers)

This repository contains the source code and documentation for the BĮIP mobile application Medžiotojo žurnalas,
developed by the Ministry of Environment of the Republic of Lithuania.

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
- [Contributing](#contributing)

## About the Project

The mobile application is intended for hunters of the Republic of Lithuania. It allows you to plan hunts and keep
records of hunted animals in real time using a mobile phone.

## Getting Started

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AplinkosMinisterija/biip-medziokles-zurnalas.git
   ```

2. **Install the required dependencies:**

   ```bash
   cd biip-medziokles-zurnalas
   yarn install
   ```

3. **Set up the development environment:**

   Follow the instructions at [React Native Environment Setup](https://reactnative.dev/docs/environment-setup).

### Usage

1. **Set up environment variables:**

   Copy the `.env.example` file to `.env` and provide the necessary values for the variables.

2. **Start emulator or connect your mobile device.**

3. **Start the application on Android:**

   ```bash
   yarn android
   ```

   *(For iOS options, refer to [package.json](package.json).)*

## Contributing

Contributions are welcome! If you encounter issues or have suggestions for improvements, please open an issue or submit
a pull request. For more information, refer to
the [contribution guidelines](https://github.com/AplinkosMinisterija/.github/blob/main/CONTRIBUTING.md).
