# Overview

This is a small web app of a to-do list.
This app uses localStorage to store a list of task objects for later use, recursion to display each task, and the Day.js library to format and keep track of whether due dates have been passed. This list also includes subtasks you can add, which are displayed under their respective task and are able to be completed separately from the task itself.

I hadn't coded anything in JavaScript in around three years, so I thought that this project would be good both as a refresher on basic JS and as a way to learn some new techniques that would help me in the field. I'm still wrapping my head around recursion and I'm not sure if I've ever used JS libraries before, so this project was a very good opportunity to work on both of those.

[Software Demo Video](https://www.youtube.com/watch?v=dkgv_vb5jzY)
[The Web App Itself](https://dement-ontario.github.io/todo-list/)

# Development Environment

For writing code, I pretty much just used Visual Studio Code. VSCode's Live Server extension was very convenient for making a local web server that updated the site per save, and I used Google Chrome and its Dev Tools to interact with and debug the web app as I was making it.

The functionality of this web app was written in JavaScript with the Day.js library. HTML and CSS were used to display the contents of the app to the web page.

# Useful Websites

- [JavaScript tutorial](www.w3schools.com/Js/)
- [Day.js documentation](https://day.js.org/docs/en/installation/installation)
- [cdnjs (for loading Day.js)](https://cdnjs.com/)

# Future Work

- I had originally planned to make the displayTask function recurse through every subtask instead of displaying each subtask through a forEach loop, but I couldn't figure out how with the time I had given myself. If there's anything that I'll do later, it's this.
- Speaking of the displayTask function, I realized a lot of the code related to creating elements was very similar. I could probably make a function for the basic stuff and add the details in afterwards.
- The way I handled the parameters for how the markComplete function changes the color of late due dates from red to black on completion works for what it does, but it feels wrong and I'm not sure why. I'll need to figure that out.
- Some filtering and sorting would likely do this app a lot of good. I'm thinking filtering by completion and sorting by description and date.