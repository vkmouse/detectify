import json
import os
import subprocess


class ModelExporter:
    def __init__(
        self,
        site_pkg_path: str,
        models_dir: str,
        exported_model_dir: str,
        ir_model_dir: str,
        labels_path: str,
    ):
        self.exporter_main_v2 = os.path.join(site_pkg_path, 'object_detection', 'exporter_main_v2.py')
        self.transformations_config = os.path.join(
            site_pkg_path, 'openvino', 'tools', 'mo', 'front', 'tf', 'ssd_support_api_v2.4.json'
        )
        self.models_dir = models_dir
        self.exported_model_dir = exported_model_dir
        self.ir_model_dir = ir_model_dir
        self.labels_path = labels_path
        self.models_pipeline = os.path.join(models_dir, 'pipeline.config')
        self.exported_saved_model = os.path.join(exported_model_dir, 'saved_model')
        self.exported_model_pipeline = os.path.join(exported_model_dir, 'pipeline.config')
        self.ir_model_data = os.path.join(ir_model_dir, 'data.meta')

    def export(self):
        self.export_model(self.models_dir)
        self.export_ir_model()
        self.export_model_data()

    def export_model(self, models_dir: str):
        subprocess.run(
            [
                "python",
                self.exporter_main_v2,
                f"--trained_checkpoint_dir={models_dir}",
                f"--pipeline_config_path={self.models_pipeline}",
                f"--output_directory={self.exported_model_dir}",
            ]
        )

    def export_ir_model(self):
        subprocess.run(
            [
                "mo",
                f"--saved_model_dir={self.exported_saved_model}",
                f"--tensorflow_object_detection_api_pipeline_config={self.exported_model_pipeline}",
                f"--transformations_config={self.transformations_config}",
                "--reverse_input_channels",
                f"--output_dir={self.ir_model_dir}",
            ]
        )

    def export_model_data(self):
        with open(self.models_pipeline, "r") as f:
            content = f.read()
        model_width = content.split("width: ")[1].split("\n")[0]
        model_height = content.split("height: ")[1].split("\n")[0]

        with open(self.labels_path, "r") as f:
            content = f.read()

        label_map = {}
        for item in content.split("item {")[1:]:
            id_str = item.split("id: ")[1].split("\n")[0].strip()
            name_str = item.split("name: '")[1].split("'\n")[0].strip()
            label_map[int(id_str)] = name_str

        with open(self.ir_model_data, "w") as f:
            f.write(
                json.dumps(
                    {
                        "model": {
                            "width": model_width,
                            "height": model_height,
                        },
                        "labels": label_map,
                    },
                    indent=4,
                )
            )
