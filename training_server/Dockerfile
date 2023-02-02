# syntax=docker/dockerfile:1
FROM tensorflow/tensorflow:latest-gpu

# Set args
ARG models_path=/tensorflow/models
ARG scripts_path=/tensorflow/scripts
ARG workspace_path=/tensorflow/workspace
ARG site_packages_path=/usr/local/lib/python3.8/dist-packages
ENV MODELS_PATH=$models_path
ENV SCRIPT_PATH=$scripts_path
ENV WORKSPACE_PATH=$workspace_path
ENV SITE_PACKAGES_PATH=$site_packages_path

# Install apt dependencies
RUN apt-get update && apt-get install -y \
    git \
    protobuf-compiler \
    libgl1 \
    wget

# Download model garden into the image
RUN git clone --depth 1  https://github.com/tensorflow/models.git /tmp/models

# Compile protobuf configs
WORKDIR /tmp/models/research/
RUN protoc object_detection/protos/*.proto --python_out=.
RUN cp object_detection/packages/tf2/setup.py ./

# Install requestments
RUN python -m pip install -U pip
RUN python -m pip install .
RUN python -m pip install --no-cache-dir openvino-dev[tensorflow2]

# Prepare pre-trained-models
WORKDIR $models_path
RUN wget http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz --directory-prefix /tmp
RUN wget http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8.tar.gz --directory-prefix /tmp
RUN tar zxvf /tmp/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz
RUN tar zxvf /tmp/ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8.tar.gz

# Prepare preprocessing scripts
RUN wget https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/_downloads/da4babe668a8afb093cc7776d7e630f3/generate_tfrecord.py --directory-prefix $scripts_path

# Copy web server
WORKDIR /tensorflow
COPY requestments.txt requestments.txt
RUN pip install -r requestments.txt
COPY . .

# Run web server
CMD ["python", "app.py"]