/** @format */

//HTTP GETをハンドリングする
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("latest");
  var range = sheet.getRange("A1");
  var value = range.getValue().split(",");

  let json = {
    date: value[0], //日付
    temp: value[1], //温度
    RH: value[2], //湿度
    lumin: value[3], //照度
  };

  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify(json));
}