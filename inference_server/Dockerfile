FROM openvino/ubuntu20_runtime:latest

WORKDIR /app
COPY requestments.txt requestments.txt
RUN python3 -m pip install -r requestments.txt
COPY . .

# Run web server
CMD ["python3", "app.py"]