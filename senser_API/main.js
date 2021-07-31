/** @format */

// 部屋の最新の状態を取得する
function getLatestState(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("latest");
  const range = sheet.getRange("A1");
  const value = range.getValue().split(",");

  const json = {
    state: "ok",
    date: value[0], //日付
    temp: value[1], //温度
    RH: value[2], //湿度
    lumin: value[3], //照度
  };

  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify(json));
}

// HTTP GETをハンドリングする
function doGet(e) {
  const type = e.parameter.type;
  if (type == "latest") {
    return getLatestState(e);
  } else {
    return ContentService.createTextOutput()
      .setMimeType(ContentService.MimeType.JSON)
      .setContent(
        JSON.stringify({
          state: "error",
          error: "Make sure you set the parameters correctly.",
        })
      );
  }
}
