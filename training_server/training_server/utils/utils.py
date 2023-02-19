import ast
import base64
import zipfile
import requests


def parse_token(token):
    try:
        byte_str = base64.b64decode(token)
        dict_str = byte_str.decode("UTF-8")
        data = ast.literal_eval(dict_str)
        return data
    except:
        return None


def download_file(url, output_path: str):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
    except requests.exceptions.RequestException as e:
        raise e
    return output_path
