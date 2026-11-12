import {test,expect} from '@playwright/test';import path from 'node:path';import {pathToFileURL} from 'node:url';
test('private register imports once, excludes tests, edits and exports without network',async({page})=>{
 const requests=[];page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});await page.goto(pathToFileURL(path.resolve('operations/lead-register.html')).href);
 const base={schemaVersion:1,receivedAt:new Date().toISOString(),name:'Synthetic visitor',email:'sample@example.invalid',purpose:'retail',status:'Reviewed',owner:'Organiya founder',interests:'all',source:'qr'};
 const rows=[{...base,reference:'TEST-A',name:'<img src=x onerror=alert(1)>',status:'Qualified',qualified:true},{...base,reference:'TEST-B',purpose:'regulatory'},{...base,reference:'TEST-C',test:true}];
 await page.locator('details').first().locator('summary').click();await page.locator('#paste').fill(JSON.stringify({records:rows}));await page.locator('#import').click();await expect(page.locator('#rows tr')).toHaveCount(3);await expect(page.locator('#metrics')).toContainText('100%');await expect(page.locator('#metrics .metric').first()).toContainText('2');await expect(page.locator('#rows img')).toHaveCount(0);
 await page.locator('#paste').fill('ORGANIYA_RECORD_START\n'+JSON.stringify(rows[0])+'\nORGANIYA_RECORD_END');await page.locator('#import').click();await expect(page.locator('#rows tr')).toHaveCount(3);
 await page.locator('#rows button').first().click();await page.locator('[name=nextAction]').fill('Call to discuss distribution');await page.getByRole('button',{name:'Apply changes'}).click();await expect(page.locator('#rows')).toContainText('Call to discuss distribution');
 const download=page.waitForEvent('download');await page.locator('#save').click();expect((await download).suggestedFilename()).toMatch(/organiya-private-register/);expect(requests).toEqual([]);expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
});

test('operations tool and private records are absent from public build',async({request})=>{for(const route of ['/operations/lead-register.html','/private-operations/empty-register.json','/docs/ENQUIRY-GROWTH-RELEASE.md']){expect((await request.get(route)).status()).toBe(404)}});
