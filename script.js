const fs = require("fs");
const puppy=require("puppeteer");
const id = "riparay822@tripaco.com";
const pass = "Shaktimaan";
let jobs = [];
let todaysContest = [];
let todaysNews=[];
let newMails=[];
async function main(){
    let browser  = await puppy.launch({
        headless:false,
        defaultViewport:false,
        slowMo:100,
        args:["---start-maximized"]
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    // Jobs
    await linkedIn(tab);

    // contests
    await contest(tab);
    await upcomigContest(tab);
    await upcomigContestAll(tab);

    // Mails
    await mails(tab);

    // News
    await stateNews(tab);
    await indiaNews(tab);
    await worldNews(tab);
    
    
    // check for upcoming coding contest....


    await browser.close();

}

async function linkedIn(tab){
    await tab.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin");
    await tab.type("#username",id);
    await tab.type("#password",pass);
    await tab.click(".btn__primary--large.from__button--floating");
    await tab.waitForNavigation({waitUntil:"networkidle2"});
    await tab.waitForSelector(".search-global-typeahead__input.always-show-placeholder",{visible:true});
    await tab.type(".search-global-typeahead__input.always-show-placeholder","software development engineer");
    await tab.keyboard.press("Enter");
    await tab.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--2.artdeco-pill--choice.ember-view.search-reusables__filter-pill-button",{visible:true});

    let job = await tab.$$(".artdeco-pill.artdeco-pill--slate.artdeco-pill--2.artdeco-pill--choice.ember-view.search-reusables__filter-pill-button");
    await job[1].click();

    await new Promise(async function(resolve,reject){
        setTimeout(resolve,2000);
    })

    await tab.waitForSelector(".artdeco-pill.artdeco-pill--slate.artdeco-pill--2.artdeco-pill--choice.ember-view.search-reusables__filter-pill-button",{visible:true});
    let time = await tab.$$(".artdeco-pill.artdeco-pill--slate.artdeco-pill--2.artdeco-pill--choice.ember-view.search-reusables__filter-pill-button");
    await time[1].click();

    await tab.waitForSelector(".t-14.t-black--light.t-normal",{visible:true});
    let timeCond = await tab.$$(".t-14.t-black--light.t-normal");

    await timeCond[3].click();
    await tab.waitForSelector(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml2 span",{visible:true});
    let apply=await tab.$$(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml2 span");

    await apply[0].click();
    await tab.waitForSelector(".jobs-search-box__text-input.jobs-search-box__ghost-text-input");
    await tab.type(".jobs-search-box__text-input.jobs-search-box__ghost-text-input","India");
    await new Promise(async function(resolve,reject){
        setTimeout(() => {
            resolve();
        }, 5000);
    });
    let post = await tab.$$(".disabled.ember-view.job-card-container__link.job-card-list__title");
    let company = await tab.$$(".job-card-container__link.job-card-container__company-name.ember-view")
    let locations = await tab.$$(".job-card-container__metadata-item");
    for(let i=0;i<post.length;i++){
        let postLink = await tab.evaluate(anchor => anchor.getAttribute('href'), post[i]);
        let postName = await tab.evaluate(function(ele) {
            return ele.textContent;
        }, post[i]);
        let companyName = await tab.evaluate(function(ele){
            return ele.textContent;
        },company[i]);
        let location = await tab.evaluate(function(ele){
            return ele.textContent;
        },locations[i]);
        // companyName = companyName.replace(/(\r\n|\n|\r)/gm,"");
        // postName = postName.replace(/(\r\n|\n|\r)/gm,"");
        companyName = companyName.trim();
        postName = postName.trim();
        jobs.push({"PostName":postName,"companyName":companyName,"location":location,"jobLink":"https://www.linkedin.com"+postLink});

    }
    fs.writeFileSync("jobs.json",JSON.stringify(jobs));
    console.log(jobs);
}

async function contest(tab){
    let codeforces=[];
    await tab.goto("https://codeforces.com");
    await tab.waitForSelector(".menu-list.main-menu-list li");
    let conPage = await tab.$$(".menu-list.main-menu-list li");
    await conPage[2].click();
    await tab.waitForSelector(".datatable div table tbody tr td",{visible:true});
    let data = await tab.$$(".datatable div table tbody tr td");
    let cnt=1;
    let arrBreaker = `Contest No. ${cnt}`;
    for(let i=0;i<24;i++){
        let txt = await tab.evaluate(function(ele){
            return ele.textContent;
        },data[i]);
        // txt = txt.replace(/(\r\n|\n|\r)/gm,"");
        txt = txt.trim();
        console.log(txt);
        if(i%6 == 0){
            codeforces.push(arrBreaker);
            cnt=cnt+1;
            arrBreaker = `Contest No. ${cnt}`;
            codeforces.push({"Name":txt});
        }
        else if(i%6 == 1){
            codeforces.push({"Writer":txt});
        }
        else if(i%6 == 2){
            codeforces.push({"Date":txt});
        }
        else if(i%6 == 3){
            codeforces.push({"Length":txt});
        }
        else if(i%6 == 4){
            codeforces.push({"Registration":txt});
            
        }

    }
    // console.log(codeforces);
    todaysContest.push({"codeforces":codeforces});
    // console.log(todaysContest);
    // fs.writeFileSync("Cotest.json",JSON.stringify(todaysContest));

}

async function upcomigContest(tab){
    let codechef=[];
    await tab.goto("https://www.codechef.com");
    await tab.waitForSelector("#menu-309");
    await tab.click("#menu-309");
    // await tab.click("#gdpr-i-love-cookies");
    await tab.waitForSelector("#future-contests-data tr td");
    let uc = await tab.$$("#future-contests-data tr td");
    // let cnt=await tab.$$("#future-contests-data tr");
    console.log(uc.length);
    let cnt=1;
    let arrBreaker = `Contest No. ${cnt}`;
    for(let i=0;i<uc.length;i++){
        let txt = await tab.evaluate(function(ele){
            return ele.textContent;
        },uc[i]);
        // txt = txt.replace(/(\r\n|\n|\r)/gm,"");
        txt = txt.trim();
        console.log(txt);
        if(i%4 == 0){
            codechef.push(arrBreaker);
            cnt=cnt+1;
            arrBreaker = `Contest No. ${cnt}`;
            codechef.push({"Code":txt});
        }
        else if(i%4 == 1){
            codechef.push({"Name":txt});
        }
        else if(i%4 == 2){
            codechef.push({"Start":txt});
        }
        else {
            codechef.push({"End":txt});
        }

    }
    // console.log(codechef);
    todaysContest.push({"codechefUpcoming":codechef});
    // console.log(todaysContest);
    // fs.writeFileSync("Contest.json",JSON.stringify(todaysContest));
}

async function mails(tab){
    const email = "ironmanilu95@gmail.com";
    const gpass="Shaktimaan@95";
    await tab.goto("https://accounts.google.com/signin/v2/identifier?passive=1209600&continue=https%3A%2F%2Faccounts.google.com%2Fb%2F0%2FAddMailService&followup=https%3A%2F%2Faccounts.google.com%2Fb%2F0%2FAddMailService&flowName=GlifWebSignIn&flowEntry=ServiceLogin");
    await tab.waitForSelector(".rFrNMe.N3Hzgf.jjwyfe.QBQrY.zKHdkd.sdJrJc.Tyc9J .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf",{visible:true});
    await tab.type(".rFrNMe.N3Hzgf.jjwyfe.QBQrY.zKHdkd.sdJrJc.Tyc9J .aCsJod.oJeWuf .aXBtI.Wic03c .Xb9hP .whsOnd.zHQkBf",email);
    await tab.keyboard.press("Enter");
    await tab.waitForSelector('[type="password"]',{visible:true});
    await tab.type('[type="password"]',gpass);
    await tab.keyboard.press("Enter");
    await tab.waitForSelector(".zA.zE .y2")
    let mails = await tab.$$(".zA.zE .y2");
    console.log(mails.length);
    for(let i=0;i<mails.length;i++){
        let mailtxt = await tab.evaluate(function(ele){
            return ele.textContent;
        },mails[i]);
        // console.log(mailtxt);
        newMails.push((i+1)+ mailtxt);
    }
    fs.writeFileSync("Mails.json",JSON.stringify(newMails));

    
   
}

async function indiaNews(tab){
    
    await tab.goto("https://timesofindia.indiatimes.com/india/timestopten.cms");
    await tab.waitForSelector(".page_title a",{visible:true});
    let num = await tab.$$(".page_title a");
    todaysNews.push({"INDIA":[]});
    todaysNews[1].INDIA.push({"topNews":[]});
    for(let i=0;i<num.length;i++){
        let txt = await tab.evaluate(function(ele){
            return ele.textContent;
        },num[i]);
        // console.log(txt);
        todaysNews[1].INDIA[0].topNews.push(txt);
    }
    let un = await tab.$$(".Normal");
    let arr=[];
    let first = await tab.evaluate(function(ele){
        return ele.textContent;
    },un[0]);
    first = first.split(";");
    for(let i=0;i<first.length;i++){
        arr.push(first[i]);
    }
    todaysNews[1].INDIA[0].topNews.push(arr);
    console.log(todaysNews);
    // fs.writeFileSync("News.json",JSON.stringify(todaysNews));

}

async function worldNews(tab){
    await tab.goto("https://www.bbc.com/news/world");
    await tab.waitForSelector(".lx-stream-post__header-text.gs-u-align-middle",{visible:true});
    let news = await tab.$$(".lx-stream-post__header-text.gs-u-align-middle");
    todaysNews.push({"WORLD":[]});
    for(let i=0;i<news.length;i++){
        let txt = await tab.evaluate(function(ele){
            return ele.textContent;
        },news[i]);
        todaysNews[2].WORLD.push(txt);
    }
    // console.log(todaysNews);
    fs.writeFileSync("News.json",JSON.stringify(todaysNews));
    
}

async function stateNews(tab){
    await tab.goto("https://www.ndtv.com/delhi-news");
    await tab.waitForSelector(".newsHdng a",{visible:true});
    let news = await tab.$$(".newsHdng a");
    todaysNews.push({"Delhi":[]});
    for(let i=0;i<news.length;i++){
        let newsArray=[];
        let txt = await tab.evaluate(function(ele){
            return ele.textContent;
        },news[i]);
        let link = await tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },news[i]);
        newsArray.push(txt);
        newsArray.push(link);
        todaysNews[0].Delhi.push(newsArray)
        // console.log(txt);
        // console.log(link);
        // console.log("\n");
    }
    console.log(todaysNews);
    // fs.writeFileSync("News.json",JSON.stringify(todaysNews));
}

async function upcomigContestAll(tab){
    let contest=[];
    await tab.goto("https://www.stopstalk.com/contests");
    await tab.waitForSelector("#contests-table tbody tr td",{visible:true});
    let allcont = await tab.$$("#contests-table tbody tr td");
    let title = await tab.$$("#contests-table tbody tr td img");
    let a = await tab.$$("#contests-table tbody tr td a");
    let cnt=0;
    let string = `Contest No.${cnt+1}`;
    for(let i=0;i<allcont.length;i++){
        if(i%6 == 0 || i%6 == 1 || i%6 == 2 || i%6 == 4){
            let c =[];
            c.push({"Details":{}});   
        if(i%6 == 0){
            let txt = await tab.evaluate(function(ele){
                return ele.textContent;
            },allcont[i]);
            contest.push(string);
            contest.push({"contestName":txt});
        }

        else if(i%6 == 1){
            let txt = await tab.evaluate(function(ele){
                return ele.getAttribute("title");
            },title[cnt]);
            contest.push({"Platform":txt});
        }

        else if(i%6 == 2){
            let txt = await tab.evaluate(function(ele){
                return ele.textContent;
            },allcont[i]);
            contest.push({"startingTime":txt});
        }

        else if(i%6 == 4){
            let txt = await tab.evaluate(function(ele){
                return ele.getAttribute("href");
            },a[cnt]);
            contest.push({"link":txt});
            cnt+=1;
            string = `COntest No.${cnt+1}`;
        }
    }
    }
    todaysContest.push({"allUpComingContest":contest});

    // contest file formation
    fs.writeFileSync("Contest.json",JSON.stringify(todaysContest));

}

main();