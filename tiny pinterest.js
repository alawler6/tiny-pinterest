/*
Tiny Pinterest
Created by Andrew Lawler

The goal here is to take an array of image URLs and display the images as 'cards' on a dynamically sized board. The cards have a fixed width, but can size up their height dependent on image dimensions.

The main focus of this exercise is to create a sorting function that waits for each image to load and then places its card at the highest available spot on the board, taking into account the heights of other cards already placed above it.

Tiny Pinterest places cards on the board according to image load time -- the first image to load gets placed first, and so forth.
*/

const card_width = 55;
const card_height_min = 45;
const card_height_max = 165;
const card_margin = 5;
const card_padding = 5;

let cards = [];
let images_loaded = 0;
/*
This variable will hold the rendered width of a card. All cards will share this value.
*/
let card_offset_width = 0;
//This variable sets the number of columns of cards to show on the board.
let num_cols_master = 10;

//List of random image URLs to display
let image_sources = ['https://www.atlantisbahamas.com/media/Things%20To%20Do/Water%20Park/Beaches/Hero/Experiences_Beach.jpg', 'https://www.popsci.com/sites/popsci.com/files/styles/1000_1x_/public/images/2018/07/beach-sand-shell.jpg?itok=im_hB8tz&fc=30,68','http://www.kairalinewsonline.com/wp-content/uploads/2017/11/Footprints-in-the-Sand-Poem.jpg','https://www.telegraph.co.uk/content/dam/Travel/2017/February/europe-beaches-Playa%20de%20Muro%20Beach-AP.jpg','https://s3.amazonaws.com/crowdriff-media/full/7b710f5acec02e3d721b3b71ce5b5add76807e6ba4ea5b71d049cbc25fdddcf7.jpg','https://www.hiltonheadisland.org/sites/default/files/2018-02/beaches_video.jpg','http://boulgerfuneralhome.com/wp-content/uploads/2017/07/sunset-beach-north-carolina-inns-thesunsetinn-photo.jpg','https://i.pinimg.com/originals/64/5d/fe/645dfeb230f62af9c8ff1f6c70e4cacc.jpg','https://i.pinimg.com/originals/4b/73/4f/4b734faf3c2a2014ff0f764b851da14b.jpg','https://www.croatiaweek.com/wp-content/uploads/2018/02/Prapratno.jpg?x46277','https://images.mentalfloss.com/sites/default/files/styles/mf_image_16x9/public/29007-istock-642987348_0.jpg?itok=zjenzqTF&resize=1100x1100','https://www.telegraph.co.uk/content/dam/Travel/Destinations/Caribbean/Antigua/antigua-beaches-Jumby-Bay.jpg?imwidth=450','https://wallpapershome.com/images/pages/pic_v/452.jpg','https://www.cairnsholidayspecialists.com.au/shared_resources/media/190EAKufw9yKSE_1024x678.jpg','https://imagesvc.timeincapp.com/v3/mm/image?url=https%3A%2F%2Fpeopledotcom.files.wordpress.com%2F2018%2F07%2Fgettyimages-821738092.jpg%3Fw%3D2000&w=700&c=sc&poi=face&q=85','http://odonocuida.pt/wp-content/uploads/2017/05/praia-em-viana-do-castelo-para-c%C3%A3es.jpg','https://cdn.sandals.com/sandals/v12/images/resorts/slu/home/main-slider/beach-ocean-beach-chairs.jpg','https://www.gotobermuda.com/sites/default/files/styles/hero/public/head-horseshoe-bay.jpg?itok=TScK839c','https://www.gohawaii.com/sites/default/files/styles/double_column_large/public/content-images/Makena%20Beach-Maui.jpg?itok=bMWe-LVZ','https://amp.businessinsider.com/images/591b97e5144293eb038b5fe0-750-562.jpg','https://timedotcom.files.wordpress.com/2018/05/180511-best-beach-vacations-domestic-glen-arbor.jpg','http://static.asiawebdirect.com/m/phuket/portals/phuket-com/homepage/island/beaches/pagePropertiesImage/phuket-beaches.jpg.jpg','https://e3.365dm.com/18/07/1096x616/skynews-fernandina-beach-florida_4361846.jpg?20180714151959','https://www.thelocal.se/userdata/images/article/6acdcf623d5bb34ead7a8441f366b57841bb8010ee5eb51b827c8dbabbbb70d6.jpg','http://cdn.cnn.com/cnnnext/dam/assets/160413160609-05-bali-bingin-beach-super-tease.jpg','https://www.traveldudes.org/sites/default/files/beaches.jpeg','https://trustedpartner.azureedge.net/images/palmbeachatlanticuniversity2015/HomepageMedia/2107182E-0627-E784-74F42576BBFE1152/Web_DeSaturatedf_8_2017_A295_Clock_Tower_at_Palm_Beach_Island_Worth_Avenue_Original_Kimo_WIZHSOIR.jpg'];

//Main function
window.onload = setupBoard();

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
  	//Make card visible
  	card.style.visibility = 'visible';
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

function getBoardWidth() {
	/*
	Board width is dictated by the number of columns of cards allowed. The formula below calculates total card offset width by summing card_width, 2 * card_padding, and 2 * border width @ 1px each. Then it multiplies that by num_cols_master, adds the margin between each card (card_margin), and finally, adds 1 extra card_margin to separate the final column from the right side border of the board.
  */
	return (((card_width + (card_padding * 2) + 2) * num_cols_master) + (card_margin * (num_cols_master + 1))).toString() + 'px';
}

function getViewPanePos() {
	return (board.offsetWidth + (card_margin * 2)).toString() + 'px';
}

function resizeCard(image) {
  let desc = image.parentElement.getElementsByClassName('description')[0];

  //Set card height based on image and description height
  image.parentElement.style.height = (Math.max(image.offsetHeight, card_height_min) + desc.offsetHeight).toString() + 'px';

  //Print image height to card's description
  desc.innerHTML = 'Card ' + (images_loaded + 1).toString() + '</br>h: ' + image.parentElement.offsetHeight.toString() + 'px';
}

function setupBoard() {
  //Create and position board (card container)
  let board = document.createElement('div');
  board.id = 'board';
  board.style.width = getBoardWidth();
  document.body.appendChild(board);

  //Create board title
  let title = document.createElement('h1');
  title.id = 'title';
  title.innerHTML = 'Tiny Pinterest';
  title.style.width = board.offsetWidth.toString() + 'px';
  document.body.appendChild(title);

  //Create and position loader
  let loader = document.createElement('div');
  loader.id = 'loader';
  loader.style.width = board.offsetWidth.toString() + 'px';
  loader.innerHTML = 'Loading...';
  loader.style.top = (title.offsetHeight + (board.offsetHeight / 2)).toString() + 'px';
  document.body.appendChild(loader);

  //Create and position view pane
  let view_pane = document.createElement('div');
  view_pane.id = 'view_pane';
  view_pane.style.left = getViewPanePos();
  document.body.appendChild(view_pane);

  //Create, label, position and populate column select drop-down
  let col_select_label = document.createElement('div');
  col_select_label.id = 'col_select_label';
  col_select_label.innerHTML = 'Columns';
  col_select_label.style.left = (board.offsetWidth - 130).toString() + 'px';
  document.body.appendChild(col_select_label);
  let col_select = document.createElement('select');
  //Create array of selectable values
  let col_values = ['4', '5', '6', '7', '8', '9', '10'];
  col_select.id = 'col_select';
  col_select.style.left = (board.offsetWidth - 84).toString() + 'px';
  document.body.appendChild(col_select);
  col_values.forEach(val => {
  	let option = document.createElement('option');
  	option.value = val;
  	option.text = val;
  	col_select.appendChild(option);
  });
  //Select 10 columns by default
  col_select.value = '10';
  col_select.onchange = function() {
  	num_cols_master = Number(col_select.value);
  	board.style.width = getBoardWidth();
  	dealCards();
  	view_pane.style.left = getViewPanePos();
  }

  //Create card for each image in image_sources
  image_sources.forEach(URL => {
    let card = document.createElement('div');
    card.className = 'card';
    card.style.width = (card_width).toString() + 'px';
    card.style.height = (card_height_min).toString() + 'px';
    card.style.visibility = 'hidden';
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
      //Update loader text with current image count
      document.getElementById('loader').innerHTML = 'Loading image ' + images_loaded.toString() + ' of ' + image_sources.length.toString() + '...';
      //Once all images are loaded, remove loader and deal cards
      if (images_loaded === image_sources.length) {
      	document.body.removeChild(document.getElementById('loader'));
      	dealCards();
      }
    }

    //Create card description
    let description = document.createElement('div');
    description.className = 'description';
    description.style.width = (card_width).toString() + 'px';
    description.style.height = '2em';

    image.src = URL;
    card.appendChild(image);
    card.appendChild(description);
  });
}
