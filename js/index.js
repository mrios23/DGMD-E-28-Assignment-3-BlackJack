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

    // Player specific methods
    winBet(bet){
        this.wallet = this.wallet + bet;
    }

    loseBet(){
        this.wallet = this.wallet - bet;
    }

    getWallet(){
        return this.wallet;
    }
}

// class BlackJackGame{
//     dealer; player; deck;

//     constructor(dealer, player, deck){
//         this.dealer = dealer;
//         this.player = player;
//         this.deck = deck;
//     }
    
//     allCards = this.deck.getCards;
//     cardCount = this.deck.getCards.length;
//     isGameOver = false;
//     winner = "";


//     dealOutCards(){
//         // give two cards to player from deck
//         this.player.addCardToHand(allCards[0]);
//         this.player.addCardToHand(allCards[1]);

//         // give two cards to dealer from deck
//         this.dealer.addCardToHand(allCards[2]);
//         this.dealer.addCardToHand(allCards[3]);
        
//         this.cardCount -= 4;
//     }

//     play(){

//         console.log(deck)
//         // this.dealOutCards();

//         // console.log("Dealer cards are: ");
//         // console.log(this.dealer.getHand);

//         // console.log("Player cards are: ");
//         // console.log(this.player.getHand);

//         // prompt user if they want to hit

//         // if they want to hit - give them another card

//         // repeat until user says no

//         // check dealer status
//         // hit dealer if needed

//         // once user and dealer is done with cards

//         // calculate sum to determine winner
//         // dealerSum = dealer.calculateSum();
//         // playerSum = player.calculateSum();


//         // update user bet

//     }
// }

window.onload = () => {
    // let deck = new Deck();
    let dealer = new Dealer();
    let player = new Player(100);
    // let game = new BlackJackGame(dealer, player, deck);

    /************ Game Logic ************/

    // deal out cards to player and dealer
    // deck = remaining deck after initial 4 are dealt out
    let deck = dealOutCards(player, dealer);
    let isGameOver = false;

    // create elements for player cards
    displayCards(player);

    // create elements for dealer cards
    displayCards(dealer);

    // create onclick to handle hit
    const hitBtn = document.getElementById("hit");

    hitBtn.addEventListener("click", ()=>{
        player.addCardToHand(deck.getCards.shift());
        displayCards(player);

        let playerSum = player.calculateSum();
        if(playerSum > 21){
            // end game
            isGameOver = true;
            revealDealerLastCard();
            gameMsg.innerHTML = "BUST! The winner is dealer" ;

        }
    });

    // create variable for winner
    var winner;
    const gameMsg = document.getElementById("message");

    // create onclick to handle stay
    const stayBtn = document.getElementById("stay");

    stayBtn.addEventListener("click", ()=>{
        console.log("User is going to stay");
        // add logic for dealer to hit or stay
        let dealerDecision = dealer.checkIfDealerShouldHit();

        while(dealerDecision == true){
            dealer.addCardToHand(deck.getCards.shift());
            displayCards(dealer);

            dealerDecision = dealer.checkIfDealerShouldHit();
        }

        if(dealerDecision == false){
            console.log("dealer is staying... lets take a look at the totals");

            revealDealerLastCard();

            isGameOver = true;

            //check totals & determine winner
            let playerSum = player.calculateSum();
            let dealerSum = dealer.calculateSum();

            console.log("Player final sum: " + player.calculateSum());
            console.log("Dealer final sum: " + dealer.calculateSum());

            /*  winning conditions
                    if dealer sum is not greater than 21
                        dealer sum > player sum -> dealer
                    player sum > 21 -> dealer

                    if player sum is not greater than 21
                        player sum > dealer sum -> player
                        player sum == dealer sum -> player
                    dealer sum > 21 -> player
            */

            if(dealerSum > 21 ||
                (playerSum <= 21 && (playerSum > dealerSum || playerSum == dealerSum))){
                    winner = "player";
            }

            if(playerSum > 21 || 
                (dealerSum <= 21 && dealerSum > playerSum)){
                winner = "dealer";
            }

            gameMsg.innerHTML = "The winner is " + winner;
        }

    });
    
    console.log("Player initial sum: " + player.calculateSum());
    console.log("Dealer initial sum: " + dealer.calculateSum());
    
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

    var div = document.getElementById(location);

    // ensure area is cleared before displaying cards
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
