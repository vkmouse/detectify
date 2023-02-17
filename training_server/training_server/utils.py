import ast
import base64
import io
import os.path as path
import os
import requests
import shutil
import uuid
import zipfile


def get_file_extension(path):
    return os.path.splitext(path)[1]


def download_file(url, savedir, filename):
    if not os.path.exists(savedir):
        os.mkdir(savedir)
    response = requests.get(url)
    extension = get_file_extension(url)
    filepath = os.path.join(savedir, filename + extension)
    with open(filepath, 'wb') as f:
        f.write(response.content)
    return filepath


def unzip_file(zip_file_path, extract_path):
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)


def zip_directory(directory, output):
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w') as zf:
        for root, _, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                zf.write(file_path, arcname=os.path.relpath(file_path, directory))
    memory_file.seek(0)
    with open(output, 'wb') as f:
        f.write(memory_file.getvalue())


def mkdir_if_not_exists(dir):
    if not os.path.exists(dir):
        os.mkdir(dir)


def mkdir(dir):
    os.mkdir(dir)


def rmdir(dir):
    if os.path.exists(dir):
        shutil.rmtree(dir)


def cpdir(src, dst):
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def generate_uuid():
    return str(uuid.uuid4())


def parse_token(token):
    try:
        byte_str = base64.b64decode(token)
        dict_str = byte_str.decode("UTF-8")
        data = ast.literal_eval(dict_str)
        return data
    except:
        return None
