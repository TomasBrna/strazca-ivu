# Strážca hlášky IVU

Každých 5 minút otvorí https://vzdelavamsa.iedu.sk/ a skontroluje červený banner
„Druhá fáza podpory vzdelávania – už čoskoro“. Keď sa text zmení (napr. na dátum),
vytvorí v tomto repozitári **issue** a GitHub o ňom hneď pošle e-mail.

Každé ráno o 8:00 (slovenského času) pridá komentár do issue „📅 Denný prehľad strážcu IVU“
s aktuálnym znením hlášky – aj o tom príde e-mail. Toto issue nechaj otvorené.

## Súbory
- `strazca.mjs` – skript, ktorý otvorí stránku v Chrome a prečíta banner
- `posledna-hlaska.txt` – posledný známy text banneru (mení sa automaticky)
- `.github/workflows/strazca.yml` – plán spúšťania a odoslanie upozornenia

## Nastavenie (raz)
1. Repozitár musí byť **Public** (verejný). Vtedy je GitHub Actions bez limitu minút.
   Nie je v ňom nič citlivé.
2. **Actions** → ak sa zobrazí výzva, povoľ workflowy.
3. Upozornenia na mail: vpravo hore ikona → **Settings → Notifications**
   - Default notifications email: tvoj mail
   - **Watching** aj **Participating, @mentions**: zaškrtnutý **Email**
4. V repozitári hore **Watch** → nastavené na **All Activity**.

## Test
**Actions → Strážca hlášky IVU → Run workflow** → zaškrtni *Testovací poplach* → **Run workflow**.
Do 1–2 minút by ti mal prísť mail „🧪 TEST strážcu IVU – upozornenia fungujú“.
Testovacie issue potom môžeš zavrieť (**Close issue**).

Denný prehľad na skúšku: **Run workflow** → zaškrtni *Poslať denný prehľad hneď*.

## Vypnutie
**Actions → Strážca hlášky IVU → ⋯ → Disable workflow**.
