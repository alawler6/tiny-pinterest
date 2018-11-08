/*
Tiny Pinterest
Created by Andrew Lawler

The goal here was to take an array of image URLs and display the images as 'cards' on a dynamically sized board. The cards have a fixed width, but can size up their height dependent on image dimensions.

The main focus of this exercise is to create a sorting function that waits for each image to load and then places its card at the highest available spot on the board, taking into account the heights of other cards already placed above it.

Tiny Pinterest places cards on the board according to image load time -- the first image to load gets placed first, and so forth.
*/

const card_width = 55;
const card_height_min = 45;
const card_height_max = 165;
const card_margin = 5;

let cards = [];
let images_loaded = 0;
/*
This variable will hold the rendered width of a card. All cards will share this value.
*/
let card_offset_width = 0;

//List of random image URLs to display
let image_sources = ['https://i.imgur.com/wOk1lav.jpg', 'https://i.imgur.com/AI5GnUp.jpg','https://i.imgur.com/xSP4WFz.jpg','https://i.imgur.com/TeLKUAo.png','https://i.imgur.com/4DfuYck.jpg','https://i.imgur.com/ZiEaZN4.jpg','https://i.imgur.com/pajumu3.jpg','https://i.imgur.com/amyNSse.jpg','https://i.imgur.com/t5D2c6U.jpg','https://i.imgur.com/XNAe9Jv.jpg','https://i.imgur.com/KqimNmQ.jpg','https://i.imgur.com/XXQRNTx.jpg','https://i.imgur.com/EkvaUDH.jpg','https://i.imgur.com/P2bEO4S.jpg','https://i.imgur.com/JQLz8NQ.jpg','https://i.imgur.com/qlUU3GL.jpg','https://i.imgur.com/I9Qu4qd.jpg','https://i.imgur.com/F1SCfMB.jpg','https://i.imgur.com/esVWN7n.jpg','https://i.imgur.com/0I0O353.jpg','https://i.imgur.com/B8Y55PO.jpg','https://i.imgur.com/xghWZvt.jpg','https://i.imgur.com/WvfL4Bh.jpg','https://i.imgur.com/raLy2l2.jpg','https://i.imgur.com/KbdBmcx.jpg','https://i.imgur.com/dlVb6rG.jpg','https://i.imgur.com/1vmh07A.jpg'];

//Main function
window.onload = function () {
  //Create card container
  let board = document.createElement('div');
  board.id = 'board';
  document.body.appendChild(board);

  //Create board title
  let title = document.createElement('h1');
  title.id = 'title';
  title.innerHTML = 'Tiny Pinterest'
  document.body.appendChild(title);

  //Create card for each image in image_sources
  image_sources.forEach(URL => {
    let card = document.createElement('div');
    card.className = 'card';
    card.style.width = (card_width).toString() + 'px';
    card.style.height = (card_height_min).toString() + 'px';
    document.getElementById('board').appendChild(card);

    let image = new Image();
    //Resize card after image loads
    image.onload = function () {
      this.style.display = 'inline';

      if (this.offsetWidth > card_width) {
        this.style.width = card_width.toString() + 'px';
        this.style.height = 'auto';
      }

      if (this.offsetWidth > this.offsetHeight) {
        this.orientation = 'landscape';
      } else {
        this.orientation = 'portrait';
      }

      if (this.orientation === 'portrait') {
        this.style.height = (Math.min(card_height_max, this.offsetHeight)).toString() + 'px';
        this.style.width = 'auto';
      }
      resizeCard(this);
      cards.push(card);
      card_offset_width = card.offsetWidth;

      images_loaded += 1;
      if (images_loaded === image_sources.length) dealCards();
    }

    //Create card description
    let description = document.createElement('div');
    description.className = 'description';
    description.style.width = (card_width).toString() + 'px';
    description.style.height = '2em';

    image.src = URL;

    //Hide image until loaded and resized
    image.style.display = 'none';

    card.appendChild(image);
    card.appendChild(description);
  });
}

function dealCards() {
  //Set number of card columns allowed by board width
  let num_cols = Math.max(Math.floor(document.getElementById('board').offsetWidth / (card_offset_width + card_margin)), 1);

  //Instantiate an array which will hold the next y positions for each column
  let col_positions = [];
  for (i = 0; i < num_cols; i++) {
    col_positions[i] = 0;
  }

  //Set x and y values for each card
  cards.forEach(card => {
    /*
    Get the earliest (leftmost) index of the lowest value element in col_positions. By comparing the y values in each column, we can determine which location will allow us to place the card "highest" on the board.
    */
    let index = col_positions.indexOf(Math.min(...col_positions));
    //Set card x value
    card.style.left = (card_margin + (index * (card_offset_width + card_margin))).toString() + 'px';
    //Set card y value
    card.style.top = (card_margin + col_positions[index]).toString() + 'px';
    col_positions[index] += card.offsetHeight + card_margin;
  });
}

function resizeCard(image) {
  let desc = image.parentElement.getElementsByClassName('description')[0];

  //Set card height based on image and description height
  image.parentElement.style.height = (Math.max(image.offsetHeight, card_height_min) + desc.offsetHeight).toString() + 'px';

  //Print image height to card's description
  desc.innerHTML = 'Card ' + (images_loaded + 1).toString() + '</br>h: ' + image.parentElement.offsetHeight.toString() + 'px';
}