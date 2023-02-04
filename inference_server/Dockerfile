FROM openvino/ubuntu20_runtime:latest

WORKDIR /app
COPY requestments.txt requestments.txt
RUN python3 -m pip install -r requestments.txt
COPY . .

ENV WORKSPACE_PATH=/tmp

# Run web server
CMD ["python3", "app.py"]