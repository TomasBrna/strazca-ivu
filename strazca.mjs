// Strážca hlášky na https://vzdelavamsa.iedu.sk/
// Otvorí stránku v prehliadači Chrome (stránka sa skladá cez JavaScript),
// prečíta červený banner (.hero-badge) a porovná ho s posledným uloženým stavom.
// Výsledok zapíše do GITHUB_OUTPUT pre ďalšie kroky workflow.

import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';

const URL = 'https://vzdelavamsa.iedu.sk/';
const STAV_SUBOR = 'posledna-hlaska.txt';
const BANNER_CHYBA = '(banner sa na stránke nenašiel)';
const TEST = process.env.TEST === 'true';

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

function vystup(kluc, hodnota) {
  const out = process.env.GITHUB_OUTPUT;
  const riadok = `${kluc}<<__KONIEC__\n${hodnota}\n__KONIEC__\n`;
  if (out) appendFileSync(out, riadok);
  else console.log(`[${kluc}] ${hodnota}`);
}

async function nacitaj() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ locale: 'sk-SK' });
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    try {
      await page.waitForSelector('.hero-badge', { timeout: 45000 });
    } catch {
      // Stránka sa načítala, ale banner chýba – aj to je zmena, o ktorej chceme vedieť.
      const titul = await page.title();
      if (!titul) throw new Error('Stránka sa nenačítala správne (prázdny titulok).');
      return { banner: BANNER_CHYBA, detail: '' };
    }
    const banner = norm(await page.locator('.hero-badge').first().innerText());
    const detail = norm(await page.locator('.hero-notice').first().innerText().catch(() => ''));
    return { banner, detail };
  } finally {
    await browser.close();
  }
}

let vysledok;
for (let pokus = 1; pokus <= 3; pokus++) {
  try {
    vysledok = await nacitaj();
    break;
  } catch (e) {
    console.log(`Pokus ${pokus} zlyhal: ${e.message}`);
    if (pokus < 3) await new Promise((r) => setTimeout(r, 20000));
  }
}

if (!vysledok) {
  // Web je dočasne nedostupný – neposielame poplach, skúsime pri ďalšej kontrole.
  console.log('Web sa nepodarilo načítať, preskakujem túto kontrolu.');
  vystup('zmena', 'false');
  process.exit(0);
}

const predtym = existsSync(STAV_SUBOR) ? norm(readFileSync(STAV_SUBOR, 'utf8')) : '';
const teraz = vysledok.banner;
const maDatum = /\d/.test(teraz);
const zmena = TEST || (predtym !== '' && teraz !== predtym);

console.log(`Predtým: ${predtym}`);
console.log(`Teraz:   ${teraz}`);
console.log(`Zmena:   ${zmena}${TEST ? ' (TEST)' : ''}`);

if (!TEST && teraz !== predtym) writeFileSync(STAV_SUBOR, teraz + '\n');

vystup('zmena', String(zmena));
vystup('ulozit', String(!TEST && teraz !== predtym));
vystup('predtym', predtym);
vystup('teraz', teraz);
vystup('detail', vysledok.detail);
vystup('datum', maDatum ? 'áno' : 'nie');
