import os
import shutil


class Workspace:
    def __init__(self, workspace_path: str):
        self.path = workspace_path
        self.annotations_dir = os.path.join(workspace_path, 'annotations')
        self.annotations_label_map_path = os.path.join(workspace_path, 'annotations', 'label_map.pbtxt')
        self.annotations_train_record_path = os.path.join(workspace_path, 'annotations', 'train.record')
        self.exported_model_dir = os.path.join(workspace_path, 'exported_model')
        self.images_dir = os.path.join(workspace_path, 'images')
        self.ir_model_dir = os.path.join(workspace_path, 'ir_model')
        self.models_dir = os.path.join(workspace_path, 'models')
        self.pretrained_model_dir = os.path.join(workspace_path, 'pre-trained-model')
        self.tfjs_model_dir = os.path.join(workspace_path, 'tfjs_model')

    def prepare(self):
        clear_directory(self.path)
        clear_directory(self.annotations_dir)
        clear_directory(self.images_dir)
        clear_directory(self.models_dir)
        clear_directory(self.pretrained_model_dir)

    def cleanup(self):
        if os.path.exists(self.path):
            shutil.rmtree(self.path)


def clear_directory(dir: str):
    if os.path.exists(dir):
        shutil.rmtree(dir)
    os.makedirs(dir)
