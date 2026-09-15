const puppeteer = require('puppeteer');
(async () => {
  console.log("Starting browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('error', err => console.log('Page error:', err));
  page.on('pageerror', err => console.log('PageError:', err));
  page.on('console', msg => console.log('Console:', msg.text()));
  
  try {
    console.log("Navigating...");
    await page.goto('https://www.smpn29makassar.com/layanan-ptsp', { waitUntil: 'networkidle0' });
    console.log("Page loaded successfully.");
    const content = await page.content();
    console.log("Content length:", content.length);
    if (content.includes("This page couldn't load")) {
        console.log("FOUND CHUNKLOAD ERROR TEXT!");
    } else {
        console.log("Did not find error text.");
    }
  } catch (e) {
    console.error("Failed to load:", e);
  }
  await browser.close();
})();
