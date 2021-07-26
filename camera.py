import cv2
import datetime
import googleDriveAPI as googleAPI

# 監視カメラ
class SurveillanceCamera:
    def __init__(self):
        self.__save_path = "./capture"  # 保存パス
        self.__threshold = 10  # 閾値
        # カメラの開始
        self.__cam = cv2.VideoCapture(0)
        self.__recording = False  # 録画中かどうか
        self.__fourcc = cv2.VideoWriter_fourcc("m", "p", "4", "v")
        self.__camera_width = int(self.__cam.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.__camera_height = int(self.__cam.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.__camera_fps = 30
        print("Setup finished!")

    def __del__(self):
        # 録画の終了
        if self.__recording:
            self.__recording = False
            self.__video.release()
        # カメラの終了
        self.__cam.release()
        cv2.destroyAllWindows()

    def sensor(self):
        # カメラのキャプチャを開始
        img1 = img2 = img3 = self.__get_image()
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

                dt_now = datetime.datetime.now()
                filename = f"{self.__save_path}/{dt_now.year}-{dt_now.month:02}-{dt_now.day:02}_{dt_now.hour:02}:{dt_now.minute:02}:{dt_now.second:06}_{dt_now.microsecond}"

                # 録画開始
                if not self.__recording:
                    print("Human detected!")
                    self.__recording = True
                    self.__video = cv2.VideoWriter(
                        f"{filename}.mp4",
                        self.__fourcc,
                        self.__camera_fps,
                        (self.__camera_width, self.__camera_height),
                    )
                    self.__recording_start_time = dt_now

                print("Recording...")
                self.__video.write(img3)

                # 録画終了
                if (dt_now - self.__recording_start_time).seconds > 5:
                    self.__recording = False
                    self.__video.release()
                    print("Record is finished!")

                # cv2.imwrite(f"{filename}.jpg", img3)
            else:
                cv2.imshow("PUSH ENTER KEY", diff)
            # 比較用の画像を保存
            img1, img2, img3 = (img2, img3, self.__get_image())

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


if __name__ == "__main__":
    camera = SurveillanceCamera()
    camera.sensor()
