const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const url = 'https://www.amazon.in/Noise-ColorFit-Smartwatch-Monitoring-Waterproof/dp/B097R25DP7/?_encoding=UTF8&pd_rd_w=iAwyq&pf_rd_p=ee853eb9-cee5-4961-910b-2f169311a086&pf_rd_r=QNVA56K21QPD1Z1PYHW0&pd_rd_r=571ee227-9048-405e-b691-4149bed2263a&pd_rd_wg=IVhEP&ref_=pd_gw_ci_mcx_mr_hp_atf_m&th=1';
const targetPrice = 2000;
let scraper = async url => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    let title = document.querySelector('#productTitle').innerText;

    let priceStr = document.querySelector('.a-offscreen').innerText;
    let res = priceStr.replace(/₹/g, "");
    res = res.replace(/,/g, "");

    let priceInt = parseInt(res);
    return {

      title,
      priceInt
    };
  });
  browser.close();
  return result;
};




function sendEmail(result) {
  const mailOptions = {
    from: 'daaproject4@gmail.com',
    to: 'gaayushg11@gmail.com',
    subject: `AMAZON PRICE TRACK - ${result.title} - PRICE: ${result.priceInt}`,
    html: `<p>Hey user your selected product is within your specified Target Price. Don't wait a second, hurry!!!!! before it goes out of stock.
    Go and buy it now <a href="${url}">HERE</a></p>`
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'daaproject4@gmail.com',
      pass: '12GSGAGag37@@#'
    }
  });
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log('Email Sent Successfully');
  });

}
function init() {
  scraper(url)
    .then(result => {
      console.log(result)
      let currentPrice = result.priceInt;
      if (currentPrice < targetPrice) {
        sendEmail(result);
      }
    })
    .catch(err => {
      console.log('Fatal Error', err);
    });
}


init();




