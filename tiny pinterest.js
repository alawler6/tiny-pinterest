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
const preview_width_max = 370;
const preview_height_max = 220;

let cards = [];
let images_loaded = 0;
/*
This variable will hold the full rendered width of a card. All cards will share this value.
*/
let card_offset_width = 0;
//This variable sets the number of columns of cards to show on the board.
let num_cols_master = 10;
let current_card_index = 0;

//List of random image URLs to display
let image_sources = [
	'https://media.gettyimages.com/photos/japan-mie-prefecture-shirahama-beach-beach-umbrellas-on-beach-picture-id76014058?s=612x612',
	'https://media.gettyimages.com/photos/beach-sunset-picture-id173250862?s=612x612',
	'https://www.sydney.com/sites/sydney/files/styles/seasonal_mobile/public/2018-02/Where-to-Stay_5.jpg?itok=aWidPUvh',
	'https://media.gettyimages.com/photos/hawaii-oahu-sunset-beach-solitary-footprints-on-sandy-beach-incoming-picture-id177839178?s=612x612',
	'https://www.beaches.com/assets/img/destinations/jm-resort-negril.jpg',
	'https://media.gettyimages.com/photos/carefree-woman-swinging-above-the-sea-at-sunset-beach-picture-id538024696?s=612x612',
	'https://media.gettyimages.com/photos/delaware-water-gap-picture-id157606961?s=612x612',
	'https://media.gettyimages.com/photos/kaanapali-beach-and-resort-hotels-on-maui-hawaii-picture-id518466144?s=612x612',
	'https://res.cloudinary.com/gray-malin/image/fetch/c_scale,q_50,w_450/https://s3.amazonaws.com/gray-malin/products/Positano-Beach-Vertical.jpg',
	'https://s3.amazonaws.com/crowdriff-media/full/9e84e7a84a4a54c02ba063b58e0578ee4affe7eb6a8e0161b6dd2de4a6ef2c15.jpg',
	'https://media.gettyimages.com/photos/drone-flying-over-hills-close-to-lanikai-white-sand-beach-picture-id897863310?s=612x612',
	'https://media.gettyimages.com/photos/buildings-by-sea-at-laguna-beach-picture-id755743675?s=612x612',
	'https://media.gettyimages.com/photos/panama-city-beach-florida-resort-skyline-picture-id98154309',
	'https://www.tarragonaturisme.cat/sites/default/files/styles/side_images/public/pagina/side-gallery/1706920611tamarit-3672.jpg?itok=5yi6Mp_E',
	'https://image.shutterstock.com/image-photo/beach-lounger-on-sand-web-260nw-544449145.jpg',
	'https://i.etsystatic.com/6377154/r/il/b8a9bf/456500882/il_570xN.456500882_4g22.jpg',
	'https://media.gettyimages.com/photos/open-water-swimming-picture-id564171879?s=612x612',
	'https://media.gettyimages.com/photos/boundary-waters-canoe-area-picture-id1030413096?s=612x612',
	'https://media.gettyimages.com/photos/water-surface-picture-id185323659?s=612x612',
	'https://1dib1q3k1s3e11a5av3bhlnb-wpengine.netdna-ssl.com/wp-content/uploads/2013/12/la-concha-san-sebastian.jpg',
	'https://media.gettyimages.com/photos/delaware-water-gap-monroe-county-pennsylvania-usa-circa-1900-view-of-picture-id1055134840?s=612x612',
	'https://media.gettyimages.com/photos/water-hyacinth-in-reservoir-and-mountain-reflection-on-water-picture-id953165034?s=612x612',
	'https://media.gettyimages.com/photos/brown-bear-in-water-hunting-brooks-river-katmai-national-park-alaska-picture-id1057868990?s=612x612',
	'https://media.gettyimages.com/photos/view-of-nakhi-ghat-as-ganga-river-water-continues-to-swell-on-11-in-picture-id1031578452?s=612x612',
	'https://xinhaidude.files.wordpress.com/2017/11/2017_ogunquit_droning_a200-flying-a-delta-kite-at-ogunquit-beach-img_8839.jpg?w=400&h=533',
	'https://media.gettyimages.com/photos/dolphin-jump-up-the-water-picture-id560954145',
	'https://media.gettyimages.com/photos/coconut-floating-in-tropical-waters-palm-tree-beach-picture-id165843697?s=612x612'];
let image_not_found_source = 'https://tatainnoverse.com/images/4eoors.jpg';

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

function getPreviewPanePos() {
	return (board.offsetWidth + (card_margin * 2)).toString() + 'px';
}

function onInput() {
	if (document.getElementById('btn_save').disabled) {
		document.getElementById('btn_save').disabled = false;
	}
}

function resizeCard(image) {
  let desc = image.parentElement.querySelector('.description');

  //Set card height based on image and description height
  image.parentElement.style.height = (Math.max(image.offsetHeight, card_height_min) + desc.offsetHeight).toString() + 'px';

  if(!image.error){
  //Set card description_text property, and print card height to description
	  image.parentElement.description_text = 'Card ' + (images_loaded + 1).toString() + '</br>h: ' + image.parentElement.offsetHeight.toString() + 'px';
	  desc.innerHTML = image.parentElement.description_text;
	} else {
		image.parentElement.description_text = '404 - Image not found'
		desc.innerHTML = '(404)';
	}
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

  //Create and position preview pane and associated elements
  let preview_pane = document.createElement('div');
  preview_pane.id = 'preview_pane';
  preview_pane.style.left = getPreviewPanePos();
  document.body.appendChild(preview_pane);
  //This variable will be a larger copy of a clicked card's image
  let preview = new Image();
  preview.id = 'preview';
  document.getElementById('preview_pane').appendChild(preview);
  let preview_description = document.createElement('textarea');
  preview_description.id = 'preview_description';
  preview_description.addEventListener('input', onInput)
  document.getElementById('preview_pane').appendChild(preview_description);
  let preview_title = document.createElement('div');
  preview_title.id = 'preview_title';
  preview_title.innerHTML = 'Selected card';
  document.getElementById('preview_pane').appendChild(preview_title);
  let btn_save = document.createElement('input');
  btn_save.type = 'button';
  btn_save.id = 'btn_save';
  btn_save.value = 'Save';
  btn_save.onclick = function() {updateCard()};
  btn_save.disabled = true;
  document.getElementById('preview_pane').appendChild(btn_save);

  //Create, label, position and populate column select drop-down
  let col_select_label = document.createElement('div');
  col_select_label.id = 'col_select_label';
  col_select_label.innerHTML = 'Columns';
  document.body.appendChild(col_select_label);
  let col_select = document.createElement('select');
  //Create array of selectable values
  let col_values = ['4', '5', '6', '7', '8', '9', '10'];
  col_select.id = 'col_select';
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
  	preview_pane.style.left = getPreviewPanePos();
  }

  //Create card for each image in image_sources
  image_sources.forEach(URL => {
    let card = document.createElement('div');
    card.className = 'card';
    card.style.width = (card_width).toString() + 'px';
    card.style.height = (card_height_min).toString() + 'px';
    /*
    Use anonymous function to set viewImage call with param, but without evaluating it
    */
    card.onclick = function() {viewImage(card)};
    card.style.visibility = 'hidden';
    document.getElementById('board').appendChild(card);

    let image = new Image();
    image.className = 'image';
    //Resize card after image loads
    image.onload = function() {
      this.style.display = 'inline';

      //Resize image if too wide
      if (this.offsetWidth > card_width) {
        this.style.width = card_width.toString() + 'px';
        this.style.height = 'auto';
      }

      //Check proportions to set orientation property
      if (this.offsetWidth > this.offsetHeight) {
        this.orientation = 'landscape';
      } else {
        this.orientation = 'portrait';
      }

      //Scale down very tall portrait images
      if (this.orientation === 'portrait') {
        this.style.height = (Math.min(card_height_max, this.offsetHeight)).toString() + 'px';
        this.style.width = 'auto';
      }
      resizeCard(this);
      cards.push(card);
      card_offset_width = card.offsetWidth;

      images_loaded += 1;
      /*
      This property will be referenced with the preview pane to determine where to save changes
      */
      card.card_index = images_loaded;
      //Update loader text with current image count
      document.getElementById('loader').innerHTML = 'Loading image ' + images_loaded.toString() + ' of ' + image_sources.length.toString() + '...';
      //Once all images are loaded, remove loader and deal cards
      if (images_loaded === image_sources.length) {
      	document.body.removeChild(document.getElementById('loader'));
      	col_select_label.style.visibility = 'visible';
      	col_select.style.visibility = 'visible';
      	dealCards();
      }
    }

    image.onerror = function() {
    	this.error = true;
    	this.src = image_not_found_source;
    	this.parentElement.querySelector('.description').innerHTML = '(404)';
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

function updateCard() {
	let card_to_update = cards[current_card_index - 1];
	let height = '</br>h: ' + card_to_update.offsetHeight.toString() + 'px';
	let new_description = document.getElementById('preview_description').value;
	let trimmed_description = new_description;

	if (new_description.length > 11) {
		trimmed_description = new_description.substring(0, 7) + '...'
	}

	if (new_description.length === 0) {
		trimmed_description = '---';
	}

	trimmed_description += height;
	card_to_update.description_text = new_description + height;
	card_to_update.querySelector('.description').innerHTML = trimmed_description;

	document.getElementById('btn_save').disabled = true;
}

function viewImage(card) {
	/*
	This function takes the image from a clicked card and copies a larger version of it into the preview pane, along with its description
	*/
	let preview_image = document.getElementById('preview');
	let preview_description = document.getElementById('preview_description');
	let preview_pane = document.getElementById('preview_pane');
	let card_image = card.querySelector('.image');
	let card_description = card.description_text;

	preview_image.src = card_image.src;
	current_card_index = card.card_index;

	//Image resizing for preview pane
	if (card_image.orientation === 'portrait') {
		//Portrait images only need to be resized by height
		preview_image.style.height = preview_height_max.toString() + 'px';
		preview_image.style.width = 'auto';
		preview_image.style.top = card_padding.toString() + 'px';
		preview_image.style.left = (card_padding + (preview_width_max - preview_image.offsetWidth) / 2) + 'px';
	} else {
		/*
		Landscape images, due to the fixed proportions of the preview pane, can still be too tall after being resized by width; these can therefore be scaled down by height as well.
		*/
		preview_image.style.width = preview_width_max.toString() + 'px';
		preview_image.style.height = 'auto';
		if (preview_image.offsetHeight > preview_height_max) {
			preview_image.style.height = preview_height_max.toString() + 'px';
			preview_image.style.width = 'auto';
		}

		//Image centering within preview pane
		preview_image.style.top = (card_padding + (preview_height_max - preview_image.offsetHeight) / 2).toString() + 'px';
		preview_image.style.left = (card_padding + (preview_width_max - preview_image.offsetWidth) / 2) + 'px';
	}

	//Print description to preview pane, not including card image height
	preview_description.value = card_description.split('<')[0];
	document.getElementById('btn_save').disabled = true;
}

/*
TODO:
- Add button and functionality to change image source URL
*/
