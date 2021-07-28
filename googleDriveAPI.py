import datetime
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive


class GoogleDriveAPI:
    def __init__(self, credentials):
        gauth = GoogleAuth()
        gauth.LocalWebserverAuth()
        self.__drive = GoogleDrive(gauth)
        self.__folder_id = credentials["drive"]["folder_id"]  # NEET_observer フォルダ

    def upload(self, file_name):
        try:
            f = self.__drive.CreateFile(
                {
                    "parents": [{"kind": "drive#fileLink", "id": self.__folder_id}],
                }
            )
            f.SetContentFile(file_name)
            f.Upload()
        except KeyboardInterrupt:
            pass

if __name__ == "__main__":
    def read_json_file(file_name):
        import json
        with open(file_name) as f:
            return json.load(f)

    credentials = read_json_file("secret.json")
    api = GoogleDriveAPI(credentials)
    api.upload("main.py")
