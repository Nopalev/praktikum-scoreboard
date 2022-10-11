var directory;

function AddTitleAndHeader(){
    const queryString = window.location.pathname;
    const arrayOfString = queryString.split("/");
    directory = arrayOfString[4];
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

async function TableLoaderAndLegendCreator(){
    const response1 = await fetch(directory + "/scoreboard.json");
    const scoreboardData = await response1.json();
    const response2 = await fetch("teams.json");
    const teamsData = await response2.json();
    const table = document.createElement("table");
    const header = ["Rank", "Team", "Score", "A", "B", "C", "D"];

    const tr = document.createElement("tr"); 

    header.forEach(element => { // table header
        const th = document.createElement("th");
        const text = document.createTextNode(element);
        th.appendChild(text);
        tr.appendChild(th);
    });

    table.appendChild(tr);    

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

        table.appendChild(tr);

    });
    document.getElementById("tableContainer").appendChild(table);

    const legendContainer = document.createElement("div");
    legendContainer.classList.add("Center");
    legendContainer.setAttribute("id", "legendContainer");

    const legend = document.createElement("table");
    var letter = 'A';
    scoreboardData.rows[0].problems.forEach(element => { // problem tag
        const tr = document.createElement("tr");
        tr.classList.add("LegendText");
        const problemLetterCells = document.createElement("td");
        const problemLetter = document.createElement("p");
        problemLetter.appendChild(document.createTextNode(letter));
        problemLetterCells.appendChild(problemLetter);
        tr.appendChild(problemLetterCells);

        const problemTagCells = document.createElement("td");
        const problemTag = document.createElement("p");
        problemTag.appendChild(document.createTextNode(element.label));
        problemTagCells.appendChild(problemTag);
        tr.appendChild(problemTagCells);

        legend.appendChild(tr);
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);;
    });
    legendContainer.appendChild(legend);

    document.getElementById("tableContainer").insertAdjacentElement("afterend", legendContainer);
}

function Init(){
    AddTitleAndHeader();
    TableLoaderAndLegendCreator();
}