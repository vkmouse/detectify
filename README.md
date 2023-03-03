<a align="center" href="https://detectify.tw/">
  <p align="center">
    <img width="300" src="https://user-images.githubusercontent.com/33388935/222368134-3c99f3b6-f4ba-4e22-aba9-93be15a3a9c1.png">
  </p>
</a>

# 

🖥️ **Detectify** is a website that makes it easy to create an object detection service.  
<br/>
🔗 Website URL: https://detectify.tw/  
<br/>
⚒️ Test account and password

|Account|Password|
|---|---|
|a@a.a|aaaa|

## Table of Contents

- [Main Features](#main-features)
  - [Detect on website](#detect-on-website)
  - [Train on website](#train-on-website)
  - [Prepare own server on Colab](#prepare-own-server-on-colab)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Backend Technique](#backend-technique)
- [Frontend Technique](#frontend-technique)
- [API Documentation](#api-documentation)

## Main Features

### Detect on website

Upload an image directly on **Detectify** for the purpose of testing the model's detection capabilities.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/DetectOnWeb.gif" width="500px" />

### Train on website

Label and train directly on **Detectify** for the purpose of quickly creating customized detection services.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/TrainOnWeb.gif" width="500px" />

### Prepare own server on Colab

Integrate Colab computing resources for setting up a personal training server

<img src="https://github.com/vkmouse/detectify/blob/main/docs/ServerOnColab.gif" width="500px" />

## Architecture

- The frontend is developed using React and hosted on Cloudflare Pages.
- Both the application server for project management and the training proxy are built using the Go Gin framework.
- Our training server, built with the Python Flask framework, is hosted on Colab.
- Users can actively access their own training servers on Colab through the training proxy using SSH tunneling, even if they are located within a private network.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/Architecture.png" width=500 />

## Database Schema

- Each element in `users` can have multiple projects.
- Each element in `projects` include a model and multiple images.
- Each element in `project_images` includes information on whether the image and annotation have been published or not.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/DatabaseSchema.png" width=500 />

## Backend Technique

### Framework

- Gin (Go)
- Flask (Python)

### Infrastructure

- Docker
- docker-compose
- DNS
- NGINX
- SSL (SSL For Free)
- SSH Tunneling

### Database

- MySQL

### Cloud Services

- AWS EC2
- AWS RDS
- Cloudflare R2
- Cloudflare Pages
- Google Colab

## Frontend Technique

### React Hooks

<img src="https://github.com/vkmouse/detectify/blob/main/docs/ReactComponents.png" width=500 />

### Package

- Axios
- Babel
- ESLint
- Prettier
- React Router
- React Hook Form
- React Query
- Redux (with redux-toolkit)
- Styled Components
- TensorFlow.js
- TypeScript
- webpack

## API Documentation

- [Training server API](https://app.swaggerhub.com/apis-docs/vkmouse/Detectify-Training-Server/1.0.0)
- [Training proxy server API](https://app.swaggerhub.com/apis-docs/vkmouse/Detectify-Training-Proxy-Server/1.0.0)
