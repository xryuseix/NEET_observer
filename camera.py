# coding: utf-8
import cv2
import sys, os
import json
import datetime
import requests
from requests.auth import HTTPBasicAuth
from multiprocessing import Process

ENDPOINT = "localhost:3001"
# ENDPOINT = "https://neet-obserber.herokuapp.com"

# 監視カメラ
class SurveillanceCamera:
    def __init__(self, credentials):
        self.__save_path = "capture"  # 保存パス
        self.__threshold = 10  # 閾値
        self.__record_time = 5  # 録画時間
        self.__credentials = credentials  # 認証情報
        self.__upload_movie = UploadMovie(self.__credentials) # 動画アップロード
        # カメラの開始
        self.__cam = cv2.VideoCapture(0)
        self.__recording = False  # 録画中かどうか
        self.__fourcc = cv2.VideoWriter_fourcc("m", "p", "4", "v")
        self.__camera_width = int(self.__cam.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.__camera_height = int(self.__cam.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.__camera_fps = 30
        self.__process_list = []  # 動画をアップロードするプロセスを管理するリスト
        print("Setup finished!")

    def __del__(self):
        # 録画の終了
        if self.__recording:
            self.__finish_recording()
        # カメラの終了
        self.__cam.release()
        cv2.destroyAllWindows()
        # プロセスの終了待ち
        for prosess in self.__process_list:
            prosess.join()

    def sensor(self):
        # カメラのキャプチャを開始
        img1 = img2 = img3 = self.__get_image()
        try:
            while True:
                # Enterキーが押されたら終了
                if cv2.waitKey(1) == 13:
                    break
                # 差分を調べる
                diff = self.__check_image(img1, img2, img3)
                # 差分がthの値以上なら動きがあったと判定
                cnt = cv2.countNonZero(diff)
                if cnt > self.__threshold or self.__recording:
                    cv2.imshow("PUSH ENTER KEY", img3)

                    # 録画開始
                    if not self.__recording:
                        print("Human detected!")
                        self.__recording = True
                        dt_now = datetime.datetime.now()
                        self.__filename = (
                            dt_now.strftime(
                                f"{self.__save_path}/%Y-%m-%d_%H:%M:%S_%f.mp4"
                            )
                            if os.name == "posix"
                            else dt_now.strftime(
                                f"{self.__save_path}\\%Y-%m-%d_%H-%M-%S_%f.mp4"
                            )
                        )
                        self.__video = cv2.VideoWriter(
                            self.__filename,
                            self.__fourcc,
                            self.__camera_fps,
                            (self.__camera_width, self.__camera_height),
                        )
                        self.__recording_start_time = dt_now

                    print(
                        f"\rRecording...{datetime.datetime.now().isoformat(timespec='microseconds')}",
                        end="",
                    )
                    self.__video.write(img3)

                    # 録画終了
                    dt_now = datetime.datetime.now()
                    if (
                        dt_now - self.__recording_start_time
                    ).seconds > self.__record_time:
                        self.__finish_recording()
                else:
                    cv2.imshow("PUSH ENTER KEY", diff)
                # 比較用の画像を保存
                img1, img2, img3 = (img2, img3, self.__get_image())
        except KeyboardInterrupt:
            pass

    # フレーム間差分法を用いて画像に動きを調べる
    def __check_image(self, img1, img2, img3):
        # グレイスケール画像に変換
        gray1 = cv2.cvtColor(img1, cv2.COLOR_RGB2GRAY)
        gray2 = cv2.cvtColor(img2, cv2.COLOR_RGB2GRAY)
        gray3 = cv2.cvtColor(img3, cv2.COLOR_RGB2GRAY)
        # 絶対差分を調べる
        diff1 = cv2.absdiff(gray1, gray2)
        diff2 = cv2.absdiff(gray2, gray3)
        # 論理積を調べる
        diff_and = cv2.bitwise_and(diff1, diff2)
        # 白黒二値化
        _, diff_wb = cv2.threshold(diff_and, 30, 255, cv2.THRESH_BINARY)
        # ノイズの除去
        diff = cv2.medianBlur(diff_wb, 5)
        return diff

    # カメラから画像を取得する
    def __get_image(self):
        _, img = self.__cam.read()
        return img

    # 録画を終了する
    def __finish_recording(self):
        self.__recording = False
        self.__video.release()
        process = Process(
            target=self.__upload_movie.upload,
            args={self.__filename},
        )
        process.start()
        self.__process_list.append(process)
        print("\nRecord is finished!")
        


# 動画をアップロードする
class UploadMovie:
    def __init__(self, credentials):
        self.__credentials = credentials

    def upload(self, filename):
        try:
            print(f"\nvideo uploading...({filename})")
            username = self.__credentials["heroku"]["username"]
            password = self.__credentials["heroku"]["password"]
            url = f"{ENDPOINT}/upload"
            files = {
                "file": (filename, open(filename, "rb")),
            }
            response = requests.post(url, files=files, auth=(username, password)).json()
            try:
                if response["status"] == "OK":
                    print(f"video uploaded! ({filename})")
                else:
                    print(response["message"])
            except:
                print(f"[ERROR] upload error... ({filename})")
        except KeyboardInterrupt:
            pass

