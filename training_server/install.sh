echo '[>          ] (0/5)'

git clone --depth 1 https://github.com/tensorflow/models.git /tmp/models > /dev/null 2>&1
cd /tmp/models/research/
protoc object_detection/protos/*.proto --python_out=.
cp object_detection/packages/tf2/setup.py ./
echo '[==>        ] (1/5)'

python -m pip install -U pip > /dev/null 2>&1
python -m pip install . > /dev/null 2>&1
python -m pip install --no-cache-dir openvino-dev[tensorflow2] > /dev/null 2>&1
echo '[====>      ] (2/5)'

mkdir /tensorflow > /dev/null 2>&1
mkdir /tensorflow/models > /dev/null 2>&1
cd /tensorflow/models > /dev/null 2>&1
wget http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz --directory-prefix /tmp > /dev/null 2>&1
wget http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8.tar.gz --directory-prefix /tmp > /dev/null 2>&1
tar zxvf /tmp/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz > /dev/null 2>&1
tar zxvf /tmp/ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8.tar.gz > /dev/null 2>&1
echo '[======>    ] (3/5)'

wget https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/_downloads/da4babe668a8afb093cc7776d7e630f3/generate_tfrecord.py --directory-prefix '/tensorflow/scripts' > /dev/null 2>&1
echo '[========>  ] (4/5)'

git clone https://github.com/vkmouse/detectify.git /tmp/detectify > /dev/null 2>&1
cp -r /tmp/detectify/training_server/* /tensorflow > /dev/null 2>&1
cd /tensorflow > /dev/null 2>&1
pip install -r requestments.txt > /dev/null 2>&1
echo '[==========>] (5/5)'

