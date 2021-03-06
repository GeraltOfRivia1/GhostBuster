// ==UserScript==
// @name           GhostBuster
// @author         GeraltOfRivia
// @namespace      Original versions by GTDevsSuck, Jaryl & iispyderii
// @version        9.03
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
// @grant          GM_xmlhttpRequest
// @copyright      2018+, Geralt Of Rivia
// @history        9.03 ::: Made a boo-boo so fixed a boo-boo
// @history        9.02 ::: Script stops after Auto Boost, Now refreshes the page
// @history        9.01 ::: Auto Boost Request broke the script if it runs anywhere other than camp. fixed it now.
// @history        9.00 ::: Auto Boost Request when available.
// @history        8.24 ::: When a loot drops, sending the caught text to the pastebin.
// @history        8.23 ::: Auto Video Watcher Functioning changed. the web-page doesn't count seconds correctly. added a buffer.
// @history        8.22 ::: Switch to default bait when out of bait.
// @history        8.21 ::: Minor Bug Fix for Maintennance mode.
// @history        8.20 ::: Now you can Remotely control how the script runs.. Massive scale update
// @history        8.10 ::: Implemented Auto Plasma Load, when the cauldron runs out of plasma.. it should be loaded automagically
// @history        8.00 ::: Massive update, if you have a pastebin account, you can use it to track the loot drop you are aiming for.
// @history        7.32 ::: Fixed syntax issues
// @history        7.31 ::: Fixed syntax issues and changed rand to 1-6
// @history        7.30 ::: Minor fixes for wager, Auto Captcha, Added ability to wager with selective ghosts ;). Baseline for a BIG future improvement.
// @history        7.20 ::: Added Ability for the Captcha to sleep and wake up to avoid detection, it will also log time for us to track sleep time, cleaned log window
// @history        7.10 ::: Auto-Wagering Fix and added debug messages to monitor if it works. next is to log the rewards
// @history        7.00 ::: Hunt time is now randomized by adding 2-8 secs randomly, added a log to check if autocapthca restarted after waiting for a bit ( to avoid detection)
// @history        6.19 ::: Minor Fixes for Wagering and Log
// @history        6.18 ::: Minor Fixes for Wagering and Log
// @history        6.17 ::: Release monster now uses Randid to avoid detection
// @history        6.16 ::: Minor fixes for Auto-Wagering.
// @history        6.15 ::: Attempt at Fixing Auto-Wagering. Lets see if this works atleast.
// @history        6.14 ::: Forgot to Undo 6.11 Changes.
// @history        6.13 ::: Now Auto watches daily videos, But you need to open the Videos page in a Separate Tab( no buttons now)
// @history        6.11 ::: Updated Exclude to include videos page.. LOL?
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
var boost_need = document.getElementsByClassName("trapWallpostContainer");

//Remotely Change the Script parameters ;) Very Very Handy soon !!
if (!document.body.innerHTML.match(/currently doing maintenance and will be back in a few minutes/i))
{
	if ((localStorage.BinPaster === "true") && (document.getElementsByClassName("cauldronClickElement")[0].style.cssText.match(/cauldron_cauldron/i)))
	{
		GM_xmlhttpRequest({
				  method: "POST",
				  url: "https://pastebin.com/api/api_login.php",
				  data: "api_dev_key="+localStorage.DevApi+"&api_user_name="+localStorage.Username+"&api_user_password="+localStorage.Password,
				  synchronous: true,
				  headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				  },
				  onload: function(response) {
				  loginkey = response.response;

						if (!loginkey.match(/BAD/i)){
							GM_xmlhttpRequest({
									  method: "POST",
									  url: "https://pastebin.com/api/api_raw.php",
									  data: "api_option=show_paste&api_user_key="+loginkey+"&api_dev_key="+localStorage.DevApi+"&api_paste_key=XaW4P8Uq",
									  synchronous: true,
									  headers: {
										"Content-Type": "application/x-www-form-urlencoded",
									  },
									  onload: function(response) {
										if (!loginkey.match(/BAD/i)){
											console.log("data -\n" + response.response);
											var obj =  JSON.parse(response.response);

											 if(obj.autoCaptcha != 'A') localStorage.autoCaptcha = obj.autoCaptcha;
											 if(obj.autoLiveFeedNew != 'A') localStorage.autoLiveFeedNew = obj.autoLiveFeedNew;
											 if(obj.monsterHunt != 'A') localStorage.monsterHunt = obj.monsterHunt;
											 if(obj.monsterAlert != 'A') localStorage.monsterAlert = obj.monsterAlert;
											 if(obj.autoExitTrapdoor != 'A') localStorage.autoExitTrapdoor = obj.autoExitTrapdoor;
											 if(obj.animationSwitch != 'A') localStorage.animationSwitch = obj.animationSwitch;
											 if(obj.DailyRewards != 'A') localStorage.DailyRewards = obj.DailyRewards;
											 if(obj.DailyRewardsID != 'A') localStorage.DailyRewardsID = obj.DailyRewardsID;
											 if(obj.BullyMonster != 'A') localStorage.BullyMonster = obj.BullyMonster;
											 if(obj.MonsterName != 'A') localStorage.MonsterName = obj.MonsterName;
											 if(obj.Lootid != 'A') localStorage.Lootid = obj.Lootid;
											 if(obj.TrackLoot != 'A') localStorage.TrackLoot = obj.TrackLoot;
											 if(obj.Wager != 'A') localStorage.Wager = obj.Wager;
											 if(obj.WagerSelection != 'A') localStorage.WagerSelection = obj.WagerSelection;
											 if(obj.WagerFilter != 'A') localStorage.WagerFilter = obj.WagerFilter;
											 if(obj.AutoPlasma != 'A') localStorage.AutoPlasma = obj.AutoPlasma;
											 if(obj.AutoBoost != 'A') localStorage.AutoBoost = obj.AutoBoost;

											window.setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/setup.php?type=cauldron&arm=9";}, 1000); //Blood
										}
										else
											window.setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/setup.php?type=cauldron&arm=16";}, 1000); //Glorious
									  }
									});
						}
						else
							window.setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/setup.php?type=cauldron&arm=4";}, 1000); //Jura Atom
					  }
				});
	}
}


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
		/*
		if (parseInt(localStorage.CaptchaCounter) > 9){
			localStorage.autoCaptcha = false;
		}*/
		var dateObj = new Date();
		var hrs = dateObj.getHours();

		if (hrs >= 23 || hrs <= 4) {
			localStorage.autoCaptcha = false;
            pasteToBin("Log Update : Sleeping Now","Script Slept at - "+(new Date().toLocaleString()));
			setTimeout(function(){ localStorage.SleepTime = dateObj.toLocaleString();
			location.reload(); }, 1000);
		}


        var cp_id = document.getElementsByName('captcha_id')[0].value;
		var url = "http://www.ghost-trappers.com/fb/captcha_image.php?id="+cp_id;
		Tesseract.recognize(url).then(function(result) {
			document.getElementsByName("captcha_entered_text")[0].value = result.text.replace(/[^A-Za-z]/gi, '');
			setTimeout(function() {document.getElementsByClassName('fbsubmit')[0].click() ;}, 2000);
		});
    } else {
		var numHrs = getRandomInt(5,6);
		localStorage.autoCaptcha = true;
		localStorage.CaptchaCounter = 0;
		localStorage.AutoRunCount = parseInt(localStorage.AutoRunCount) + 1;
		//setTimeout(function() {document.location = "http://www.ghost-trappers.com/fb/camp.php"}, numHrs*60*60*1000);
        pasteToBin("Log Update : Waking up Now","Script waking up at - "+(new Date().toLocaleString()));
		setTimeout(function() {
			localStorage.WakeTime = new Date().toLocaleString();
			document.location = "http://www.ghost-trappers.com/fb/camp.php";}, numHrs*60*60*1000);
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
   setTimeout(function() {document.location = "http://www.ghost-trappers.com/fb/dc.php?dc_id=" + localStorage.DailyRewardsID;}, 2000);
}
else if((localStorage.AutoPlasma === "true") && (document.getElementsByClassName("cauldronRightContainer")[0].getElementsByTagName('a')[0].title.match(/Your cauldron needs/i)))
{
	window.setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/setup.php?type=cauldron&activate=1#cauldronRefillText";}, 1000);
}
else if ((localStorage.AutoBoost === "true") && (boost_need.length > 0) && (boost_need[0].getElementsByClassName("boostLink ")[0].title.match(/Request help to boost your/i)))
{
	setTimeout(function() {document.getElementsByClassName("trapWallpostContainer")[0].getElementsByClassName("boostLink ")[0].click();}, 1000);
	setTimeout(function() {document.getElementsByClassName("trapWallpostContainer")[0].getElementsByClassName("boostLink ")[1].click();}, 2000);
	setTimeout(function() {document.location = "http://www.ghost-trappers.com/fb/camp.php";}, 5000);
}
else if (document.body.innerHTML.indexOf("Congratulations! Your reward has been added to your inventory!") != -1)
{
	localStorage.DailyRewards = false;
	titlePlaceHolder = "Acquired Daily Reward, Disabling Auto Click Daily Rewards!";
	window.setTimeout(function() {window.location.href = document.getElementById('campMenu').href;}, 1000);
}
else if( (localStorage.Wager === "true") && (document.getElementById('wagerContainer') !== null) && (localStorage.WagerLog === "false") )
{
	var checkWager = document.getElementsByClassName('logText')[0].innerHTML;
	var Wagermatch = new RegExp(localStorage.WagerFilter, 'i');
	localStorage.WagerLog = true;

	if(localStorage.WagerSelection === "true" && !(checkWager.match(Wagermatch))) {
		setTimeout(function() {
			console.log("Close Croupier Button "+new Date().toLocaleString());
		document.getElementById('closeCroupierButton').click();}, 2000);
	}
	else {
		var luck = getRandomInt(1,3);
		localStorage.WagerCounter = parseInt(localStorage.WagerCounter) + 1;

		setTimeout(function() {
			console.log("Croupier Button "+luck+" "+new Date().toLocaleString());
		document.getElementById('croupierButton'+luck).click();}, 2000);
	}

	setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/camp.php";}, 4000);
}
else if (document.location.href.match(/bonus_videos/i))
{
if(document.getElementById('videoMessage').textContent.match(/Earn one chrono/i))
	{
		var vid_mins = getRandomInt(1,5);
		window.setTimeout(function() {document.getElementById('nextVideoButton').click();}, vid_mins*1000);
		setTimeout(function(){ location.reload(); }, (25000 + vid_mins*1500));
	}
else
	{
		alert("Feeling Cheeky are we ? Try again tomorrow");
	}
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
else if ( localStorage.autoExitTrapdoor === "true" && (document.location.href.match(/camp.php/i) || document.location.href.match(/hunt.php/i)) && document.getElementsByClassName("trapdoorInterval")[0].innerHTML !== "")
{
    titlePlaceHolder = "Leaving Trapdoor" ;
    window.setTimeout(function() {document.getElementsByClassName('trapdoorLeaveButton')[0].click();}, 500);

    if (localStorage.huntsTillCaptcha3) {localStorage.huntsTillCaptcha3 = Number(localStorage.huntsTillCaptcha3) + 1;}
}
else
{
	var huntLink = document.getElementById('topHuntActive').firstElementChild.href;
    var drinkCount = document.getElementById('profile_whisky_quantity').textContent;
	localStorage.WagerLog = false;

    if (drinkCount <= 6)
    {
        titlePlaceHolder = "REFILL! Low Potions";
        //setTimeout(function() {alert("Yikes, you are short on bait!");}, 12500);
	pasteToBin("Log Update : Out of Bait","Out of Bait Changing to Default Bait (Devil Driver) - ");
	setTimeout(function() {window.location.href = "http://www.ghost-trappers.com/fb/setup.php?type=whisky&arm=25";}, 3000);
	}
	else if (huntLink != -1)
	{
        var minutesid, secondsid;

		if (document.getElementById('topHuntSeconds') !== null)
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
		var buf_sec = getRandomInt(1,6);
		seconds += parseInt(buf_sec);
		var timeDelayValue = (minutes * 60 + seconds) * 1000;

		if (document.getElementsByClassName('logText')[0])
		{
            var checkMonster = document.getElementsByClassName('logText')[0].innerHTML;
			var LootMatch = new RegExp(localStorage.Lootid, 'i');

			if ((localStorage.TrackLoot === "true") && (checkMonster.match(LootMatch))){
                pasteToBin("Log Update : Found Loot",checkMonster);
				localStorage.LootChecker = localStorage.Lootid + " Found - " + new Date().toLocaleString();
			}
			
		    if (checkMonster.match(/is too strong for you alone/i))
			{
				var monstermatch = new RegExp(localStorage.MonsterName, 'i');
				var LogPage = document.getElementsByClassName('logImage')[0].getElementsByTagName('a')[0].href;
				
				//Check if bullying is turned ON, then if this is not the right monster, kick it
				if(localStorage.BullyMonster === "true" && !(checkMonster.match(monstermatch))) {
					if(localStorage.lastMonsterLog !== document.getElementsByClassName('logText')[0].innerHTML){
						//To avoid detection we get the rand id and then click release
						setTimeout(function() {localStorage.lastMonsterLog = document.getElementsByClassName('logText')[0].innerHTML; 
												document.location = 'http://www.ghost-trappers.com/fb/ghost_monster.php?action=releaseActiveMonster';}, 
												getRandomInt(1000, 3000));
					}
				}
				//if we are not bullying monsters or it's the monster we want, post it
				else {
				
					if (localStorage.monsterAlert === "true" && localStorage.lastMonsterLog !== document.getElementsByClassName('logText')[0].innerHTML) {
						setTimeout(function(){	localStorage.lastMonsterLog = document.getElementsByClassName('logText')[0].innerHTML;
												alert("You got a monster, you might want to send it to live feed (or remove it " + "with irrelevance).\n\nGood luck!");}, 500);
					}
					if (localStorage.monsterHunt === "true" && localStorage.lastMonsterLog !== document.getElementsByClassName('logText')[0].innerHTML) {
						setTimeout(function(){	localStorage.lastMonsterLog = document.getElementsByClassName('logText')[0].innerHTML;
												localStorage.Monstercounter = parseInt(localStorage.Monstercounter) + 1;
												document.getElementsByClassName('logPost')[0].getElementsByTagName('a')[0].click()  ;}, 
												getRandomInt(1000, 3000));
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
		var numMins = getRandomInt(4,8);
		titlePlaceHolder = "Something's up, Refreshing in random minutes";
		setTimeout(function() {document.location = 'http://www.ghost-trappers.com/fb/camp.php';}, 
		numMins*60*1000);
    }
}
UpdateTitle(buf_sec);

function UpdateTitle(buff)
{
	if (titlePlaceHolder === "")
    {
        var minutesid, secondsid, mins, secs;
        
		if (document.getElementById('topHuntMinutes') !== null)
		{
			minutesid = document.getElementById('topHuntMinutes').innerHTML;
			secondsid = document.getElementById('topHuntSeconds').innerHTML;
		} 
		else if (document.getElementById('topHuntMinutes') === null)
		{
			minutesid = '0';
			secondsid = '0';
		}
		
		if (minutesid === "00" && secondsid === "00")
		{
			buff =  parseInt(buff) - 1;
		}
		
        mins = parseInt(minutesid, 10);
		secs = parseInt(secondsid, 10) + parseInt(buff);
		
		if (mins < 10)
		{mins = "0" + mins;}
		if (secs < 10)
		{secs = "0" + secs;}
        
        if (mins === "00" && secs === "00")
        {document.title = "Hunting Now!";}
		else
        {document.title = "Hunting in " + mins + ':' + secs;}
        
        if (localStorage.animationSwitch === "true"){
        if (mins === '00' && secondsid % 60 === 29) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 28) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 27) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 26) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 25) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 24) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 23) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 22) {document.title = document.title + " " + "   (, 00)";}
        else if (mins === '00' && secondsid % 60 === 21) {document.title = document.title + " " + " (, 00)";}
        else if (mins === '00' && secondsid % 60 === 20) {document.title = document.title + " " + " (00 , )";}
        else if (mins === '00' && secondsid % 60 === 19) {document.title = document.title + " " + "  :::>";}
        else if (mins === '00' && secondsid % 60 === 18) {document.title = document.title + " " + "  ]:::::>";}
        else if (mins === '00' && secondsid % 60 === 17) {document.title = document.title + " " + "  =[]::::::>";}
        else if (mins === '00' && secondsid % 60 === 16) {document.title = document.title + " " + " o==[]::::";}
        else if (mins === '00' && secondsid % 60 === 15) {document.title = document.title + " " + "  v(' .' )v";}
        else if (mins === '00' && secondsid % 60 === 14) {document.title = document.title + " " + "  v( ‘.’ )v";}
        else if (mins === '00' && secondsid % 60 === 13) {document.title = document.title + " " + "  v( ‘o’ )v";}
        else if (mins === '00' && secondsid % 60 === 12) {document.title = document.title + " " + "  (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 11) {document.title = document.title + " " + "    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 10) {document.title = document.title + " " + "      (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 9) {document.title = document.title + " " + "  ::>    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 8) {document.title = document.title + " " + "  :::>    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 7) {document.title = document.title + " " + "  ::>    (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 6) {document.title = document.title + " " + "  ::>  (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 5) {document.title = document.title + " " + "  ::> (>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 4) {document.title = document.title + " " + "  ::>(>‘o’)>";}
        else if (mins === '00' && secondsid % 60 === 3) {document.title = document.title + " " + "  ( つ﹏╰)";}
        else if (mins === '00' && secondsid % 60 === 2) {document.title = document.title + " " + "  ( つ﹏╰)";}
        else if (mins === '00' && secondsid % 60 === 1) {document.title = document.title + " " + "  ( つ﹏╰) <Take my loot)";}
        }

	}
	else
	{
		document.title = titlePlaceHolder;
	}
setTimeout(function(){UpdateTitle(buff);}, 1000);
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

function getRandomInt(min, max) {
	max++;
	return Math.floor(Math.random() * (max - min)) + min;
}

function pasteToBin(title, message){
	GM_xmlhttpRequest({
		  method: "POST",
		  url: "https://pastebin.com/api/api_login.php",
		  data: "api_dev_key="+localStorage.DevApi+"&api_user_name="+localStorage.Username+"&api_user_password="+localStorage.Password,
		  headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		  },
		  onload: function(response) {
			loginkey = response.response;
			if (!loginkey.match(/BAD/i)){
				GM_xmlhttpRequest({
						  method: "POST",
						  url: "https://pastebin.com/api/api_post.php",
						  data: "api_option=paste&api_user_key="+loginkey+"&api_paste_private=2&api_paste_name="+title+"&api_paste_expire_date=1W&api_dev_key="+localStorage.DevApi+"&api_paste_code="+message+" - "+new Date().toLocaleString(),
						  headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						  },
						  onload: function(response) {
							//console.log(JSON.stringify(response));
							console.log("url -" + response.response);
						  }
						});

				}
			}
	});
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
//
// Pastebin Api - https://pastebin.com/api
// Create a Pastebin.com login to get the Pastebin Api key, username and password. Once done, you can configure the script to create a paste so you know if
// the loot you are hunting for dropped. this way you can watch a movie and chill out at a bar and the script keeps running, you can change the setup remotely once the loot has been dropped.
//
// ****** End Extended Description ******


















if(typeof(Storage) !== "undefined") {


// Automatic submit Captcha using an OCR, safe and recommended
// When disabled you get the alert instead.
// default = false;

if (!localStorage.autoCaptcha) {localStorage.autoCaptcha = false;}

var button01 = document.createElement("button");

function titleButton01() {
var t;
if (localStorage.autoCaptcha === "true") {
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
	localStorage.AutoRunCount = 0;
	localStorage.SleepTime = "";
	localStorage.WakeTime = "";
    if (localStorage.autoCaptcha === "true") {localStorage.autoCaptcha = false; alert("Auto Captcha Disabled\n\nNotification on Captcha Enabled");titleButton01();}
    else {localStorage.autoCaptcha = true; alert("Auto Captcha Enabled\n\nNotification on Captcha Disabled");titleButton01();}
};




// Automatic Live Feed assist using the new method (assist all button).
// If you prefer using the old script, keep this false.
// default = true;

if (!localStorage.autoLiveFeedNew) {localStorage.autoLiveFeedNew = true;}

var button02 = document.createElement("button");

function titleButton02() {
var t;
if (localStorage.autoLiveFeedNew === "true") {
    t=document.createTextNode("Auto Live Feed is Enabled"); }
else {
    t=document.createTextNode("Auto Live Feed is Disabled"); }
button02.innerHTML = "";
button02.appendChild(t);
}
titleButton02();
document.body.appendChild(button02);
button02.onclick=function(){
    if (localStorage.autoLiveFeedNew === "true") {localStorage.autoLiveFeedNew = false; alert("Auto Live Feed is now Disabled");titleButton02();}
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
if (localStorage.monsterHunt === "true") {
    t=document.createTextNode("Monster Auto-Hunt is Enabled"); }
else if (localStorage.monsterAlert === "true") {
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
if (localStorage.autoExitTrapdoor === "true") {
    t=document.createTextNode("Auto-Exit Trapdoor is Enabled"); }
else {
    t=document.createTextNode("Auto-Exit Trapdoor is Disabled"); }
button04.innerHTML = "";
button04.appendChild(t);
}
titleButton04();
document.body.appendChild(button04);
button04.onclick=function(){
    if (localStorage.autoExitTrapdoor === "true") {localStorage.autoExitTrapdoor = false; alert("Auto-Exit Trapdoor is now Disabled");titleButton04();}
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
if (localStorage.animationSwitch === "true") {
    t=document.createTextNode("Animation is On"); }
else {
    t=document.createTextNode("Animation is Off"); }
button05.innerHTML = "";
button05.appendChild(t);
}
titleButton05();
document.body.appendChild(button05);
button05.onclick=function(){
    if (localStorage.animationSwitch === "true") {localStorage.animationSwitch = false; alert("Animation is now off");titleButton05();}
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
if (localStorage.DailyRewards === "true") {
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

    if (selection1 === "" || selection1 === null || selection1 === 0 ){
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
if (localStorage.BullyMonster === "true") {
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

    if (selection3 === "" || selection3 === null || selection3 === 0 ){
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
if (localStorage.TrackLoot === "true") {
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

    if (loot_to_find === "" || loot_to_find === null || loot_to_find === 0 ){
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
if (!localStorage.WagerSelection) {localStorage.WagerSelection = false;}
if (!localStorage.WagerFilter) {localStorage.WagerFilter = "";}
if (!localStorage.WagerLog) {localStorage.WagerLog = false;}

var button11 = document.createElement("button");

function titleButton11() {
var t11;
if (localStorage.Wager === "true") {
    t11=document.createTextNode("Wagering ON"); }
else {
    t11=document.createTextNode("Wagering OFF"); }
button11.innerHTML = "";
button11.appendChild(t11);
}

titleButton11();
document.body.appendChild(button11);

button11.onclick=function(){
    if (localStorage.Wager === "true") {
		localStorage.Wager = false;
		alert("Auto Wagering OFF");
		titleButton11();
		}
    else {

		var skip_ghost = prompt("Enter the wagering filter (partial name|partial name)", localStorage.WagerFilter);

		if (skip_ghost === "" || skip_ghost === null || skip_ghost === 0 ){
			localStorage.WagerSelection = false;
			localStorage.WagerFilter = "";
		}
		else {
			localStorage.WagerSelection = true;
			localStorage.WagerFilter = skip_ghost;
		}

		localStorage.Wager = true;
		localStorage.WagerCounter = 0;
		alert("Auto Wagering ON, Be Careful you will loose Nessy");
		titleButton11();
		}
};

// Enable Paste to Bin
if (!localStorage.BinPaster) {localStorage.BinPaster = false;}
if (!localStorage.DevApi) {localStorage.DevApi = "";}
if (!localStorage.Username) {localStorage.Username = "";}
if (!localStorage.Password) {localStorage.Password = "";}

var button12 = document.createElement("button");

function titleButton12() {
var t12;
if (localStorage.BinPaster === "true") {
    t12=document.createTextNode("PasteBin Config ON"); }
else {
    t12=document.createTextNode("PasteBin Config OFF"); }
button12.innerHTML = "";
button12.appendChild(t12);
}

titleButton12();
document.body.appendChild(button12);

button12.onclick=function(){
    if (localStorage.BinPaster === "true") {
		localStorage.BinPaster = false;
		alert("Turning OFF Pastebin Config");
		titleButton12();
		}
    else {

		var BinData = prompt("Enter PasteBin Devapi", localStorage.DevApi);

		if (BinData === "" || BinData === null || BinData === 0 ){
			localStorage.BinPaster = false;
			localStorage.DevApi = "";
			return;
		}
		else
			localStorage.DevApi = BinData;

		BinData = prompt("Enter PasteBin Username", localStorage.Username);

		if (BinData === "" || BinData === null || BinData === 0 ){
			localStorage.BinPaster = false;
			localStorage.Username = "";
			return;
		}
		else
			localStorage.Username = BinData;

		BinData = prompt("Enter PasteBin Password", localStorage.Password);

		if (BinData === "" || BinData === null || BinData === 0 ){
			localStorage.BinPaster = false;
			localStorage.Password = "";
			return;
		}
		else
			localStorage.Password = BinData;

		localStorage.BinPaster = true;

		alert("Posting to Pastebin ON");
		titleButton12();
		}
};


// Auto Load Ghost Plasma to Cauldron.
if (!localStorage.AutoPlasma) {localStorage.AutoPlasma = false;}

var button13 = document.createElement("button");

function titleButton13() {
var t13;
if (localStorage.AutoPlasma === "true") {
    t13=document.createTextNode("Auto Plasma is On"); }
else {
    t13=document.createTextNode("Auto Plasma is Off"); }
button13.innerHTML = "";
button13.appendChild(t13);
}
titleButton13();
document.body.appendChild(button13);
button13.onclick=function(){
    if (localStorage.AutoPlasma === "true") {
		localStorage.AutoPlasma = false; 
		alert("Auto Plasma is now off");
	}
    else {
		localStorage.AutoPlasma = true; 
		alert("Auto Plasma is now on");
	}
	titleButton13();
};

// Auto Boost
if (!localStorage.AutoBoost) {localStorage.AutoBoost = false;}

var button14 = document.createElement("button");

function titleButton14() {
var t14;
if (localStorage.AutoBoost === "true") {
    t14=document.createTextNode("Auto Boost is On"); }
else {
    t14=document.createTextNode("Auto Boost is Off"); }
button14.innerHTML = "";
button14.appendChild(t14);
}
titleButton14();
document.body.appendChild(button14);
button14.onclick=function(){
    if (localStorage.AutoBoost === "true") {
		localStorage.AutoBoost = false; 
		alert("Auto Boost is now off");
	}
    else {
		localStorage.AutoBoost = true; 
		alert("Auto Boost is now on");
	}
	titleButton14();
};


if (!localStorage.LootChecker) {localStorage.LootChecker = "Not Found";}
if (!localStorage.Monstercounter) {localStorage.Monstercounter = 0;}
if (!localStorage.WagerCounter) {localStorage.WagerCounter = 0;}
if (!localStorage.CaptchaCounter) {localStorage.CaptchaCounter = 0;}
if (!localStorage.AutoRunCount) {localStorage.AutoRunCount = 0;}
if (!localStorage.SleepTime) {localStorage.SleepTime = "";}
if (!localStorage.WakeTime) {localStorage.WakeTime = "";}

var node0= document.createElement("P");
var textnode, textnode1, linebreak;

textnode0 = document.createTextNode("Trackers / Counters -");
linebreak = document.createElement('br');
node0.appendChild(textnode0);
node0.appendChild(linebreak);

if ( localStorage.TrackLoot === "true") {
	textnode0 = document.createTextNode("Loot Tracker - " + localStorage.LootChecker);
	linebreak = document.createElement('br');
	node0.appendChild(textnode0);
	node0.appendChild(linebreak);
}

if ( localStorage.BullyMonster === "true") {
	textnode0 = document.createTextNode("Monster Count - " + localStorage.Monstercounter);
	linebreak = document.createElement('br');
	node0.appendChild(textnode0);
	node0.appendChild(linebreak);
}
if ( localStorage.Wager === "true") {
	textnode0 = document.createTextNode("Times Wagered - " + localStorage.WagerCounter);
	linebreak = document.createElement('br');
	node0.appendChild(textnode0);
}

var node1= document.createElement("L");

textnode1 = document.createTextNode("Logs for Auto Captcha -");
linebreak = document.createElement('br');
node1.appendChild(textnode1);
node1.appendChild(linebreak);

textnode1 = document.createTextNode("Auto Captcha count - " + localStorage.CaptchaCounter);
linebreak = document.createElement('br');
node1.appendChild(textnode1);
node1.appendChild(linebreak);

textnode1 = document.createTextNode("Times Auto slept - " + localStorage.AutoRunCount);
linebreak = document.createElement('br');
node1.appendChild(textnode1);
node1.appendChild(linebreak);

textnode1 = document.createTextNode("Slept at " + localStorage.SleepTime);
linebreak = document.createElement('br');
node1.appendChild(textnode1);
node1.appendChild(linebreak);

textnode1 = document.createTextNode("Woke up at " + localStorage.WakeTime);
linebreak = document.createElement('br');
node1.appendChild(textnode1);
node1.appendChild(linebreak);

document.getElementsByClassName("userGroupContainer")[0].appendChild(node0);
document.getElementsByClassName("userGroupContainer")[0].appendChild(node1);

// Styling for Headers
node0.style.color = "white";
node0.style.fontSize = "15px";
node0.style.fontFamily = "Arial";
node0.style.paddingTop = "5px";
node0.style.paddingBottom = "5px";
node0.style.margin = "0px";

// Styling for Captcha log
node1.style.color = "white";
node1.style.paddingTop = "5px";
node1.style.paddingBottom = "5px";


} else {
    
    var aRandomDIV = document.createElement("DIV");
    aRandomDIV.innerHTML = "<br><p style='color:white;font-size:12px;'>Your browser " +
        "does not support Web Storage. Script functions will not work properly or in a complete manner.</p>";
    document.body.appendChild(aRandomDIV);
    
}
