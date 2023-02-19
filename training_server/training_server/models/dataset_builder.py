import glob
import io
import os
import pandas as pd
import tensorflow.compat.v1 as tf
import xml.etree.ElementTree as ET

from collections import namedtuple
from object_detection.utils import dataset_util, label_map_util
from PIL import Image
from training_server.utils import download_file


class DatasetBuilder:
    def __init__(
        self,
        dataset_dir: str,
        labels_path: str,
        output_path: str,
    ):
        self.dataset_dir = dataset_dir
        self.labels_path = labels_path
        self.output_path = output_path

    def build(self, dataset):
        self.download_dataset(dataset, self.dataset_dir)
        self.process_dataset(self.dataset_dir, self.labels_path, self.output_path)

    def download_dataset(self, dataset, output_dir):
        for data in dataset:
            filename = data["filename"]
            image_url = data["imageURL"]
            annotation_url = data["annotationURL"]
            image_path = os.path.join(output_dir, f"{filename}{file_extension(image_url)}")
            annotation_path = os.path.join(output_dir, f"{filename}{file_extension(annotation_url)}")
            download_file(image_url, image_path)
            download_file(annotation_url, annotation_path)

    def process_dataset(
        self,
        xml_dir: str,
        labels_path: str,
        output_path: str,
    ):
        generate_label_map(xml_dir, labels_path)
        generate_tfrecord(xml_dir, labels_path, output_path)


def generate_label_map(xml_dir: str, output_path: str):
    label_map = {}
    with open(output_path, "w") as f:
        for xml_file in glob.glob(xml_dir + '/*.xml'):
            tree = ET.parse(xml_file)
            root = tree.getroot()
            for member in root.findall('object'):
                class_name = member.find('name').text
                if class_name not in label_map:
                    label_map[class_name] = len(label_map) + 1
                    f.write(f"item {{\n  id: {label_map[class_name]}\n  name: '{class_name}'\n}}\n\n")
    return label_map


def xml_to_csv(path):
    """Iterates through all .xml files (generated by labelImg) in a given directory and combines
    them in a single Pandas dataframe.

    Parameters:
    ----------
    path : str
        The path containing the .xml files
    Returns
    -------
    Pandas DataFrame
        The produced dataframe
    """

    xml_list = []
    for xml_file in glob.glob(path + '/*.xml'):
        tree = ET.parse(xml_file)
        root = tree.getroot()
        filename = root.find('filename').text
        width = int(root.find('size').find('width').text)
        height = int(root.find('size').find('height').text)
        for member in root.findall('object'):
            bndbox = member.find('bndbox')
            value = (
                filename,
                width,
                height,
                member.find('name').text,
                int(bndbox.find('xmin').text),
                int(bndbox.find('ymin').text),
                int(bndbox.find('xmax').text),
                int(bndbox.find('ymax').text),
            )
            xml_list.append(value)
    column_name = ['filename', 'width', 'height', 'class', 'xmin', 'ymin', 'xmax', 'ymax']
    xml_df = pd.DataFrame(xml_list, columns=column_name)
    return xml_df


def class_text_to_int(labels_path, row_label):
    label_map = label_map_util.load_labelmap(labels_path)
    label_map_dict = label_map_util.get_label_map_dict(label_map)
    return label_map_dict[row_label]


def split(df, group):
    data = namedtuple('data', ['filename', 'object'])
    gb = df.groupby(group)
    return [data(filename, gb.get_group(x)) for filename, x in zip(gb.groups.keys(), gb.groups)]


def create_tf_example(group, path, labels_path):
    with tf.gfile.GFile(os.path.join(path, '{}'.format(group.filename)), 'rb') as fid:
        encoded_jpg = fid.read()
    encoded_jpg_io = io.BytesIO(encoded_jpg)
    image = Image.open(encoded_jpg_io)
    width, height = image.size

    filename = group.filename.encode('utf8')
    image_format = b'jpg'
    xmins = []
    xmaxs = []
    ymins = []
    ymaxs = []
    classes_text = []
    classes = []

    for index, row in group.object.iterrows():
        xmins.append(row['xmin'] / width)
        xmaxs.append(row['xmax'] / width)
        ymins.append(row['ymin'] / height)
        ymaxs.append(row['ymax'] / height)
        classes_text.append(row['class'].encode('utf8'))
        classes.append(class_text_to_int(labels_path, row['class']))

    tf_example = tf.train.Example(
        features=tf.train.Features(
            feature={
                'image/height': dataset_util.int64_feature(height),
                'image/width': dataset_util.int64_feature(width),
                'image/filename': dataset_util.bytes_feature(filename),
                'image/source_id': dataset_util.bytes_feature(filename),
                'image/encoded': dataset_util.bytes_feature(encoded_jpg),
                'image/format': dataset_util.bytes_feature(image_format),
                'image/object/bbox/xmin': dataset_util.float_list_feature(xmins),
                'image/object/bbox/xmax': dataset_util.float_list_feature(xmaxs),
                'image/object/bbox/ymin': dataset_util.float_list_feature(ymins),
                'image/object/bbox/ymax': dataset_util.float_list_feature(ymaxs),
                'image/object/class/text': dataset_util.bytes_list_feature(classes_text),
                'image/object/class/label': dataset_util.int64_list_feature(classes),
            }
        )
    )
    return tf_example


def generate_tfrecord(xml_dir: str, labels_path: str, output_path: str):
    writer = tf.python_io.TFRecordWriter(output_path)
    image_dir = xml_dir
    path = os.path.join(image_dir)
    examples = xml_to_csv(xml_dir)
    grouped = split(examples, 'filename')
    for group in grouped:
        tf_example = create_tf_example(group, path, labels_path)
        writer.write(tf_example.SerializeToString())
    writer.close()
    print('Successfully created the TFRecord file: {}'.format(output_path))


def file_extension(path):
    return os.path.splitext(path)[1]