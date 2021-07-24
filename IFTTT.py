import requests
import json

# 参考
# https://estrellita.hatenablog.com/entry/2019/05/31/213000


def read_json_file(file_name):
    with open(file_name) as f:
        return json.load(f)


# 部屋の温度・湿度・照度を取得する
def get_room_state():
    key = read_json_file("secret.json")["gas"]["user_content_key"]
    url = f"https://script.googleusercontent.com/macros/echo?user_content_key={key}"
    res = requests.get(url)
    return res.json()


# 照明をつける
def turn_the_light():
    key = read_json_file("secret.json")["ifttt"]["key"]
    url = f"https://maker.ifttt.com/trigger/RS-WFIREX3/with/key/{key}"
    res = requests.get(url).text
    return res  # "Congratulations! You've fired the RS-WFIREX3 event"


if __name__ == "__main__":
    print(get_room_state())
    print(turn_the_light())
