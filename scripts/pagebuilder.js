let scoreboardDirectory;
let teamsDirectory;
let problemsDirectory;

function AddTitleAndHeader(){
    const queryString = window.location.pathname;
    const arrayOfString = queryString.split("/");
    scoreboardDirectory = arrayOfString[0] + "/" + arrayOfString[1] + "/" + arrayOfString[2] + "/" + arrayOfString[3] + "/" + arrayOfString[4] + "/scoreboard.json";
    teamsDirectory = arrayOfString[0] +  "/" + arrayOfString[1] +   "/" + arrayOfString[2] +  "/" + arrayOfString[3] + "/teams.json";
    problemsDirectory = arrayOfString[0] +  "/" + arrayOfString[1] +   "/" + arrayOfString[2] +  "/" + arrayOfString[3] + "/problems.json";
    const pageTitle =   arrayOfString[4][0].toUpperCase() + 
                        arrayOfString[4].substring(1) + 
                        " Modul " + 
                        arrayOfString[2] + 
                        " Dasar Pemrograman " + 
                        arrayOfString[3] + 
                        " 2022/2023";
    document.title = pageTitle;

    const headerText = document.createElement("p");
    headerText.classList.add("HeaderText");
    headerText.appendChild(document.createTextNode(pageTitle));
    document.getElementById("header").appendChild(headerText);
}

async function TableLoader(){
    console.log(scoreboardDirectory);
    const response1 = await fetch(scoreboardDirectory);
    const scoreboardData = await response1.json();
    const response2 = await fetch(teamsDirectory);
    const teamsData = await response2.json();
    const response3 = await fetch(problemsDirectory);
    const problemsData = await response3.json();
    const table = document.createElement("table");
    const header = ["Rank", "Team", "Score", "A", "B", "C", "D"];

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    let count = 0;

    header.forEach(element => { // table header
        const th = document.createElement("th");
        const text = document.createTextNode(element);
        th.appendChild(text);
        if(element.length === 1){
            th.classList.add("ToolTip");
            th.classList.add("TextCenter");
            const problemName = document.createElement("span");
            problemName.classList.add("ToolTipText");
            problemName.appendChild(document.createTextNode(problemsData[count].name));
            th.appendChild(problemName);
            count++;
        }
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    table.appendChild(thead);
    
    const tbody = document.createElement("tbody");

    scoreboardData.rows.forEach(element => {
        const tr = document.createElement("tr");

        const rank = document.createElement("td");
        rank.classList.add("RankText");
        const rankText = document.createTextNode(element.rank);
        rank.appendChild(rankText);
        tr.appendChild(rank);
        
        const team = document.createElement("td");
        team.classList.add("TeamText");
        const teamName = teamsData.find(index => 
            index.id === element.team_id
        );
        const teamText = document.createElement("p");
        teamText.classList.add("TeamNameText");
        teamText.appendChild(document.createTextNode(teamName.name));
        team.appendChild(teamText);
        const teamId = document.createElement("p");
        teamId.classList.add("TeamIdText")
        teamId.appendChild(document.createTextNode(element.team_id));
        team.appendChild(teamId);
        tr.appendChild(team);

        const score = document.createElement("td");
        const scoreText = document.createElement("p");
        scoreText.classList.add("ScoreText");
        scoreText.appendChild(document.createTextNode(element.score.num_solved));
        score.appendChild(scoreText);
        const penaltyText = document.createElement("p");
        penaltyText.classList.add("PenaltyText");
        penaltyText.appendChild(document.createTextNode(element.score.total_time));
        score.appendChild(penaltyText);
        tr.appendChild(score);

        element.problems.forEach(prob => {
            const verdict = document.createElement("td");
            const timeText = document.createElement("p");
            const tryText = document.createElement("p");
            if(prob.num_judged !== 0 && prob.solved){
                verdict.classList.add("AC");
                timeText.classList.add("TimeText");
                timeText.appendChild(document.createTextNode(prob.time));
                verdict.appendChild(timeText);
                tryText.classList.add("TryText");
                if(prob.num_judged === 1)tryText.appendChild(document.createTextNode(prob.num_judged + " try"));
                else tryText.appendChild(document.createTextNode(prob.num_judged + " tries"));
                verdict.appendChild(tryText);
            }
            else if(prob.num_judged !== 0 && !prob.solved){
                verdict.classList.add("WA");
                timeText.classList.add("TimeText");
                timeText.appendChild(document.createTextNode("0"));
                verdict.appendChild(timeText);
                tryText.classList.add("TryText");
                if(prob.num_judged === 1)tryText.appendChild(document.createTextNode(prob.num_judged + " try"));
                else tryText.appendChild(document.createTextNode(prob.num_judged + " tries"));
                verdict.appendChild(tryText);
            }
            tr.appendChild(verdict);
        });

        tbody.appendChild(tr);

    });
    table.appendChild(tbody);
    document.getElementById("tableContainer").appendChild(table);
}

function Init(){
    AddTitleAndHeader();
    TableLoader();
}