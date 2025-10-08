    // Image paths (your local files)
    const IMG = {
      Rock: "./images/rock-emoji.png",
      Paper: "./images/paper-emoji.png",
      Scissors: "./images/scissors-emoji.png"
    };

    // State
    let score = { user: 0, cpu: 0, tie: 0 };

    // Helpers
    const $ = (id) => document.getElementById(id);

    function cpuMove(){
      const r = Math.random();
      if (r < 1/3) return 'Rock';
      if (r < 2/3) return 'Paper';
      return 'Scissors';
    }

    function judge(user, cpu){
      if (user === cpu) return 'tie';
      if (
        (user === 'Rock' && cpu === 'Scissors') ||
        (user === 'Paper' && cpu === 'Rock') ||
        (user === 'Scissors' && cpu === 'Paper')
      ) return 'win';
      return 'lose';
    }

    function updateUI(user, cpu, result){
      // Images & labels
      $('youImg').src = IMG[user];
      $('youImg').alt = user;
      $('youText').textContent = user;

      $('cpuImg').src = IMG[cpu];
      $('cpuImg').alt = cpu;
      $('cpuText').textContent = cpu;

      // Outcome pill
      const out = $('outcome');
      out.className = 'outcome ' + (result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'tie');
      out.textContent = result === 'win' ? 'You win! 🎉' : result === 'lose' ? 'You lose 😅' : 'It’s a tie 🤝';

      // Score
      $('scoreUser').textContent = score.user;
      $('scoreCpu').textContent = score.cpu;
      $('scoreTie').textContent = score.tie;
    }

    // Main play function (called by each button)
    function play(userChoice){
      const cpuChoice = cpuMove();
      const result = judge(userChoice, cpuChoice);

      // Update score
      if (result === 'win') score.user++;
      else if (result === 'lose') score.cpu++;
      else score.tie++;

      updateUI(userChoice, cpuChoice, result);
    }

    function resetScore(){
      score = { user:0, cpu:0, tie:0 };
      updateUI('','', 'tie');
      $('youImg').src = '';
      $('cpuImg').src = '';
      $('youText').textContent = '—';
      $('cpuText').textContent = '—';
      $('outcome').textContent = 'Make a move!';
    }

    // Optional: preload images for snappier UI
    (function preload(){
      Object.values(IMG).forEach(src => { const i = new Image(); i.src = src; });
    })();