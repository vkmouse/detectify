from dotenv import load_dotenv
import os

load_dotenv()
site_pkg_path = os.getenv('SITE_PACKAGES_PATH')
workspace_path = os.getenv('WORKSPACE_PATH')
