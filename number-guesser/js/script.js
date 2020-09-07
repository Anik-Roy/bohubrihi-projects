let low = 1;
let high = 10;

let correctAns = Math.floor(Math.random()*(high-low)+low);

for(let i = 1; i <= 3; i++) {
    let choice = parseInt(prompt(`Enter a number between ${low} and ${high}: `), 10);

    if(choice < correctAns) {
        alert('Correct answer is smaller');
    } else if(choice > correctAns) {
        alert('Correct answer is greater');
    } else {
        alert('You win!');
        break;
    }
    if(i == 3) {
        alert('You lose!');
    }
}
