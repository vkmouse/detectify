import io
import os
import requests
import zipfile


def unzip_file(zip_file_path, extract_path):
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)


def upload_zip_file(zip_file, presigned_url):
    headers = {'Content-Type': 'application/zip'}
    response = requests.put(presigned_url, data=zip_file, headers=headers)
    return response.status_code == 200


def zip_directory(directory):
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w') as zf:
        for root, _, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                zf.write(file_path, arcname=os.path.relpath(file_path, directory))
    memory_file.seek(0)
    return memory_file.getvalue()


def zip_directory_and_upload(directory, presigned_url):
    zip_file = zip_directory(directory)
    return upload_zip_file(zip_file, presigned_url)
