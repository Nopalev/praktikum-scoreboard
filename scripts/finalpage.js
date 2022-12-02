let scoreboardDirectory;
let teamsDirectory;
let problemsDirectory;

function AddTitleAndHeader(){
    const queryString = window.location.pathname;
    const arrayOfString = queryString.split("/");
    scoreboardDirectory = arrayOfString[0] + "/" + arrayOfString[1] + "/" + arrayOfString[2] + "/scoreboard.json";
    teamsDirectory = arrayOfString[0] +  "/" + arrayOfString[1] +   "/" + arrayOfString[2] + "/teams.json";
    problemsDirectory = arrayOfString[0] +  "/" + arrayOfString[1] +   "/" + arrayOfString[2] + "/problems.json";
    const pageTitle =   "Praktikum" + 
                        " Final" + 
                        " Dasar Pemrograman" + 
                        " 2022/2023";
    document.title = pageTitle;

    const headerText = document.createElement("p");
    headerText.classList.add("HeaderText");
    headerText.appendChild(document.createTextNode(pageTitle));
    document.getElementById("header").appendChild(headerText);
}

function ClassFinder(arg){
    const teamsCategory = arg.split("-");
    return teamsCategory.pop().toUpperCase();
}

async function TableLoader(){
    const response1 = await fetch(scoreboardDirectory);
    const scoreboardData = await response1.json();
    const response2 = await fetch(teamsDirectory);
    const teamsData = await response2.json();
    const table = document.createElement("table");
    let header = ["Rank", "Class", "Team", "Score"];
    const statisticRowtext = ["Accepted", "Attempted", "Difficulty"];
    let problemAccepted = [];
    let problemAttempted = [];

    for(let i = 0; i < 21; i++){
        header.push(String.fromCharCode('A'.charCodeAt(0) + i));
        problemAccepted.push(0);
        problemAttempted.push(0);
    }

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    header.forEach(element => { // table header
        const th = document.createElement("th");
        const text = document.createTextNode(element);
        th.appendChild(text);
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
        const teamClass = document.createElement("td");
        const teamClassText = document.createElement("p");
        teamClassText.appendChild(document.createTextNode(ClassFinder(teamName.group_ids[0])));
        teamClass.appendChild(teamClassText);
        tr.appendChild(teamClass);
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

        let index = 0;

        element.problems.forEach(prob => {
            const verdict = document.createElement("td");
            const timeText = document.createElement("p");
            const tryText = document.createElement("p");
            if(prob.num_judged !== 0 && prob.solved){
                problemAccepted[index]++;
                problemAttempted[index]++;
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
                problemAttempted[index]++;
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
            index++;
        });

        tbody.appendChild(tr);

    });

    statisticRowtext.forEach(element => {
        const statisticRow = document.createElement("tr");
        const statisticCell = document.createElement("td");
        statisticCell.setAttribute("colspan", "4");
        const statisticText = document.createElement("p");
        statisticText.appendChild(document.createTextNode(element));
        statisticCell.appendChild(statisticText);
        statisticRow.appendChild(statisticCell);
        if(element === "Accepted"){
            problemAccepted.forEach(stat => {
                const statAcceptedCell = document.createElement("td");
                const statAcceptedText = document.createElement("p");
                statAcceptedText.appendChild(document.createTextNode(stat));
                statAcceptedCell.appendChild(statAcceptedText);
                statisticRow.appendChild(statAcceptedCell);
            });
        }
        else if( element === "Attempted"){
            problemAttempted.forEach(stat => {
                const statAttemptedCell = document.createElement("td");
                const statAttemptedText = document.createElement("p");
                statAttemptedText.appendChild(document.createTextNode(stat));
                statAttemptedCell.appendChild(statAttemptedText);
                statisticRow.appendChild(statAttemptedCell);
            });
        }
        else if( element === "Difficulty"){
            for(let i=0; i<21; i++){
                const statDifficultyCell = document.createElement("td");
                const statDifficultyText = document.createElement("p");
                statDifficultyText.classList.add("DifficultyText");
                if(problemAttempted[i] === 0){
                    statDifficultyText.appendChild(document.createTextNode("-"));
                }
                else{
                    const difficulty = Math.round(10000*problemAccepted[i]/problemAttempted[i])/100;
                    const difficultyText = difficulty + "%";
                    statDifficultyText.appendChild(document.createTextNode(difficultyText));
                }
                statDifficultyCell.appendChild(statDifficultyText);
                statisticRow.appendChild(statDifficultyCell);
            }
        }
        tbody.appendChild(statisticRow);
    });
    table.appendChild(tbody);
    document.getElementById("tableContainer").appendChild(table);
}

function Init(){
    AddTitleAndHeader();
    TableLoader();
}