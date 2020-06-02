import {Selector, ClientFunction} from 'testcafe';
import {employId, hour_end, hour_start, monthToBeFilled, password, minutes_end, minutes_start} from './config';


fixture `TimeWatch`
  .page('http://checkin.timewatch.co.il/punch/punch.php')
  .beforeEach(async t => {
  });

test('Fill', async t => {
  const row = Selector('tr').find('td[bgcolor=red]');
  const goBack = ClientFunction(() => window.history.back());
  const getWindowLocation = ClientFunction(() => window.location.href);
  const startHour = Selector('input#ehh0');
  const startMinutes = Selector('input#emm0');
  const endHour = Selector('input#xhh0');
  const endMinutes = Selector('input#xmm0');

  await t
    .typeText(Selector('#compKeyboard'), '3912')
    .typeText(Selector('#nameKeyboard'), employId)
    .typeText(Selector('#pwKeyboard'), password)
    .click(Selector('input[type="image"]'));

  await t
    .click(Selector('a').withText('עדכון נתוני נוכחות'))
    .click(Selector('select[name=month]'))
    .click(Selector('select[name=month]').find('option').withText(monthToBeFilled));

  const location = await getWindowLocation();

  while (await row.exists) {
    await t
      .setTestSpeed(0.9)
      .setNativeDialogHandler(() => true)
      .click(row);

    if (await startHour.exists) {
      if (await startHour.value === '') {
        await t
          .typeText(startHour, hour_start);
        await t
          .typeText(startMinutes, minutes_start);
      }
    }

    if (await endHour.exists) {
      if (await endHour.value === '') {
        await t
          .typeText(endHour, hour_end);
        await t
          .typeText(endMinutes, minutes_end);
      }
    }

    await t
      .setTestSpeed(0.8)
      .click(Selector('input[type="image"]'))
      .navigateTo(location)
      .click(Selector('select[name=month]'))
      .click(Selector('select[name=month]').find('option').withText(monthToBeFilled));
  }
});
