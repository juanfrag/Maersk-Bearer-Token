//const puppeteer     = require('puppeteer');
const CREDS         = require('./creds');
const fs            = require('fs').promises;
const ScraperToken  = require('./Models/ScraperToken.js');
const http          = require("http");
const util          = require("util");
const path          = require("path");
"use strict";

async function run() {

	const puppeteer = require("puppeteer-extra");
	const pluginStealth = require("puppeteer-extra-plugin-stealth");
	await puppeteer.use(pluginStealth());
	await puppeteer.use(
		require("puppeteer-extra-plugin-anonymize-ua")({ makeWindows: true })
	)
	await puppeteer.use(require("puppeteer-extra-plugin-stealth")())
	const browser = await puppeteer.launch({
		//executablePath:'google-chrome-stable',
		args: ['--no-sandbox', '--disable-setuid-sandbox',
			   '-disable-gpu', '--disable-infobars'
			  ],
		userDataDir: './data',
		//slowMo: 100,
		headless: false,
		ignoreHTTPSErrors: true,
		timeout: 0
	})

	const page = await browser.newPage();
	await page.goto('https://www.maersk.com/portaluser/login');//, {waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 0});
	await page.setDefaultNavigationTimeout(0); 
	//console.log(await page.content());
	const USERNAME_SELECTOR = '#usernameInput';
	const PASSWORD_SELECTOR = '#passwordInput';

	await page.click(USERNAME_SELECTOR);
	await page.keyboard.type(CREDS.username);

	await page.click(PASSWORD_SELECTOR);
	await page.keyboard.type(CREDS.password);
	//console.log(CREDS.username);
	//console.log(CREDS.password);
	//await page.screenshot({ path: 'screenshots/github.png' });
	console.log('RUN 1');
	//const BUTTON_SELECTOR = '#login-form > fieldset > div:nth-child(4) > button';
	const BUTTON_SELECTOR = '#login-form > div:nth-child(4) > button';
	await page.click(BUTTON_SELECTOR);
	await page.waitForNavigation();
	console.log('RUN 2');
	let bandera = false;
	let bearer_enc2 = '';
	for(var i = 0; i < 2;i++){
		delay(3000);
		let response = await page.goto('https://www.maersk.com/instantPrice/', {waitUntil: 'load'});
		bandera = false;
		page.on('response', response => {
			//console.log('Response Request:', response.request());
			let req = response.request();
			//console.log('Response URl:', req.url());
			delay(2000);
			if (req.url() == 'https://api.maersk.com/tokenValidation?serviceName=product-prices') {
				response.buffer().then(
					b => {
						let headerPage  = '';
						headerPage      = JSON.stringify(req.headers());
						let inicio      = headerPage.indexOf('Bearer');
						let fin         = headerPage.length;
						let bearer_enc  = headerPage.substring(inicio,fin-2);
						//console.log(bearer_enc);
						//extrae(bearer_enc);
						bearer_enc2 = bearer_enc;
						bandera = true;
					},
					e => {
						console.error(`${response.status()} ${response.url()} failed: ${e}`);
					}
				);
			}
		});
		delay(2000);

		console.log('Reintento '+i);
		if(bandera == true){
			i = 2;
		} else {
			//page.reload({waitUntil: 'load'});
		}
	}
	await delay(3000);
	console.log('RUN 3');
	if(bandera != true){
		console.log('FALLA FIN');
	}
	console.log(bearer_enc2);
	extrae(bearer_enc2);
	await page.waitFor(2000);
	await page.goto(`https://www.maersk.com/logoff`);
	await page.close();
	browser.close();
}

async function extrae(data){
	/*http.createServer((request, response) => {
        response.setHeader("Content-Type", "text/plain;charset=utf-8");
        response.end(util.inspect(data));
    }).listen(8000, "::1");*/

	console.log('RUN 4');
	ScraperToken.update({
		token: data,
	}, {
		where: {
			name: 'maersk'
		}
	});
}

function delay(timeout) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}


function dbdata(){
	ScraperToken.findAll({
		attributes:['id','name','token']}).then( tokens => {
		console.log(JSON.parse(JSON.stringify(tokens)));

	}).catch( err => {
		console.log(err);
	})
}

run();
