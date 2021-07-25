import cv2
# カメラのキャプチャを開始
cam = cv2.VideoCapture(0)
while True:
    # 画像を取得
    _, img = cam.read()
    # ウィンドウに画像を表示
    cv2.imshow('PUSH ENTER KEY', img)
    # Enterキーが押されたら終了する
    if cv2.waitKey(1) == 13: break
cam.release()
cv2.destroyAllWindows()