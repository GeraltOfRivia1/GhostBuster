// ==UserScript==
// @name           GhostBuster
// @author         GeraltOfRivia
// @namespace      Original versions by GTDevsSuck, Jaryl & iispyderii
// @version        6.10
// @description    A GhostBuster utility belt for GhostTrappers FB Game.
// @include        http*://www.ghost-trappers.com/fb/*
// @include        http*://gt-1.diviad.com/fb/*
// @exclude        http*://www.ghost-trappers.com/fb/donate.php*
// @exclude        http*://gt-1.diviad.com/fb/donate.php*
// @exclude        http*://www.ghost-trappers.com/fb/trading*
// @exclude        http*://www.ghost-trappers.com/fb/invite_friend_into_team*
// @exclude        http*://gt-1.diviad.com/fb/trading*
// @exclude        http*://www.ghost-trappers.com/fb/request_badges.php*
// @exclude        http*://gt-1.diviad.com/fb/request_badges.php*
// @icon           https://raw.githubusercontent.com/GeraltOfRivia1/GhostBuster/master/logo.png
// @require        https://raw.githubusercontent.com/GeraltOfRivia1/GhostBuster/master/tesseract.js
// @updateURL      https://github.com/GeraltOfRivia1/GhostBuster/raw/master/GhostBuster.user.js
// @copyright      2016+, Geralt Of Rivia
// @history        6.10 ::: Moved the Script to Github.. 
// @history        6.00 ::: Auto wagering has been implemented, but not tested. it might work.. it might not work.. 
// @history        5.30 ::: Auto Captcha disables itself after 8 times, to protect you from getting banned. It will re-enable itself after 4~6 Hrs and start hunting ;)
// @history        5.20 ::: Displays no. of monsters caught and now has a loot tracker built in to alert you of a loot.
// @history        5.10 ::: Enabled Monster Bullying, this effectively only captures monsters listed and kicks everyone else (you need irrelevance from talent tree).
// @history        5.00 ::: Added a massive feature to enter Captcha automatically, you need to enable AutoCaptcha for this to work & it's safe.
// @history        4.20 ::: Added Ability to go after a particular monster, you NEED to have Irrelevance for this to work. Minor bug fixes 
// @history        4.10 ::: Added Daily Reward Collection, you will need the Reward id for this.
// @history        4.00 ::: Added OPTIONS which you can edit by buttons placed at the bottom of the page.
// @history        4.00 ::: Monster auto-place in live feed option.
// @history        4.00 ::: Captcha auto-submit attempt option.
// @history        4.00 ::: Auto-exit trapdoor option.
// @history        3.00 ::: lost.
// @history        2.10 ::: Added Live Feed support
// @history        2.00 ::: Revamped code, faster hunts, better titles, doesn't run on donate page.
// @history        2.00 ::: Maintenance page refresh. Monster notification. Hunting animation.
// @history        1.40 ::: Fixed FB autohunt
// @history        1.30 ::: Reduced low bait count
// @history        1.22 ::: Fixed white page refresh error
// @history        1.21 ::: Stops when bait is less than 10
// @history        1.12 ::: Pointer to captcha box
// @history        1.10 ::: Included notif when Captcha
// @history        1.01 ::: Excluded livefeed page
// @history        1.00 ::: Edited from FB - Ghost Trappers Smart Autohunt V2 ::: Made Very Easy
// ==/UserScript==


var titlePlaceHolder = "";

if (document.body.innerHTML.match(/currently doing maintenance and will be back in a few minutes/i))
{
    if (document.location.href.match(/live_feed/i))
    {
        titlePlaceHolder = "Maintenance in LF - Refreshing in 20 seconds";
        window.setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/live_feed.php";}, 20000);
    }
    else
    {
        titlePlaceHolder = "Maintenance - Refreshing in 20 seconds";
        window.setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/camp.php";}, 20000);
    }
}
else if (document.getElementsByName("captcha_id")[0])
{
    titlePlaceHolder = "Captcha" ;
    document.getElementsByName('captcha_entered_text')[0].focus();
    
    if (localStorage.autoCaptcha === "true"){
		localStorage.CaptchaCounter = parseInt(localStorage.CaptchaCounter) + 1;
		if (parseInt(localStorage.CaptchaCounter) > 9){
			localStorage.autoCaptcha = false;
		}
        var cp_id = document.getElementsByName('captcha_id')[0].value;
		var url = "http://www.ghost-trappers.com/fb/captcha_image.php?id="+cp_id;
		Tesseract.recognize(url).then(function(result) {
			document.getElementsByName("captcha_entered_text")[0].value = result.text;
			setTimeout(function() {document.getElementsByClassName('fbsubmit')[0].click() ;}, 2000);
		});
    } else {
		var numHrs = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
		localStorage.autoCaptcha = true;
		localStorage.CaptchaCounter = 0;
		setTimeout(function() {document.location = "http://www.ghost-trappers.com/fb/camp.php"}, numHrs*60*60*1000);
    }

}
else if (document.location.href.match(/captcha.php/i))
{
    if (document.body.innerHTML.match(/Please click/i)) {
        
        localStorage.huntsTillCaptcha3 = 75;
        
        if (document.getElementById('topHuntSeconds').innerHTML <= 0 && document.getElementById('topHuntMinutes').innerHTML <= 0)
        {
            titlePlaceHolder = "Hunting Now!";
            window.setTimeout(function() {window.location.href = document.getElementById('topHuntActive').firstElementChild.href;}, 1000);
        }
        else
        {
            titlePlaceHolder = "Returning to Camp";
            window.setTimeout(function() {window.location.href = document.getElementById('campMenu').href;}, 1000);
        }
    }
}
else if ((localStorage.DailyRewards === "true") && (document.body.innerHTML.indexOf("<div class=\"dcReminder\">") != -1))
{
   titlePlaceHolder = "Getting your Daily Reward";
   setTimeout(function() {document.location = "http://www.ghost-trappers.com/fb/dc.php?dc_id=" + localStorage.DailyRewardsID;}, 2000);
}
else if (document.body.innerHTML.indexOf("Congratulations! Your reward has been added to your inventory!") != -1)
{
	localStorage.DailyRewards = false;
	titlePlaceHolder = "Acquired Daily Reward, Disabling Auto Click Daily Rewards!";
	window.setTimeout(function() {window.location.href = document.getElementById('campMenu').href;}, 1000);
}
else if( (localStorage.Wager == "true") && (document.getElementById('wagerContainer') != null) )
{
	var luck = Math.floor(Math.random() * (4 - 1)) + 1;
	window.setTimeout(function() {document.getElementById('croupierButton'+luck)[0].click();}, 2000);
	//setTimeout(function() {document.location = "http://www.ghost-trappers.com/fb/camp.php"}, 2000);
}
else if (document.location.href.match(/live_feed/i))
{
    if (localStorage.autoLiveFeedNew === "true") {
    
    titlePlaceHolder = "✯ Live Feed ✯";
        
    if (document.body.innerHTML.match(/This is causing to much bureaucracy/i) || document.body.innerHTML.match(/You received/i))
    {
        MonsterTimer();
    }
    else
    {
        var link55 = document.getElementById('liveFeedContainer');
        var child = link55.getElementsByTagName('a')[1].href;
        
        if (child.match(/action=assistAll&mons/i))
        {
            titlePlaceHolder = "Killing Monsters! (ง'̀-'́)ง";
            window.setTimeout(function() {window.location.href = child;}, 500);
        }
        else { MonsterTimer(); }
    }
        
    } else { titlePlaceHolder = " ";}
}
else if ( localStorage.autoExitTrapdoor === "true" && (document.location.href.match(/camp.php/i) || document.location.href.match(/hunt.php/i))
         && document.getElementsByClassName("trapdoorInterval")[0].innerHTML !== "")
{
    titlePlaceHolder = "Leaving Trapdoor" ;
    window.setTimeout(function() {document.getElementsByClassName('trapdoorLeaveButton')[0].click();}, 500);
    
    if (localStorage.huntsTillCaptcha3) {localStorage.huntsTillCaptcha3 = Number(localStorage.huntsTillCaptcha3) + 1;}
}
else
{
	var huntLink = document.getElementById('topHuntActive').firstElementChild.href;
    var drinkCount = document.getElementById('profile_whisky_quantity').textContent;
    
    if (drinkCount <= 6)
    {
        titlePlaceHolder = "REFILL! Low Potions";
        setTimeout(function() {alert("Yikes, you are short on bait!");}, 12500);
	}
	else if (huntLink != -1)
	{
        var minutesid, secondsid;

		if (document.getElementById('topHuntSeconds') != null)
		{
			minutesid = document.getElementById('topHuntMinutes').innerHTML;
			secondsid = document.getElementById('topHuntSeconds').innerHTML;
		} 
		else if (document.getElementById('topHuntMinutes') === null)
		{
			minutesid = 0;
			secondsid = 0;
		}
			
		var minutes = parseInt(minutesid, 10);
		var seconds = parseInt(secondsid, 10);
		var timeDelayValue = (minutes * 60 + seconds) * 1000;
        
		if (document.getElementsByClassName('logText')[0])
		{
            var checkMonster = document.getElementsByClassName('logText')[0].innerHTML;
			var LootMatch = new RegExp(localStorage.Lootid, 'i');

			if ((localStorage.TrackLoot == "true") && (checkMonster.match(LootMatch))){
				localStorage.LootChecker = localStorage.Lootid + " FOUND!";
			}
			
		    if (checkMonster.match(/is too strong for you alone/i))
			{
				var monstermatch = new RegExp(localStorage.MonsterName, 'i');
				var LogPage = document.getElementsByClassName('logImage')[0].getElementsByTagName('a')[0].href;
				
				//Check if bullying is turned ON, then if this is not the right monster, kick it
				if(localStorage.BullyMonster == "true" && !(checkMonster.match(monstermatch))) {
					if(localStorage.lastMonsterLog !== document.getElementsByClassName('logText')[0].innerHTML){
						//To avoid detection we go to the monster page and then click release
						//setTimeout(function() {document.location = LogPage;}, 1000));
						setTimeout(function() {localStorage.lastMonsterLog = document.getElementsByClassName('logText')[0].innerHTML; 
												document.location = 'http://www.ghost-trappers.com/fb/ghost_monster.php?action=releaseActiveMonster';}, 
												(Math.floor(Math.random() * (2000 - 500 + 1)) + 400));
					}
				}
				//if we are not bullying monsters or it's the monster we want, post it
				else {
				
					if (localStorage.monsterAlert === "true" && localStorage.lastMonsterLog !== document.getElementsByClassName('logText')[0].innerHTML) {
						setTimeout(function(){	localStorage.lastMonsterLog = document.getElementsByClassName('logText')[0].innerHTML;
												alert("You got a monster, you might want to send it to live feed (or remove it "
													+ "with irrelevance).\n\nGood luck!");}, 500);
					}
					if (localStorage.monsterHunt === "true" && localStorage.lastMonsterLog !== document.getElementsByClassName('logText')[0].innerHTML) {
						setTimeout(function(){	localStorage.lastMonsterLog = document.getElementsByClassName('logText')[0].innerHTML;
												localStorage.Monstercounter = parseInt(localStorage.Monstercounter) + 1;
												document.getElementsByClassName('logPost')[0].getElementsByTagName('a')[0].click()  ;}, 
												(Math.floor(Math.random() * (4000 - 500 + 1)) + 700));
					}
				}
			}
        }

		if (minutes <= 0 && seconds <= 0)
		{
            titlePlaceHolder = "Hunting Now!";
			document.location = huntLink;
		}
		else
		{
			setTimeout(function() {document.location = huntLink;}, timeDelayValue);
		}
	}
	else
	{
		var numMins = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
		titlePlaceHolder = "Something's up, Refreshing in random minutes";
		setTimeout(function() {document.location = 'http://www.ghost-trappers.com/fb/camp.php';}, 
		numMins*60*1000);
    }
}
UpdateTitle();

function UpdateTitle()
{
	if (titlePlaceHolder == "")
    {
        var minutesid, secondsid, mins, secs, r954, r952;
        
		if (document.getElementById('topHuntMinutes') != null)
		{
			minutesid = document.getElementById('topHuntMinutes').innerHTML;
			secondsid = document.getElementById('topHuntSeconds').innerHTML;
		} 
		else if (document.getElementById('topHuntMinutes') === null)
		{
			minutesid = '0';
			secondsid = '0';
		}
		
        mins = parseInt(minutesid, 10);
		secs = parseInt(secondsid, 10);
		
		if (mins < 10)
		{mins = "0" + mins;}
		if (secs < 10)
		{secs = "0" + secs;}
        
        if (mins === "00" && secs === "00")
        {document.title = "Hunting Now!";}
		else
        {document.title = "Hunting in " + mins + ':' + secs;}
        
        if (localStorage.animationSwitch === "true"){
        if (mins === '00' && secondsid % 60 === 29) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 28) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 27) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 26) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 25) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 24) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 23) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 22) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 21) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 20) {document.title = document.title + " " + " (00 , )";}
        else if (mins === '00' && secondsid % 60 === 19) {document.title = document.title + " " + "  :::>";}
        else if (mins === '00' && secondsid % 60 === 18) {document.title = document.title + " " + "  ]:::::>";}
        else if (mins === '00' && secondsid % 60 === 17) {document.title = document.title + " " + "  =[]::::::>";}
        else if (mins === '00' && secondsid % 60 === 16) {document.title = document.title + " " + " o==[]::::";}
        else if (mins === '00' && secondsid % 60 === 15) {document.title = document.title + " " + "  v(' .' )v";}
        else if (mins === '00' && secondsid % 60 === 14) {document.title = document.title + " " + "  v( ‘.’ )v";}
        else if (mins === '00' && secondsid % 60 === 13) {document.title = document.title + " " + "  v( ‘o’ )v";}
        else if (mins === '00' && secondsid % 60 === 12) {document.title = document.title + " " + "  (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 11) {document.title = document.title + " " + "    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 10) {document.title = document.title + " " + "      (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 9) {document.title = document.title + " " + "  ::>    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 8) {document.title = document.title + " " + "  :::>    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 7) {document.title = document.title + " " + "  ::>    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 6) {document.title = document.title + " " + "  ::>  (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 5) {document.title = document.title + " " + "  ::> (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 4) {document.title = document.title + " " + "  ::>(>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 3) {document.title = document.title + " " + "  ( つ﹏╰)";}
        else if (mins === '00' && secondsid % 60 === 2) {document.title = document.title + " " + "  ( つ﹏╰)";}
        else if (mins === '00' && secondsid % 60 === 1) {document.title = document.title + " " + "  ( つ﹏╰) <Take my loot)";}
        }
        
	}
	else
	{
		document.title = titlePlaceHolder;
	}
	setTimeout(UpdateTitle, 1000);
}


function MonsterTimer()
{
    var dor, sbw, koc, switcH, check, check2, check3;
	dor = 6256165461 % 6; sbw = 60000000 % 7; koc = 4577875725 % 915575144;
    switcH = Math.floor((Math.random() * dor*dor*koc) + sbw + koc);
    check = document.getElementById('updateText').title;
    check2 = parseInt(check.replace( /^\D+/g, ''), 10);
    check3 = check2 + switcH;
    
    function InnerMonster() {

        if (check3 > 0)
        {
            check3 = check3 - 1;
            titlePlaceHolder = "Refreshing in " + check3 + " seconds";
            setTimeout(InnerMonster, 1000);
        } else if (check3 <= 0)
        {
            titlePlaceHolder = "Refreshing Livefeed Now!";
            window.setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/live_feed.php";}, 500);
        }
    }
    
    InnerMonster();

}



// ****** Extended Description ******
// 
// Welcome to the new and fun way to play Ghost Trappers!
// 
// This script is simple and easy to use Ghost Trappers auto-hunter and auto-assist LF.
// 
// Works on Chrome, Firefox, Comodo Dragon and Chromium web browsers.
// No configuration needed, just enable the script and you will catch ghosts like never before!!!
// 
// If you care for your fellow ghost trappers, then rate and share this script. Everyone needs to play GT like the top 100+ do. 
// Take care: Only share with people you truly trust and never admit to using it if confronted. Use an anonymous source if needed.
//
// New in version 4:
// Added all the following options where you can enable/disable:
// Attempt to auto submit captcha in 35 minutes (Warning: Risky)
// Automatically assist live feed
// Automatically exit trap door when entering it (no need to buy the rope)
// Automatically release monster to live feed on encounter (when shows on first log)
// OR: Alert when monster encounter (when shows on first log)
// Disable animation
//
// To edit these options simply click the desired option buttons at the bottom of the page.
// 
// New in version 2.10:
// Added Live Feed support - now you can open 1 window for hunting and 1 window for LF assisting.
// Refreshes between 39 and 78 seconds for safety purposes.
// Make sure you disable your older LF script!!!
// 
// New in version 2:
// Monster encounter notifier. When you encounter a monster on the next hunt, you get an alert.
// Renewed code, faster hunts!
// Does not run on "donate" pages.
// Maintenance page refreshes every 20 secs.
// Goes back to camp automatically after captcha input.
// Small change to titles, added animation.
// 
// This Script greatly modified from very popular autohunt script: 
// FB - Ghost Trappers Smart Autohunt V2 [by iispyderii & Jaryl].
// 
// Changes made to the original script:
// Added a Captcha notifier.
// Fixed hover over icon dropdown menus on Chrome and Comodo.
// Changed the title of tabs to more short "Hunting in ..." and "Captcha".
// Does not hunt from Live-feed page so you can use the LF script linked below.
// Refreshes every 20 seconds on maintenance page.
// Autocaptcha disabled (it was not working all the time, so you do not get caught).
// Removed useless/not working content: Monster assist, Daily Clicks, and Menu/Settings details at the top of every page.
// Fixed animation program on Chrome.
// 
// Don't get caught!!! Take precautions:
// Use this script adequately and you should be fine. SO do NOT be hunting 24 hours straight and DO take short "breaks".
// Keep one page open when using this script, many pages will try to hunt many times. [Might lead to excess hunts].
// Do not screenshot showing the tab title. VERY important.
// 
// Good links: 
// Here is a really good script for Live-feed (old way of assisting)
// http://userscripts.org:8080/scripts/show/153781
// This is the best script for Mousehunt hunting: 
// http://userscripts.org:8080/scripts/show/78731
// 
// * Update: 
// Chrome's latest update does not allow scripts to be loaded manually if they are not from the Google App Store, to fix that you will need to install Tampermonkey from the Google App Store. With Tampermonkey enabled, you can click install on this page to install the script.
// 
// Alternatively, you can install scripts the old way in Comodo Dragon, which is another good browser based on Chromium (as is Chrome).
// 
// Keywords: 
// ghost trappers autohunt ghosttrappers auto hunt ghosts ghost trapper trappers auto hunt autohunt autobot auto bot botter smart autohunt simple ah ghost monster livefeed monsters live feed captcha entry automatic hunting ghost trappers auto hunting ghosts javascript script tampermonkey greasemonkey easy
// FOR the tesseract Auto captcha this is what happens
// Also be aware of these @require semantics
// At the time that the user script is installed, Greasemonkey will download and keep a locally cached copy of the remote file that can be read almost instantly. The cached copy is kept in the same folder as your installed user-script. The remote file is not monitored for changes.
// Please be aware that, at the time of writing this answer, this @require tag is only read at install-time. If you edit an existing user script to add this tag, it will be ignored. You need to uninstall and re-install your user script to pick up the change.
// 
// ****** End Extended Description ******


















if(typeof(Storage) !== "undefined") {


// Automatic submit Captcha using an OCR, safe and recommended
// To avoid detection you might have to disable it with a timer(no one hunts 24 hrs a day)
// When disabled you get the alert instead.
// default = false;

if (!localStorage.autoCaptcha) {localStorage.autoCaptcha = false;}

var button01 = document.createElement("button");

function titleButton01() {
var t;
if (localStorage.autoCaptcha == "true") {
    t=document.createTextNode("Auto Captcha is Enabled"); }
else {
    t=document.createTextNode("Auto Captcha is Disabled"); }
button01.innerHTML = "";
button01.appendChild(t);
}
titleButton01();
document.body.appendChild(button01);
button01.onclick=function(){
	localStorage.CaptchaCounter = 0;
    if (localStorage.autoCaptcha == "true") {localStorage.autoCaptcha = false; alert("Auto Captcha Disabled\n\nNotification on Captcha Enabled");titleButton01();}
    else {localStorage.autoCaptcha = true; alert("Auto Captcha Enabled\n\nNotification on Captcha Disabled");titleButton01();}
};




// Automatic Live Feed assist using the new method (assist all button).
// If you prefer using the old script, keep this false.
// default = true;

if (!localStorage.autoLiveFeedNew) {localStorage.autoLiveFeedNew = true;}

var button02 = document.createElement("button");

function titleButton02() {
var t;
if (localStorage.autoLiveFeedNew == "true") {
    t=document.createTextNode("Auto Live Feed is Enabled"); }
else {
    t=document.createTextNode("Auto Live Feed is Disabled"); }
button02.innerHTML = "";
button02.appendChild(t);
}
titleButton02();
document.body.appendChild(button02);
button02.onclick=function(){
    if (localStorage.autoLiveFeedNew == "true") {localStorage.autoLiveFeedNew = false; alert("Auto Live Feed is now Disabled");titleButton02();}
    else {localStorage.autoLiveFeedNew = true; alert("Auto Live Feed is now Enabled");titleButton02();}
};



// Here are two options relating to monsters on camp page.
// If there is a monster in your first log on camp, this will take action.
// So you will get multiple alerts or multiple pop-ups if you love refreshing camp.
// WARNING: you should only have one of them set to true!

// monsterHunt:  automatically put your monster to live feed on encounter
// default = false;
// monsterAlert: alert you when you encounter a monster
// default = true;

if (!localStorage.monsterHunt) {localStorage.monsterHunt = false;}
if (!localStorage.monsterAlert) {localStorage.monsterAlert = true;}

var button03 = document.createElement("button");

function titleButton03() {
var t;
if (localStorage.monsterHunt == "true") {
    t=document.createTextNode("Monster Auto-Hunt is Enabled"); }
else if (localStorage.monsterAlert == "true") {
    t=document.createTextNode("Monster Alert is Enabled"); }
else { t=document.createTextNode("Monster Alert/Auto-Hunt are Disabled"); }
button03.innerHTML = "";
button03.appendChild(t);
}
titleButton03();
document.body.appendChild(button03);
button03.onclick=function(){
    
    var selection = prompt("Type autohunt to enable Monster Auto-Hunt\n\nType alert to enable Monster Alert\n\nType neither to Disable Monster help", "autohunt");
    
    if (selection === "alert") {
        localStorage.monsterHunt = false;
        localStorage.monsterAlert = true;
        alert("Monster Alert is now enabled.\n\nWhen a monster is encountered on first log you will get a notification.");
        titleButton03();}
    else if (selection === "autohunt") {
        localStorage.monsterHunt = true;
        localStorage.monsterAlert = false;
        alert("Automatic Monster Hunt is now Enabled.\n\nWhen a monster is encounterd on first log it will be automatically released to Live feed.\n\nIf you spam" + 
             " the chrono charge button then it won't work.");
        titleButton03();}
    else {
        localStorage.monsterHunt = false;
        localStorage.monsterAlert = false;
        alert("Monster Auto-Hunt and Monster Alert are now Disabled.");
        titleButton03();}
};




// Automatically exit the trap door when fallen in.
// No need to buy Magic Rope :)
// default = false;

if (!localStorage.autoExitTrapdoor) {localStorage.autoExitTrapdoor = false;}

var button04 = document.createElement("button");

function titleButton04() {
var t;
if (localStorage.autoExitTrapdoor == "true") {
    t=document.createTextNode("Auto-Exit Trapdoor is Enabled"); }
else {
    t=document.createTextNode("Auto-Exit Trapdoor is Disabled"); }
button04.innerHTML = "";
button04.appendChild(t);
}
titleButton04();
document.body.appendChild(button04);
button04.onclick=function(){
    if (localStorage.autoExitTrapdoor == "true") {localStorage.autoExitTrapdoor = false; alert("Auto-Exit Trapdoor is now Disabled");titleButton04();}
    else {localStorage.autoExitTrapdoor = true; alert("Auto-Exit Trapdoor is now Enabled\n\nNo need to buy Magic Rope :)");titleButton04();}
};



// Fun animation of you hunting a wandering ghost with a sword (X-Kaliboo) during the last 30 seconds of the hunt.
// On title bar.
// Uses a little extra processing power.
// default = false;

if (!localStorage.animationSwitch) {localStorage.animationSwitch = false;}

var button05 = document.createElement("button");

function titleButton05() {
var t;
if (localStorage.animationSwitch == "true") {
    t=document.createTextNode("Animation is On"); }
else {
    t=document.createTextNode("Animation is Off"); }
button05.innerHTML = "";
button05.appendChild(t);
}
titleButton05();
document.body.appendChild(button05);
button05.onclick=function(){
    if (localStorage.animationSwitch == "true") {localStorage.animationSwitch = false; alert("Animation is now off");titleButton05();}
    else {localStorage.animationSwitch = true; alert("Animation is now on");titleButton05();}
};






// Check Captcha count

var button06 = document.createElement("button");
var t06 = document.createTextNode("Check hunts till Captcha");
button06.appendChild(t06);
document.body.appendChild(button06);
button06.onclick=function(){
    if (localStorage.huntsTillCaptcha3) {
        alert("There are roughly " + localStorage.huntsTillCaptcha3 + " hunts remaining till Captcha (or less) -\n" + ( 75 - localStorage.huntsTillCaptcha3 ) + 
              " hunts since last seen captcha (excluding friend/auto hunts)\n\nCount resets at Captcha\n\nIf you refresh a lot, " +
              "or if you had multiple pages open, or if you disabled the script for a while, or if you spam the power hunts, then this number will be inaccurate.\n\n" + 
              "Note: Automatic trap system hunts and friend-hunts are not counted!"); }
    else {alert("You need to encounter a captcha to start the count");}
};

if (document.location.href.match(/hunt.php/i) && localStorage.huntsTillCaptcha3) {
    localStorage.huntsTillCaptcha3 = Number(localStorage.huntsTillCaptcha3) - 1;
}


// Click Daily Rewards
if (!localStorage.DailyRewards) {localStorage.DailyRewards = false;}
if (!localStorage.DailyRewardsID) {localStorage.DailyRewardsID = '1';}

var button07 = document.createElement("button");

function titleButton07() {
var t07;
if (localStorage.DailyRewards == "true") {
    t07=document.createTextNode("Daily Rewards is On"); }
else {
    t07=document.createTextNode("Daily Rewards is Off"); }
button07.innerHTML = "";
button07.appendChild(t07);
}
titleButton07();
document.body.appendChild(button07);
button07.onclick=function(){
    
    var selection1 = prompt("Type the Daily Reward ID to start collecting Daily reward or Blank to disable", localStorage.DailyRewardsID);
    
    if (selection1 === "" || selection1 === null || selection1 == 0 ){
        localStorage.DailyRewards = false;
        alert("Daily Reward has been Disabled");
        titleButton07();}
    else {
        localStorage.DailyRewards = true;
		localStorage.DailyRewardsID = selection1;
        alert("Daily Reward Click for Reward ID - "+selection1+" has been enabled, it will be disabled when acquired");
        titleButton07();}

};

// Hunt Specific Monster
if (!localStorage.BullyMonster) {localStorage.BullyMonster = false;}
if (!localStorage.MonsterName) {localStorage.MonsterName = '';}

var button08 = document.createElement("button");

function titleButton08() {
var t08;
if (localStorage.BullyMonster == "true") {
    t08=document.createTextNode("Bullying Monsters On for - "+ localStorage.MonsterName); }
else {
    t08=document.createTextNode("Bullying Monsters Off"); }
button08.innerHTML = "";
button08.appendChild(t08);
}
titleButton08();
document.body.appendChild(button08);
button08.onclick=function(){
    
    var selection3 = prompt("Enter the Name for the Monster, All other Monsters will be Removed", localStorage.MonsterName);
    
    if (selection3 === "" || selection3 === null || selection3 == 0 ){
        localStorage.BullyMonster = false;
        alert("Bullying Monster Disabled\n\n"+ 
              "To Disable delete the contents and click okay");
        titleButton08();}
    else {
        localStorage.BullyMonster = true;
		localStorage.monsterHunt = true;
        localStorage.monsterAlert = false;
		localStorage.MonsterName = selection3;
        alert("Bullying - "+selection3+" has been enabled.\n All other Monsters will be auto-removed unless you disable this. \n Monster Hunting is also enabled");
        titleButton08();}

};

// Loot Checker
if (!localStorage.Lootid) {localStorage.Lootid = null;}
if (!localStorage.TrackLoot) {localStorage.TrackLoot = false;}

var button09 = document.createElement("button");

function titleButton09() {
var t09;
if (localStorage.TrackLoot == "true") {
    t09=document.createTextNode("Tracking - "+ localStorage.Lootid); }
else {
    t09=document.createTextNode("Loot Tracking Off"); }
button09.innerHTML = "";
button09.appendChild(t09);
}
titleButton09();
document.body.appendChild(button09);
button09.onclick=function(){
    
    var loot_to_find = prompt("Enter the Name of the loot we are tracking", localStorage.Lootid);
    
    if (loot_to_find === "" || loot_to_find === null || loot_to_find == 0 ){
        localStorage.TrackLoot = false;
		localStorage.LootChecker = "Not Found";
        alert("Loot Tracking Off");
        titleButton09();}
    else {
        localStorage.TrackLoot = true;
		localStorage.Lootid = loot_to_find;
        alert("Tracking - "+loot_to_find);
        titleButton09();}

};

//Reset Monster Counter
var button10 = document.createElement("button");

function titleButton10() {
var t10;
t10=document.createTextNode("Reset Monster Counter");
button10.innerHTML = "";
button10.appendChild(t10);
}
titleButton10();
document.body.appendChild(button10);
button10.onclick=function(){
    alert("Reset Monster Counter to 0");
	localStorage.Monstercounter = 0;
    titleButton10();
};

// Enable Wagering
if (!localStorage.Wager) {localStorage.Wager = false;}

var button11 = document.createElement("button");

function titleButton11() {
var t11;
if (localStorage.Wager == "true") {
    t11=document.createTextNode("Wagering ON"); }
else {
    t11=document.createTextNode("Wagering OFF"); }
button11.innerHTML = "";
button11.appendChild(t11);
}

titleButton11();
document.body.appendChild(button11);

button11.onclick=function(){
    if (localStorage.Wager == "true") {
		localStorage.Wager = false; 
		alert("Auto Wagering OFF");
		titleButton11();
		}
    else {
		localStorage.Wager = true;
		alert("Auto Wagering ON, Be Careful you will loose Nessy");
		titleButton11();
		}
};

if (!localStorage.Monstercounter) {localStorage.Monstercounter = 0;}
if (!localStorage.LootChecker) {localStorage.LootChecker = "Not Found";}
if (!localStorage.CaptchaCounter) {localStorage.CaptchaCounter = 0;}

var node0= document.createElement("P");

var textnode0 = document.createTextNode("Monster Count - " + localStorage.Monstercounter);
node0.appendChild(textnode0);

var linebreak = document.createElement('br');
node0.appendChild(linebreak);

var textnode0 = document.createTextNode("Loot Found ? - " + localStorage.LootChecker);
node0.appendChild(textnode0);

var linebreak = document.createElement('br');
node0.appendChild(linebreak);

var textnode0 = document.createTextNode("Auto Captcha count- " + localStorage.CaptchaCounter);
node0.appendChild(textnode0);

document.getElementsByClassName("userGroupContainer")[0].appendChild(node0);

// Styling
node0.style.color = "white";
node0.style.fontSize = "14px";
node0.style.fontFamily = "Arial";
node0.style.paddingTop = "3px";
node0.style.paddingBottom = "8px";
node0.style.margin = "0px";

} else {
    
    var aRandomDIV = document.createElement("DIV");
    aRandomDIV.innerHTML = "<br><p style='color:white;font-size:12px;'>Your browser " +
        "does not support Web Storage. Script functions will not work properly or in a complete manner.</p>";
    document.body.appendChild(aRandomDIV);
    
}
