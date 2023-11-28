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
- [Deployment](#deployment)
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

   _(For iOS options, refer to [package.json](package.json).)_

## Deployment

### Production

To deploy the application to the production environment (both Google Play and App Store), run the `publish` action
workflow and select type `production`. This is only allowed for the main branch.

### Beta

The main branch of the repository is automatically deployed to the Google Play beta. Any changes pushed to the main
branch will trigger a new deployment.

### Firebase App Distribution

To deploy any branch to the Firebase App Distribution, use the `Publish` GitHub workflow with a type starting
with `firebase` (e.g., `firebase-staging`). Select the suffix based on the API for which you want to publish the app
version, e.g., `firebase-development` uses the development API.

## Contributing

Contributions are welcome! If you encounter issues or have suggestions for improvements, please open an issue or submit
a pull request. For more information, refer to
the [contribution guidelines](https://github.com/AplinkosMinisterija/.github/blob/main/CONTRIBUTING.md).
