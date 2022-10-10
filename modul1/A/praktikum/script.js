async function TableLoader(){
    const response1 = await fetch("praktikum.json");
    const praktikumData = await response1.json();
    const table = document.createElement("table");
    const header = ["rank", "team", "score"];

    const tr = document.createElement("tr"); 

    header.forEach(element => { // table header
        const th = document.createElement("th");
        const text = document.createTextNode(element);
        th.appendChild(text);
        tr.appendChild(th);
    });

    praktikumData.rows[0].problems.forEach(element => { // problem tag
        const th = document.createElement("th");
        const text = document.createTextNode(element.label);
        th.appendChild(text);
        tr.appendChild(th);
    });

    table.appendChild(tr);    

    praktikumData.rows.forEach(element => {
        const tr = document.createElement("tr");

        const rank = document.createElement("td");
        const rankText = document.createTextNode(element.rank);
        rank.appendChild(rankText);
        tr.appendChild(rank);
        
        const team = document.createElement("td");
        const teamText = document.createTextNode(element.team_id);
        team.appendChild(teamText);
        tr.appendChild(team);

        const score = document.createElement("td");
        const scoreText = document.createTextNode(element.score.num_solved);
        score.appendChild(scoreText);
        score.appendChild(document.createElement("br"));
        const penaltyText = document.createTextNode(element.score.total_time);
        score.appendChild(penaltyText);
        tr.appendChild(score);

        element.problems.forEach(prob => {
            const verdict = document.createElement("td");
            if(prob.num_judged !== 0 && prob.solved){
                verdict.appendChild(document.createTextNode(prob.time));
                verdict.appendChild(document.createElement("br"));
                verdict.appendChild(document.createTextNode(prob.num_judged));
            }
            else if(prob.num_judged !== 0 && !prob.solved){
                verdict.appendChild(document.createTextNode(" "));
                verdict.appendChild(document.createElement("br"));
                verdict.appendChild(document.createTextNode(prob.num_judged));
            }
            tr.appendChild(verdict);
        });

        table.appendChild(tr);

    });

    document.getElementById("tableContainer").appendChild(table);

}