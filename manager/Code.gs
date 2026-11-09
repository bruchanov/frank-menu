/**
 * Frank by Баста · учебное меню: приём прогресса стажёров в Google Таблицу.
 * 1) Вставь этот код в Apps Script таблицы (Расширения → Apps Script).
 * 2) Поменяй SECRET на свой пароль (такой же будет в config.js).
 * 3) Один раз запусти функцию setup(), затем Развернуть → Веб-приложение.
 */
const SECRET = 'ПОМЕНЯЙ-МЕНЯ';
const S_MAIN = 'Стажёры', S_HIST = 'История', S_SUM = 'Сводка';
const HEAD = ['ID','Обновлено','Имя','Фамилия','Филиал','Уровень','XP','Выучено','Всего в меню','Выучено %','Точность %','Ответов в тестах','Серия','Лучшая серия','Сегодня','Цель','Достижений','По разделам','Слабые места','Начал','Telegram'];

function setup() {
  const ss = SpreadsheetApp.getActive();
  let m = ss.getSheetByName(S_MAIN) || ss.insertSheet(S_MAIN);
  m.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight('bold').setBackground('#e30613').setFontColor('#ffffff');
  m.setFrozenRows(1); m.setFrozenColumns(4);
  m.getRange('B:B').setNumberFormat('dd.mm.yyyy hh:mm');
  m.setColumnWidth(18, 420); m.setColumnWidth(19, 320);
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($A2<>"",$B2<NOW()-3)').setBackground('#f4cccc').setRanges([m.getRange('A2:U1000')]).build();
  m.setConditionalFormatRules([rule]);
  let h = ss.getSheetByName(S_HIST) || ss.insertSheet(S_HIST);
  h.getRange(1, 1, 1, 8).setValues([['Ключ','Дата','ID','Имя','Фамилия','Филиал','Ответов за день (накоплено)','XP']]).setFontWeight('bold');
  h.setFrozenRows(1);
  let s = ss.getSheetByName(S_SUM) || ss.insertSheet(S_SUM);
  s.clear();
  s.getRange('A1').setValue('Сводка по филиалам').setFontWeight('bold').setFontSize(14);
  s.getRange('A3').setFormula('=IFERROR(QUERY(\'' + S_MAIN + '\'!A2:U, "select E, count(A), avg(J), avg(K), avg(M) where A is not null group by E label E \'Филиал\', count(A) \'Стажёров\', avg(J) \'Ср. выучено %\', avg(K) \'Ср. точность %\', avg(M) \'Ср. серия\'", 0), "Пока нет данных")');
  s.getRange('A12').setValue('Не заходили 3+ дня подсвечены красным на листе «' + S_MAIN + '».').setFontStyle('italic');
  SpreadsheetApp.flush();
}

function doGet() { return ContentService.createTextOutput('Frank menu sync: работает'); }

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.key !== SECRET || !d.id) return ContentService.createTextOutput('denied');
    const ss = SpreadsheetApp.getActive();
    const m = ss.getSheetByName(S_MAIN);
    const pct = d.total ? Math.round(d.known / d.total * 100) : 0;
    const row = [d.id, new Date(), d.name, d.surname, d.branch, d.level, d.xp, d.known, d.total, pct, d.acc, d.qs, d.streak, d.best, d.today, d.goal, d.badges, d.cats, d.weak, d.since, d.tg].map(safe);
    row[1] = new Date();
    upsert(m, 1, d.id, row);
    const h = ss.getSheetByName(S_HIST);
    const key = d.id + '|' + d.date;
    upsert(h, 1, key, [key, d.date, d.id, safe(d.name), safe(d.surname), safe(d.branch), d.today, d.xp]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error');
  } finally {
    lock.releaseLock();
  }
}

function upsert(sheet, col, key, row) {
  const last = sheet.getLastRow();
  let r = -1;
  if (last > 1) {
    const vals = sheet.getRange(2, col, last - 1, 1).getValues();
    for (let i = 0; i < vals.length; i++) if (String(vals[i][0]) === String(key)) { r = i + 2; break; }
  }
  if (r < 0) r = last + 1;
  sheet.getRange(r, 1, 1, row.length).setValues([row]);
}

// защита от формул в имени: =, +, -, @ в начале строки
function safe(v) { return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v; }
