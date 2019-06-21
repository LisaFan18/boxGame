# boxGame

This project implements a simple box game which two players can play together from two different browsers.   
[node.js](https://nodejs.org/en/), [javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [canvas](https://www.html5canvastutorials.com/) are used in this project. 

# how to start
## step1: download codes
git clone https://github.com/LisaFan18/boxGame  
cd boxGame
## step2: install dependencies and start server
* npm install        
* node socketServer (start server)  

## step3: play game
1. Open ./public/index.html file in two different browers or browser tabs;  
2. Click the "Apply for a Match" to choose a player as your competitor, 
3. The player whose status is "My turn" plays first and can click a box,
4. Then the player can click the box only after his competitor has clicked a different box,
5. Two players take turns to click boxes until all boxes are clicked,
6. Finally the game will show who is the winner,
7. refresh the browser to restart a game. 

## Possible Errors on Ubuntu 16.04
### Errors
if you run it on Ubuntu 16.04 and you install nodejs by "sudo apt install nodejs", you might run into the below error:
 SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode #264
I tried all method in this [link](https://github.com/JeffreyWay/laravel-mix/issues/264) and it didn't work out for me. 

### Reasons
if you run "node -v", it returns "v4.2.6". This version is too old as the project can run successfully on my Macbook. node version is v12.4.0 on my Macbook.

### Solution
Follow this [instuction](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages), install the Official Node.js binary distributions which are provided by NodeSource by run the below commands.

```shell
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```
