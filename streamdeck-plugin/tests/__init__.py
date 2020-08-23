"""
Sets up our path to fix module resolution for our tests' folder structure being
parallel to our src structure.
"""

import os
import sys

project_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
src_path = os.path.join(project_path, 'src')
sys.path.append(src_path)
