//creating the borders and the edges and the boundaries and stuff. Basically spacing

var margin=20; // the space between the edges of the svg
var header=180; //the offset from top to chart
var sidebarwidth=150;
var width=$(window).width()-margin;  //svg width
var height=2500; //svg height
var chartwidth=width-sidebarwidth; //space for sidebar on right
var charcolumn=110; //width of column for all the characters

//SVG elements
//SVG variable with the height, width and the background attrs
var svg = d3.select("body")
			.append("svg")
         .attr("width",width)
			.attr("height",height)
			.attr("style","background: #fffff");

//The title variable, a part of the svg with text at a specified x & y, with text "Marvel Movie Characters"
//with font size and other text formatting
var title = d3.select("svg")
         .append("text")
         .attr("x", "20px")
         .attr("y", "50px")
         .text("Marvel Movie Characters")
         .style("font-size", "40px")
         .style("color", "black")
         .style("text-align", "center")
         .style("letter-spacing", ".1em");

//GROUP VARIABLES
//Group svg elements with specific IDs initialized

var charactergroup=svg.append("g").attr("id","charactergroup");
var moviegroup=svg.append("g").attr("id","moviegroup");
var sidebargroup=svg.append("g").attr("id", "sidebargroup");
var timegroup=svg.append("g").attr("id","timegroup");

//DATA VARIABLE
//empty arrays initialized
var csvdata=[];
var characters=[];
var movies=[];


//Redundant function - not used as of now
function sortAlpha(a,b){
	if(a.charactername < b.charactername && a.moviename < b.moviename){
		return -1;
	}
}

//Sorting character names
function sortAlphaCharacter(a,b){
	if(a.charactername < b.charactername)
		return -1;
	else if(a.charactername > b.charactername)
		return 1;
	else
		return 0;
}

//Sorting movie names
function sortAlphaMovie(a,b){
	if(a.moviename < b.moviename)
		return -1;
	else if(a.moviename > b.moviename)
		return 1;
	else
		return 0;
}

d3.csv("characters.csv",function(data){ //d3.csv begin
       //For each element in the csv:

        data.forEach(function(d){ //ForEach function begin
         //format incoming data
         //create temp object
         var temp={
			   moviename: d.moviename,
			   charactername: d.charactername,
			   time: parseFloat(d.time)
		 };
		//make character and movie array

      //add the data to the csv data
      csvdata.push(temp);
      //csv data - len of the array must be the same as the elements in the csv

		var ctemp=d.charactername;
		var mtemp=d.moviename;

		var charfound=false;
		var moviefound=false;

		//appending each of the characters to the array of characters
        //also do not append duplicate entries

		for(var i=0;i<characters.length && !charfound;i++){
			if(ctemp==characters[i]){
				charfound=true;
			}
		}
		//if character not found add to list
		if(!charfound){
			characters.push(ctemp);
		}

		//the same procedure for movies as above
		for(var i=0;i<movies.length && !moviefound; i++){
			if(mtemp==movies[i]){
				moviefound=true;
			}
		}
		//if movie not found add to list
		if(!moviefound){
			movies.push(mtemp);
		}

   })//ForEach function end
    //at the end of this function, we have a list of characters, a list of movies and an array of all the elements in the csv

    //Sort movies array
    movies.sort();
    //Sort character array
    characters.sort();

    //sort csvdata array - the array of the characters.csv data
    csvdata.sort(sortAlphaCharacter);
    csvdata.sort(sortAlphaMovie);

	//VARIABLES
	var numberofcharacters =characters.length; //length of the character array
	var numberofmovies=movies.length; //length of the movie array

	//CREATE LABLES - Text representation of the character names

    //Select the charactergroup g element
    //the source of data is the characters list
    //on the horizontal axis
    //with a specified x pos
    //with an allocated y pos
    //the text is the element at a specific index of the character array
	var characterlabels = svg.selectAll("charactergroup")
					.data(characters)
					.enter()
					.append("text")
					.attr("x",margin/2)
					//change height to account for margin    divide by number of characters+1 for formating   offset iterator by 1     shift by half the margin for formating
					.attr("y",function(d,i){return ((height-margin-header)/(numberofcharacters+1)*(i+1)+margin/2+header);})
					.text(function(d,i){return characters[i];});

	//Select the moviegroup g element
    //the source of the data is the movie array
    ////the text is the element at a specific index of the movie array
    //translate function is used to specify the x and y co-ordinates
    //the text is rotated
	var movielabels=svg.selectAll("moviegroup")
					.data(movies)
					.enter()
					.append("text")
					.text(function(d,i){return movies[i];})
					.attr("transform", function (d,i) {
						var xText = ((chartwidth-180)/(numberofmovies+1)*(i+1)+charcolumn);
						var yText = header;
						return "translate(" + xText + "," + yText + ") rotate(-30)";
					});

    //CREATE TIMEBOXES
    //Time boxes are the svg rectangles used to represent the on screen time of the characters in movies
    //source of the data is character array
    //the x and y co-ordinates are obtained by operating on all the characters for each movie
    //constant width and height of the rectangles

   for (var j = 0; j < numberofmovies; j++) {
      var timeboxes = svg.selectAll("timegroup")
               .data(characters)
               .enter()
               .append("rect")
               .attr("x", function (d, i) {
                  return ((chartwidth-180)/(numberofmovies+1)*(j+1)+(charcolumn-20));
               })
               .attr("y", function (d, i) {
                  return ((height-margin-header)/(numberofcharacters+1)*(i+1)+margin/2+header);
               })
               .attr("width", 10)
               .attr("height", 10);
   }

      //DRAW LINES FOR ORGANIZATION
    //dislaying horizontal lines on the screen
    //the start x & y co-ordinates - x1 and y1 and the line end x & y co-ordinates - x2 and y2 are specified
    //the x1 and x2 attributes are the same
    //y1 and y2 vary from the header to header-margin

   var index = 0;
   var verticallines = svg.selectAll("moviegroup")
               .data(movies)
               .enter()
               .append("line")
               .attr("x1", function(d,i) {
                  index++;
                  return (chartwidth-180)/(numberofmovies+1)*(i+1)+(charcolumn-20);
               })
               .attr("y1", header)
               .attr("x2", function(d,i) {
                  return (chartwidth-180)/(numberofmovies+1)*(i+1)+(charcolumn-20);
               })
               .attr("y2", height-margin)
               .attr("stroke", "#737984");

    //Create the last line
    //THE last line :D
   var oneline = ["movie"];
   var lastline = svg.selectAll("moviegroup")
               .data(oneline)
               .enter()
               .append("line")
               .attr("x1", (chartwidth-180)/(numberofmovies+1)*(index+1)+(charcolumn-20))
               .attr("y1", header)
               .attr("x2", (chartwidth-180)/(numberofmovies+1)*(index+1)+(charcolumn-20))
               .attr("y2", height-margin)
               .attr("stroke", "#737984");


    //DRAW THE SIDEBAR
    //the x and y co-ordinates of the sidebar
   var sideX = width-sidebarwidth-70;
   var sideWidth = sidebarwidth-margin+70;
   //textX
   var textX = sideX+15;
   //the options displayed in the sidebar are in the filters
   var filters = ["alphabetical by character", "highest screentime", "movie release date", "chronological story order", "largest cast"];

    //TITLE
    //the heading of the sidebar
   var sidebarTitle=d3.select("svg")
               .append("text")
               .attr("x", textX)
               .attr("y", header+30)
               .text("filter by:")
               .style("font-style", "italic")
               .style("font-size", "18px");

   //filterNames is an svg element
   //source of the data the filter array
    //creates a html <a> attribute with ids as the filter names
    //a text element with the x co-ord as textX and allocated y co-ord is added to the svg element

   var filterNames=svg.selectAll("body")
               .data(filters)
               .enter()
               .append("a")
               .attr("id", function (d) { return d; })
               .append("text")
               .attr("x", textX)
               .attr("y", function (d, i) { return header+50+(i*20);})
               .text(function (d) { return d; });

   //interactivity on hovering over the filter names

   filterNames.on("click", function () {
                  //function to redraw the data
               })
               .on("mouseover", function(d,i) {
                  filterNames.style("cursor", "pointer")
                  d3.select(this).style("font-size", "14px");
               })
               .on("mouseout", function (d,i) {
                  d3.select(this).style("font-size", "13px");
               })

}) //d3.csv function end