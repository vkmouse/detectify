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
🔖 Training server API: https://app.swaggerhub.com/apis-docs/vkmouse/Detectify-Training-Server/1.0.0  
<br/>
🔖 Training proxy server API: https://app.swaggerhub.com/apis-docs/vkmouse/Detectify-Training-Proxy-Server/1.0.0  
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
- [Deep Learning Technique](#deep-learning-technique)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Backend Technique](#backend-technique)
- [Frontend Technique](#frontend-technique)
- [Sequence Diagram](#sequence-diagram)

## Main Features

### Detect on website

Upload an image directly on **Detectify** for the purpose of testing the model's detection capabilities.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/DetectOnWeb.gif" width=700 />

### Train on website

Label and train directly on **Detectify** for the purpose of quickly creating customized detection services.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/TrainOnWeb.gif" width=700 />

### Prepare own server on Colab

Integrate Colab computing resources for setting up a personal training server

<img src="https://github.com/vkmouse/detectify/blob/main/docs/ServerOnColab.gif" width=700 />

## Deep Learning Technique

- Deep learning framework: TensorFlow
- Task objective: Object detection - recognizing objects in an image and localizing them
- Training method: [TensorFlow Object Detection API](https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/)
- Training model: [SSD MobileNet v2 320x320](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md)
- Exportable models: [TensorFlow](https://www.tensorflow.org/) and [OpenVINO](https://docs.openvino.ai/) models
- Frontend inference library: Using [TensorFlow.js](https://www.tensorflow.org/js) for inference.

## Architecture

- The frontend is developed using React and hosted on Cloudflare Pages.
- Both the application server for project management and the training proxy are built using the Go Gin framework.
- Our training server, built with the Python Flask framework, is hosted on Colab.
- Users can actively access their own training servers on Colab through the training proxy using SSH tunneling, even if they are located within a private network.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/Architecture.png" width=700 />

### Training Proxy Example

- Alice and Bob have separate training servers.
- The training proxy server redirects requests to the appropriate server based on the user.
- The connection between the proxy and training server is established using ssh tunneling, ensuring secure communication.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/TrainingProxyExample.png" width=700 />

## Database Schema

- Each element in `users` can have multiple projects.
- Each element in `projects` include a model and multiple images.
- Each element in `project_images` includes information on whether the image and annotation have been published or not.

<img src="https://github.com/vkmouse/detectify/blob/main/docs/DatabaseSchema.png" width=700 />

## Backend Technique

### Framework

- Gin (Go) for backend and training proxy server
- Flask (Python) for training server

### Infrastructure

- Docker
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

<img src="https://github.com/vkmouse/detectify/blob/main/docs/ReactComponents.png" width=700 />

### Packages

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

## Sequence Diagram

### Detection

Frontend obtain the model and perform the detection directly on the client side.  
<img src="https://github.com/vkmouse/detectify/blob/main/docs/DetectionSequenceDiagram.png" width=700 />

### Training process
Proxy server add a hook to the training server, the training server will notify the proxy server to update the model when training completed.  
<img src="https://github.com/vkmouse/detectify/blob/main/docs/TrainingProcessSequenceDiagram.png" width=700 />

### Training requestment

When accessing the training server, the request is routed through a proxy server. The proxy server uses the user ID to determine which server to redirect.  
<img src="https://github.com/vkmouse/detectify/blob/main/docs/TrainingRequestmentSequenceDiagram.png" width=700 />

