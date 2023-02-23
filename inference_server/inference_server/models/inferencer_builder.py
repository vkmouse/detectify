import hashlib
import json
import os
import uuid

from inference_server.models.inferencer import Inferencer
from inference_server.utils import download_file
from inference_server.utils import unzip_file


class InferencerBuilder:
    def __init__(self, workspace: str):
        self.models_dir = os.path.join(workspace, 'models')
        self.images_dir = os.path.join(workspace, 'images')
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)
        if not os.path.exists(self.images_dir):
            os.makedirs(self.images_dir)

    def build(self, model_url: str, image_url: str = None, image_data: bytes = None):
        (model_dir, model_path) = self.download_model(model_url)
        (model_width, model_height, label_map) = self.load_model_info(model_dir)
        if image_url:
            image_path = self.download_image(image_url)
        if image_data:
            image_path = self.save_image(image_data)
        inferencer = Inferencer(model_path, model_width, model_height, label_map)
        return (inferencer, image_path)

    def download_model(self, model_url: str) -> str:
        hash = hashlib.sha256(model_url.encode('utf-8')).hexdigest()
        model_dir = os.path.join(self.models_dir, hash)
        model_path = os.path.join(model_dir, 'saved_model.xml')
        zip_file_path = os.path.join(model_dir, 'saved_model.zip')
        if not os.path.exists(model_dir):
            os.mkdir(model_dir)
        if not os.path.exists(model_path):
            download_file(model_url, zip_file_path)
            unzip_file(zip_file_path, model_dir)
        if not os.path.exists(model_path):
            print('download model error')
        return (model_dir, model_path)

    def download_image(self, image_url: str) -> str:
        hash = hashlib.sha256(image_url.encode('utf-8')).hexdigest()
        image_path = os.path.join(self.images_dir, hash)
        if not os.path.exists(image_path):
            download_file(image_url, image_path)
        if not os.path.exists(image_path):
            print('download image error')
        return image_path

    def save_image(self, image_data: bytes) -> str:
        id = str(uuid.uuid4())
        image_path = os.path.join(self.images_dir, id)
        with open(image_path, 'wb') as f:
            f.write(image_data)
        if not os.path.exists(image_path):
            print('download image error')
        return image_path

    def load_model_info(self, model_dir: str):
        meta = os.path.join(model_dir, 'data.meta')
        with open(meta, 'r') as file:
            data = json.load(file)
            width = int(data['model']['width'])
            height = int(data['model']['height'])
            label_map = data['labels']
            return (width, height, label_map)


def file_extension(path):
    return os.path.splitext(path)[1]
