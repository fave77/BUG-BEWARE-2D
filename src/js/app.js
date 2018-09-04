/* An Enemy constructor function, for all the enemy instances,
 * defining their position, velocity & appearance.
 */
const Enemy = function(x, y, v) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.sprite = 'images/enemy-bug.png';
};

/* Updates the enemy's position w.r.t. dt, a time delta between ticks
 * so as to enable a constant f.p.s. across all devices.
 */
Enemy.prototype.update = function(dt) {
    if(this.x < ctx.canvas.width) this.x += this.v * dt;
};

/* Draws the enemy object on the canvas.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* A Player constructor function defining the position, score,
 * no. of lives & appearance of a player instance.
 */
const Player = function(x, y) {
    this.sprite = null;
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.lives = 3;
};

/* Updates the player's position and checks for edges to avoid.
 */
Player.prototype.update = function() {
    if(this.y <= -23) {
        document.querySelector('#success').play();
        generatePlayerLocation('success', this);
    }
    this.x = (this.x < 0) ? 0 : (this.x >= ctx.canvas.width ? ctx.canvas.width - 101 : this.x);
    this.y = (this.y < -23) ? -23 : (this.y >= ctx.canvas.height - 226 ? ctx.canvas.height - 226 : this.y);
};

/* Draws the player object on the canvas.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Updates the player's position according to the user input.
 */
Player.prototype.handleInput = function(dir) {
    switch(dir) {
        case 'left':
            this.x -= 101;
            break;
        case 'up':
            this.y -= 83;
            break;
        case 'right':
            this.x += 101;
            break;
        case 'down':
            this.y += 83;
            break;
    }
};

/* A Collectible constructor function, for all the gems and lives,
 * defining their position & appearance.
 */
const Collectible = function(x, y, s) {
    this.x = x;
    this.y = y;
    this.sprite = s;
};

/* Draws the collectible object on the canvas.
 */
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* An empty array for holding all the enemy instances.
 */
const allEnemies = [];

/* For every 1 second a new enemy object is instantiated and inserted
 * into the allEnemies array.
 */
setInterval(() => {
        const rows = [60, 143, 226],
            x_coordinate = -101,
            y_coordinate = rows[Math.floor(Math.random() * rows.length)],
            velocity = (Math.random() * 300) + 300,
            enemy = new Enemy(x_coordinate, y_coordinate, velocity);
        allEnemies.push(enemy);
}, 1000);

/* A new player object is instantiated.
 */
let player = new Player(Math.floor(Math.random() * 5) * 101, 380);

/* An empty array for holding all the gems.
 */
const allGems = [];

/* 3 new gems are instantiated and inserted into the allGems array.
 */
['Blue', 'Green', 'Orange'].forEach(gem => {
    allGems.push(new Collectible(Math.floor(Math.random() * 5) * 101, Math.floor(Math.random() * 3 + 1) * 83 - 23, 'images/Gem-' + gem + '.png'));
});

/* A lives object is created for providing an extra chance to a player
 * in the game.
 */
const lives = new Collectible(Math.floor(Math.random() * 5) * 101, Math.floor(Math.random() * 3 + 1) * 83 - 23, 'images/Heart.png');

/* Gameplay starts after player clicks the Play Button.
 */
function startGame() {
    const playButton = document.querySelector('#play-button');
    playButton.addEventListener('click', () => {
        playButton.setAttribute('style', 'display: none');
        document.querySelector('#background').play();
        if(window.innerWidth < 560) {
            const container = document.querySelector('.container');
            container.innerHTML = 'Snap!<br><br>Your device is too small and needs a keyboard to play this game.<br><br>¯\\_(ツ)_/¯';
        }
        else introduction();
    });
}

/* A basic introduction to the background story for this arcade game is generated.
 */
function introduction() {
    (function(){
        $(".typed").typed({
            strings: ['A long time ago, in an island far, far away...It is a period of war for survival between enemy-bugs and humans. During the battle, a small group of spies managed to steal a secret map to all the 3 Pesticide Gems. Whoever holds all the gems shall possess the power to destroy the entire population of bugs and restore freedom to the island...<br>Your mission is to find the 3 gems by leveling up and destroy the tyrant bugs once and for all!'],
            typeSpeed: 30,
            startDelay: 50,
            showCursor: false,
            cursorChar: "|",
            contentType: 'html'
        });
    })();
    const container = document.querySelector('.container'),
        form = document.querySelector('form'),
        playerName = document.querySelector('input'),
        submitButton = document.querySelector('#submit-button');
    form.setAttribute('style', 'display: all');
    submitButton.addEventListener('click', event => {
        event.preventDefault();
        player.name = playerName.value;
        if(!player.name) alert('Please Enter Your Name.\nWe can\'t read minds you know!');
        else {
            container.innerHTML = '<h3>Hi ' + player.name + '!<br> select avatar</h3> <div id="carouselControls" class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="carousel-item active"> <img src="images/char-boy.png" alt="boy"> </div><div class="carousel-item"> <img src="images/char-cat-girl.png" alt="cat-girl"> </div><div class="carousel-item"> <img src="images/char-horn-girl.png" alt="horn-girl"> </div><div class="carousel-item"> <img src="images/char-pink-girl.png" alt="pink-girl"> </div><div class="carousel-item"> <img src="images/char-princess-girl.png" alt="princess-girl"> </div></div><a class="carousel-control-prev" href="#carouselControls" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="sr-only">Previous</span> </a> <a class="carousel-control-next" href="#carouselControls" role="button" data-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="sr-only">Next</span> </a> </div>';
            selectPlayer();
        }
    });
}

/* Lets an user select different avatar for the player object.
 */
function selectPlayer() {
    const img = document.querySelectorAll('img'),
        scorePanel = document.querySelector('#score-panel'),
        hearts = document.querySelector('#hearts'),
        container = document.querySelector('.container');
    Array.prototype.slice.call(img).forEach(image => {
        image.addEventListener('click', () => {
            player.sprite = image.getAttribute('src');
            container.setAttribute('style', 'display: none');
            ctx.canvas.setAttribute('style', 'display: all');
            scorePanel.setAttribute('style', 'display: all');
            for(var i = 0; i < player.lives; i++)
                hearts.innerHTML += '<img src="images/Heart.png">';
            document.querySelector('html').webkitRequestFullscreen();
        });
    });
}

/* Checks whether a collectible item has been collected or not
 * and accordingly updates the score-board as well as renders the canvas.
 */
function checkItem(item) {
    if(Math.abs(item.x - player.x) < 51 && Math.abs(item.y - player.y) == 12) {
        document.querySelector('#level-up').play();
        item.render = () => true;
        if(item == lives) {
            const hearts = document.querySelector('#hearts');
            player.lives += 1;
            hearts.innerHTML = '';
            for(var i = 0; i < player.lives; i++)
                hearts.innerHTML += '<img src="images/Heart.png">';
        } else {
            const gem = document.querySelector('#gem');
            gem.innerHTML += '<img src="' + item.sprite + '">';
        }
        item.x = undefined;
        item.y = undefined;
    }
}

/* Generates the player location randomly after each collision with an enemy bug
 * or when successfully crosses the river.
 */
function generatePlayerLocation(event, player) {
    const score = document.querySelector('#score'),
        hearts = document.querySelector('#hearts');
    if(event == 'success') {
        player.score += 1;
        score.innerHTML = player.score;
        (player.score == 10) ? endGame('won') : null;
    } else {
        player.lives -= 1;
        hearts.innerHTML = '';
        for(var i = 0; i < player.lives; i++)
            hearts.innerHTML += '<img src="images/Heart.png">';
        (player.lives == 0) ? endGame('lose') : null;
    }
    player.x = Math.floor(Math.random() * 5) * 101;
    player.y = 380;
}

/* Checks for the different outcome of the game.
 */
function endGame(outcome) {
    let modalTitle = document.querySelector('#modalCenterTitle'),
        modalBody = document.querySelector('.modal-body'),
        numOfGemCollected = 0;
    const closeButton = document.querySelector('#close-button');
    allGems.forEach(gem => {
        if(gem.render()) numOfGemCollected += 1
    });
    closeButton.addEventListener('click', () => window.open(window.location.href, '_self'));
    if(outcome == 'won') {
        if(numOfGemCollected == 3) {
            modalTitle.innerHTML = 'Congratulations, ' + player.name + '!';
            modalBody.innerHTML = 'You\'ve made it... It is because of you the long gone peace has been finally restored!';
        } else {
            modalTitle.innerHTML = 'Hey, ' + player.name + '!';
            modalBody.innerHTML = 'Your effort is uncomparable but you must collect all the gems in order to win this battle!';
        }
        document.querySelector('#modal-button').click();
    } else {
        modalTitle.innerHTML = 'Oh, ' + player.name + '!';
        modalBody.innerHTML = '...what have you done!<br>We lost!'
        document.querySelector('#modal-button').click();
    }
}

/* Listens for key presses and sends the keys to player's
 * handleInput method.
 */
document.addEventListener('keyup', event => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };
    player.handleInput(allowedKeys[event.keyCode]);
});