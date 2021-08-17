let page=document.getElementById("game_changer");
let time_left = document.getElementById("time_left");
let num_ac = document.getElementById("num_solved");
let label_for_bar = document.getElementById("label");
let bar = document.getElementById("bar");
let target=5;
let prob_links = document.getElementById("WA_probs");
let recommended_probs = document.getElementById("Recommended_Probs");

document.addEventListener("DOMContentLoaded", async() => {
    let url = "https://cors-anywhere.herokuapp.com/https://recommender.codedrills.io/profile?handles=NamanGoyal07";
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url,true);
    xhr.responseType = "document";

    let tar = target;
    let probsNotDone = new Map();
    xhr.onload = function() {
        if(xhr.readyState==4 && xhr.status==200){
            // do something with that HTML page
            let response = xhr.responseXML.getElementById("Easy").children[2].children[0].children[0].children[0].children;
            for(let i=0;i<response.length && tar;i++){
                let curchild = response[i].children[0].children[0].children[0];
                let link = curchild.getAttribute("href");
                //console.log(link);
                probsNotDone.set(curchild.text,link);
                tar--;
            }
            //console.log(probsNotDone.size);
            for (const [key, value] of probsNotDone.entries()) {
                var linkToProb = document.createElement("a");
                linkToProb.href=value;
                linkToProb.target="blank";
                linkToProb.innerHTML=key+"<br/>";
                recommended_probs.appendChild(linkToProb);
            };
        }
    };
    
    xhr.onerror = function(){
        console.error(xhr.status,xhr.statusText);
    }
    xhr.send();
});

document.addEventListener("DOMContentLoaded", async() => {
    let res = await fetch("https://codeforces.com/api/contest.list?gym=false");
    let data = await res.json();
    var agla = "arre yaar";
    var seconds=0;
    for(var i=0;i<data.result.length;++i){
        if(data.result[i].relativeTimeSeconds<0){
            agla = data.result[i].name;
            seconds = -data.result[i].relativeTimeSeconds;
        }
        else break;
    }   
    page.innerHTML = agla;
    var mins = parseInt(seconds/60);
    var hrs = parseInt(mins/60);
    var days = parseInt(hrs/24);
    time_left.innerHTML = days+" days, "+(hrs%24)+" hours and "+(mins%60)+" minutes left";
});

document.addEventListener("DOMContentLoaded", async() => {
    let res = await fetch("https://codeforces.com/api/user.status?handle=HighVoltage&from=1&count=50");
    let data = await res.json();
    var all_subs=data.result;
    var cnt=0, i=0;
    var cur_date=new Date();
    while (i < 50){
        var sub_date = new Date(all_subs[i].creationTimeSeconds*1000);
        if(cur_date.getDate()!=sub_date.getDate())
        break;
        if(all_subs[i].verdict=="OK")
        cnt++;
        i++;
    }
    if(cnt>target)
    cnt=target;
    var percentage = (cnt*100)/target;
    label_for_bar.innerText="Today's Target Completion: "+percentage+"%";
    bar.value = percentage;
    if(cnt==0) num_ac.innerHTML="You have done no questions yet... "+(target-cnt)+" to be done today!";
    else if(cnt==1) num_ac.innerHTML="You have done only one question... "+(target-cnt)+" more to go!";
    else if(cnt<target) num_ac.innerHTML="You have done "+cnt+" questions... "+(target-cnt)+" more to go!";
    else num_ac.innerHTML="Congrats! You have completed the target of "+target+" questions today.";
});

document.addEventListener("DOMContentLoaded", async() => {
    let api = await fetch("https://codeforces.com/api/user.status?handle=HighVoltage&from=1&count=50");
    let data = await api.json();
    // data.status returns the status of the request
    let desciption_prob = data.result;
    const acceptedProbs = new Set();
    let i = 0;
    let cnt = 5;
    let probsNotDone = new Map();
    while(i<50 && cnt>0){
        let contestId = desciption_prob[i].problem.contestId;
        let indexProblem = desciption_prob[i].problem.index;
        let idOfProblem = contestId+"/problem/"+indexProblem;
        let problemName = desciption_prob[i].problem.name;
        if(desciption_prob[i].verdict=="OK"){    
            acceptedProbs.add(idOfProblem);
        }
        else{
            if(!acceptedProbs.has(idOfProblem) && probsNotDone.get(idOfProblem)==undefined){
                probsNotDone.set(idOfProblem,{id: contestId,name: problemName});
                cnt--;
            }
        }
        i++;
    }

    //console.log(probsNotDone.size);
    let link;
    for (const [key, value] of probsNotDone.entries()) {
        if(value>=100000) link = "https://codeforces.com/gym/"+key;
        else link = "https://codeforces.com/contest/"+key;
        var linkToProb = document.createElement("a");
        linkToProb.href=link;
        linkToProb.target="blank";
        linkToProb.innerHTML=value.name+"<br/>";
        prob_links.appendChild(linkToProb);
    };
});

