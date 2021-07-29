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
        except Exception as e:
            print(f"\n[ERROR] {e}")

if __name__ == "__main__":
    gauth = GoogleAuth()
    gauth.CommandLineAuth()
    drive = GoogleDrive(gauth)
    
    response = drive.files().list(spaces='appDataFolder',
                                      fields='nextPageToken, files(id, name)',
                                      pageSize=10).execute()
    for file in response.get('files', []):
        print('Found file: %s (%s)' % (file.get('name'), file.get('id')))
    
    # file_id = drive.ListFile({'q': 'title = "./capture/2021-07-29_22:56:05_827354.mp4"'}).GetList()[0]['id']
    # f = drive.CreateFile({'id': file_id})
    # f.Trash()
    exit()
    def read_json_file(file_name):
        import json
        with open(file_name) as f:
            return json.load(f)

    credentials = read_json_file("secret.json")
    api = GoogleDriveAPI(credentials)
    api.upload("main.py")
