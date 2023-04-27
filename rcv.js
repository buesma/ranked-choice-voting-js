function RCV(votes) {

  let n_candidates = votes.length;
  votes = sanitizeArray(votes);

  let ranking = new Array(n_candidates);
  let candidate_ids = [ ...Array(n_candidates).keys() ];

  let tmp_votes = deepcopy(votes);
  for (let i = 0; i < n_candidates -1; i++) {
    let wins = countWins(tmp_votes);
    
    idx = getIndexMin(wins);
    ranking[candidate_ids.splice(idx, 1)] = n_candidates - i;

    // Get the ranking of the to be removed candidate for voter m.  
    delete_ranking = tmp_votes.splice(idx,1)[0];
    // Adjust all user rankings which the candidate ranked lower than the deleted candidate.
    for (let id_voter = 0; id_voter < tmp_votes[0].length; id_voter++) {
      for (let id_candidate = 0; id_candidate < tmp_votes.length; id_candidate++) {
        
        let voter_ranking = tmp_votes[id_candidate][id_voter];

        if (voter_ranking < delete_ranking[id_voter]) {
          voter_ranking++;
        }
      }
    }
    
    // Assign the last remaining candidate the first place
    ranking[candidate_ids[0]] = 1;

  }
  return ranking
}

function sanitizeArray (arr) {

  // Get the max value for each column
  column_max = [];
  for (let i = 0; i < arr[0].length; i++) {
    let max = 1;
    for (let j = 0; j < arr.length; j++) {
      if (arr[j][i] >= max) {
        max = arr[j][i];
      }
    }
    column_max.push(max);
  }

  // Replace invalid values with the column max incremented by 1
  for (let i = 0; i < arr[0].length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (isNaN(arr[j][i]) || arr[j][i] == '') {
       arr[j][i] = column_max[i] + 1;
      }
    }
  }

  return arr
}

function deepcopy (arr) {
  let copy = [];
  for (let i = 0; i < arr.length; i++)
    copy[i] = arr[i].slice();
  return copy
}

function countWins(votes) {  

  let counted_wins = [];
  for (let i = 0; i < votes.length; i++) { 
    let wins = 0;
    for (let j = 0; j < votes[i].length; j++) {
      if (votes[i][j] == 1) {
        wins += 1;
      }
    }
    counted_wins.push(wins);
  }
  return counted_wins
}

function getIndexMin (arr) {
  let index = 0;
  let value = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < value) {
      value = arr[i];
      index = i;
    }
  }
  return index
}
