import camera
import json

def read_json_file(file_name):
    with open(file_name) as f:
        return json.load(f)

credentials = read_json_file("secret.json")
camera = camera.SurveillanceCamera(credentials)
camera.sensor()
del camera