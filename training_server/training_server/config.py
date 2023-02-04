from dotenv import load_dotenv
import os

load_dotenv()
models_path = os.getenv('MODELS_PATH')
site_pkg_path = os.getenv('SITE_PACKAGES_PATH')
scripts_path = os.getenv('SCRIPT_PATH')
workspace_path = os.getenv('WORKSPACE_PATH')

scripts_generate_tfrecord = os.path.join(scripts_path, 'generate_tfrecord.py')
scripts_pipeline_setter = os.path.join(scripts_path, 'pipeline_setter.py')

workspace_annotations = os.path.join(workspace_path, 'annotations')
workspace_annotations_label_map = os.path.join(workspace_path, 'annotations', 'label_map.pbtxt')
workspace_annotations_train_record = os.path.join(workspace_path, 'annotations', 'train.record')
workspace_exported_model = os.path.join(workspace_path, 'exported_model')
workspace_exported_saved_model = os.path.join(workspace_path, 'exported_model', 'saved_model')
workspace_exported_model_pipeline = os.path.join(workspace_path, 'exported_model', 'pipeline.config')
workspace_fine_tune_checkpoint = os.path.join(workspace_path, 'pre-trained-model', 'checkpoint', 'ckpt-0')
workspace_images = os.path.join(workspace_path, 'images')
workspace_ir_model = os.path.join(workspace_path, 'ir_model')
workspace_ir_model_data = os.path.join(workspace_path, 'ir_model', 'data.meta')
workspace_models = os.path.join(workspace_path, 'models')
workspace_models_pipeline = os.path.join(workspace_path, 'models', 'pipeline.config')
workspace_pretrained_model = os.path.join(workspace_path, 'pre-trained-model')
workspace_pretrained_model_pipeline = os.path.join(workspace_path, 'pre-trained-model', 'pipeline.config')

model_main_tf2 = os.path.join(site_pkg_path, 'object_detection', 'model_main_tf2.py')
exporter_main_v2 = os.path.join(site_pkg_path, 'object_detection', 'exporter_main_v2.py')
transformations_config = os.path.join(
    site_pkg_path, 'openvino', 'tools', 'mo', 'front', 'tf', 'ssd_support_api_v2.4.json'
)
