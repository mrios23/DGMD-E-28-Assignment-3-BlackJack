/*********** CLASS DECLARATIONS ***********/
class Card{

    #suit; #value;

    constructor(suit, value){
        this.#suit = suit;
        this.#value = value;
    }

    /**
     * @param {any} suit
     */
    set setSuit(suit){
        this.#suit = suit;
    }

    get getSuit(){
        return this.#suit;
    }

    /**
     * @param {any} value
     */
    set setValue(value){
        this.#value = value;
    }

    get getValue(){
        return this.#value;
    }
}

class Deck{
    #cards = [];
    constructor(){
        this.#cards = this.#generateDeck();
    }

    #generateDeck(){
        var suits = [ "diamond", "heart", "spade", "club"];
        var number = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
        var deck = [] 
    
        suits.forEach((suit)=>{
            for(let i=0; i<number.length; i++){
                let card = new Card(suit, number[i]);
                deck.push(card);
            }
        });
        return this.shuffle(deck);      // alternate: deck.sort((a, b) => 0.5 - Math.random())
    }

    /* Implementing fisher yates algorithm to shuffle deck.
        Source:
        https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 
        https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    */
    shuffle(deck) {
        let currentIndex = deck.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [deck[currentIndex], deck[randomIndex]] = [
            deck[randomIndex], deck[currentIndex]];
        }
        return deck;
    }

    get getCards(){
        return this.#cards;
    }

    removeCardFromDeck(){
        this.#cards.shift();
    }
}

class BasePlayerLogic{
    hand = []; // array of cards objects -> Card(suit, value)

    constructor(){
        this.hand = [];
    }

    addCardToHand(card){
        this.hand.push(card);
    }

    get getHand(){
        return this.hand;
    }
    
    calculateSum(){
        let currSum = 0;
        let aceCount = 0;

        this.getHand.forEach((card)=>{
            let value =  card.getValue;
            switch(value){
                case "A":
                    aceCount++;
                    break;
                case "J":
                case "Q":
                case "K":
                    value = 10;
                    currSum += value;
                    break;
                default:
                    currSum += parseInt(value);    
            }
        });

        if(aceCount > 0){
            for(let i=0; i<aceCount; i++){
                // if curr sum is greater than 11, ace = 1, else ace = 11
                (currSum > 11) ? currSum+=1 : currSum+=11;
            }
        }
        return currSum;
    }

    clearHand(){
        this.hand = []
    }
}

class Dealer extends BasePlayerLogic{
    shouldIHit = true;
    hand=[];

    constructor(){
        super();
        this.hand = [];
    }

    addCardToHand(card){
        return super.addCardToHand(card);
    }

    get getHand(){
        return super.getHand;
    }

    calculateSum(){
        return super.calculateSum();
    }

    clearHand(){
        return super.clearHand();
    }

    // Dealer specific methods
    checkIfDealerShouldHit(){
        let currSum = this.calculateSum();
        return (currSum >= 16) ? false : true;
    }
}

class Player extends BasePlayerLogic{
    hand = [];
    wallet;
    constructor(wallet){
        super();
        this.hand =[];
        this.wallet = wallet;
    }

    addCardToHand(card){
        return super.addCardToHand(card);
    }

    get getHand(){
        return super.getHand;
    }

    calculateSum(){
        return super.calculateSum();
    }

    clearHand(){
        return super.clearHand();
    }

    // Player specific methods
    winBet(bet){
        this.wallet = this.wallet + bet;
    }

    loseBet(bet){
        this.wallet = this.wallet - bet;
    }

    getWallet(){
        return this.wallet;
    }

    setWallet(amount){
        this.wallet = amount;
    }
}

/*********** GLOBAL VARIABLES ***********/
const addToWallet = document.getElementById("add-to-wallet");
const walletAmount = document.getElementById("wallet-amount");
const gameBoard = document.getElementById("game-board");
const welcomePage = document.getElementById("welcome-message");
const gameMsg = document.getElementById("game-message");
const hitBtn = document.getElementById("hit");
const stayBtn = document.getElementById("stay");

const bet1 = document.getElementById("bet1");
const bet5 = document.getElementById("bet5");
const bet10 = document.getElementById("bet10");
const betAmount = document.getElementById("current-bet");

window.onload = () => {

    var dealer = new Dealer();
    var player = new Player(100);
    let isGameOver = false;
    var winner;
    
    addToWallet.addEventListener("click", ()=>{
        // get wallet amount & set variable
        let startingAmount = parseInt(document.getElementById("starting-amount").value);

        // write wallet amount to page
        player.setWallet(startingAmount);
        walletAmount.innerHTML = player.getWallet();

        // hide welcome page & show gameboard
        gameBoard.style.display = "inline";
        welcomePage.style.display = "none";

    });

    // choose bet amount to begin
    gameMsg.innerHTML = "Place a bet to begin";
    
    // Handle $1 bet
    bet1.addEventListener("click", ()=>{
        // check if wallet has money
        if(player.getWallet() > 0){
            (!isGameOver == true) ? playGame(1) : resetGame(1, player, dealer);
        }else{
            welcomePage.style.display = "inline";
            welcomePage.firstElementChild.innerHTML = "Please add more money to your virtual wallet to play again!";
            
            gameBoard.style.display = "none";
            clearCards();
            clearMsg();
        }
    });
    
    // Handle $5 bet
    bet5.addEventListener("click", ()=>{
        // check if wallet has money
        if(player.getWallet() > 0){
            (!isGameOver == true) ? playGame(5) : resetGame(5, player, dealer);
        }else{
            welcomePage.style.display = "inline";
            welcomePage.firstElementChild.innerHTML = "Please add more money to your virtual wallet to play again!";
            
            gameBoard.style.display = "none";
            clearCards();
            clearMsg();
        }
    });

    // Handle $10 bet
    bet10.addEventListener("click", ()=>{
        // check if wallet has money
        if(player.getWallet() > 0){
            (!isGameOver == true) ? playGame(10) : resetGame(10, player, dealer);
        }else{
            welcomePage.style.display = "inline";
            welcomePage.firstElementChild.innerHTML = "Please add more money to your virtual wallet to play again!";
            
            gameBoard.style.display = "none";
            clearCards();
            clearMsg();
        }        
    });

    function playGame(bet){
        //remove game message
        clearMsg();

        // display current bet amount
        betAmount.innerHTML = bet;

        // deal out cards to player and dealer, the deck = remaining deck after initial 4 are dealt out
        let deck = dealOutCards(player, dealer);

        displayCards(player);
        displayCards(dealer);
        
        // Handle when user wants to "hit"
        hitBtn.addEventListener("click", ()=>{

            player.addCardToHand(deck.getCards.shift());
            displayCards(player);

            // check if player busted
            let playerSum = player.calculateSum();
            if(playerSum > 21){
                isGameOver = true;
                revealDealerLastCard();
                gameMsg.innerHTML = "BUST! Dealer won - lost bet! Place another bet to play again!";
                
                player.loseBet(bet);
                displayWalletAmount(player.getWallet());
                clearBetAmount();
            }
        });

        // Handle when user wants to stay/no more cards (kicks off end game process)
        stayBtn.addEventListener("click", ()=>{
            
            // see if dealer should hit
            let dealerDecision = dealer.checkIfDealerShouldHit();

            while(dealerDecision == true){
                dealer.addCardToHand(deck.getCards.shift());
                displayCards(dealer);

                dealerDecision = dealer.checkIfDealerShouldHit();
            }

            if(dealerDecision == false){
                revealDealerLastCard();
                isGameOver = true;

                //check totals & determine winner
                let playerSum = player.calculateSum();
                let dealerSum = dealer.calculateSum();

                if(dealerSum > 21 ||
                    (playerSum <= 21 && (playerSum > dealerSum || playerSum == dealerSum))){
                        winner = "You";

                        isGameOver = true;
                        player.winBet(bet);
                        displayWalletAmount(player.getWallet());
                        clearBetAmount();
                }

                if(playerSum > 21 || 
                    (dealerSum <= 21 && dealerSum > playerSum)){
                    winner = "Dealer";

                    isGameOver = true;
                    player.loseBet(bet);
                    displayWalletAmount(player.getWallet());
                    clearBetAmount();
                }
                gameMsg.innerHTML = winner + " won! Place another bet to play again.";
            }
        });
    }

    function resetGame(bet, player, dealer){
        player.clearHand();
        dealer.clearHand();
        isGameOver = false;
        playGame(bet);
    }
}

function dealOutCards(player, dealer){

    let deck = new Deck();
    let cards = deck.getCards;

    // give two cards to player and dealer
    for(let i=0; i<2; i++){
        // shift method will handle removing card from deck 
        // & returns card obj that we can then add to deck
        player.addCardToHand(cards.shift());
        dealer.addCardToHand(cards.shift());
    }
    return deck;
}

function displayCards(person){
    var location;

    if(person instanceof Player){
        location = "player-cards"
    }

    if(person instanceof Dealer){
        location = "dealer-cards";
    }

    // ensure area is cleared before displaying cards
    var div = document.getElementById(location);
    div.innerHTML="";

    for(let i=0; i<person.getHand.length; i++){
        let currCard = person.getHand[i]

        // creating card div
        let cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card");

        // creating div for card content
        let cardDivContent = document.createElement("div");

        // adding suit image to card content
        let suitImage = new Image();
        suitImage.src = "images/"+ currCard.getSuit + ".png";
        cardDivContent.appendChild(suitImage);

        // adding number to card content
        let numberElement = document.createElement("p");
        let number = document.createTextNode(currCard.getValue);
        numberElement.appendChild(number);

        // appending card content to card
        cardDivContent.appendChild(numberElement);
        cardDiv.appendChild(cardDivContent);
        
        // appending card to display area
        div.appendChild(cardDiv);
    }

    if(person instanceof Dealer){
        let lastDealerCardDiv = div.lastElementChild;
        let lastCardContent = lastDealerCardDiv.lastElementChild;
        lastCardContent.setAttribute("class","blur");
    }
}

function revealDealerLastCard(){
    let div = document.getElementById("dealer-cards").lastElementChild;
    let target = div.lastElementChild.removeAttribute("class", "blur");
}

function clearCards(){
    var dealerCards = document.getElementById("dealer-cards");
    dealerCards.innerHTML = "";

    var playerCards = document.getElementById("player-cards");
    playerCards.innerHTML = "";
}

function displayWalletAmount(amount){
    walletAmount.innerHTML = amount;
}

function clearBetAmount(){
    betAmount.innerHTML = "";
}

function clearMsg(){
    gameMsg.innerHTML = "";
}