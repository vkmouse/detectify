import os

from dotenv import load_dotenv

load_dotenv()
workspace_path = os.getenv('WORKSPACE_PATH')
allowed_cors_origin = os.getenv('ALLOWED_CORS_ORIGIN')
