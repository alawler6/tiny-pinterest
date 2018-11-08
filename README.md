# Tiny Pinterest
Dynamic image gallery in vanilla JS & CSS. But very small.

See it in action: https://codepen.io/alawler6/pen/WYQQeq

The goal here is to take an array of image URLs and display the images as 
'cards' on a dynamically sized board. The cards have a fixed width, but can 
size up their height dependent on image dimensions.

The main focus of this exercise is to create a sorting function that waits for 
each image to load and then places its card at the highest available spot on 
the board, taking into account the heights of other cards already placed above 
it.

Tiny Pinterest places cards on the board according to image load time -- the 
first image to load gets placed first, and so forth.
