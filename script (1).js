class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  } //klasse voor een raster aanmaken(object) en zijn eigenschappen

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  } //de grootte van de cellen berekenen: de grootte van het canvas delen door het aantal kolommen. Dus je krijgt dan één cel

  teken() {
    push();
    noFill();
    stroke('grey'); //raster tekenen
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      } //de aantal rijen en kolommen introduceren door één rij/kollom te vermideigvuldigen met de celgrootte
    }
    pop(); //je slaat hier de eigenschappen op en zet ze aan de kant
  }
}

class Jos {
  constructor() {
    this.x = 0;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.levens = 3; //het object Jos aanmaken en zijn eigenschappen
    this.sound = loadSound("sounds/hks1.wav"); //geluid word uit de library
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2; //Jos naar links bewegen met 'A'
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1; //Jos naar rechts bewegen 'D'
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4; //Jos naar boven bewegen 'W'
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5; //Jos naar beneden bewegen 'S'
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte); 
    //zorgen dat Jos niet uit de canvas kan bewegen

    if (this.x == canvas.width) {
      this.gehaald = true; //een command toevoegen die inhoudt dat als Jos de eindpositie(einde van de canvas) bereikt is, dan heeft hij gewonnen(true)
    }
  }
  eet(appel1) {
    if (this.x == appel1.x && this.y == appel1.y) {
      return true; //als Jos en appel1 coördinaten gelijk zijn eet Jos de appel
    }
    else {
      return false; //en anders eet hij geen appel
    }
  }
  wordtGeraakt(vijand) {
     if (this.x == vijand.x && this.y == vijand.y) {
       return true; //als Jos en vijand coördinaten gelijk zijn, dan wordt hij geraakt
         }
         else {
           return false; //en anders word Jos niet geraakt
         }
  }
  opgeblazen(bommen) {
    const josRasterX = floor(this.x / raster.celGrootte); 
    const josRasterY = floor(this.y / raster.celGrootte);

    for (let i = bommen.length - 1; i >= 0; i--) {
      let bom = bommen[i];
      const bomRasterX = floor(bom.x / raster.celGrootte);
      const bomRasterY = floor(bom.y / raster.celGrootte);
      // dit zorgt ervoor dat de hits worden geregistreerd terwijl ze niet volgens het raster bewegen
      if (josRasterX === bomRasterX && josRasterY === bomRasterY) {
        bommen.splice(i, 1);  
        // haalt de bom uit de array
        this.levens -= 1;      
        return true;
      }
    }
    return false;
  }
  
  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  } //Jos in het scherm tonen
}

class Appel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.snelheidx = raster.celGrootte;
    this.snelheidy = raster.celGrootte;
    this.sprite = null;
    this.stapGrootte = null;
    this.gegeten = null; 
  } //het object appel aanmaken en zijn eigenschappen


  beweeg() {
    this.x += this.snelheidx;
    this.y += this.snelheidy; //appel1 laten bewegen

    
    if (this.x <= 0 || this.x >= canvas.width - raster.celGrootte) {
      this.snelheidx *= -1;  //als appel1 de rand raakt, dan draait hij om en beweegt schuin
    }
    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.snelheidy *= -1;  //als appel1 de rand raakt, dan draait hij om en beweegt schuin

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
    //zorgen dat appel1 niet uit de canvas kan bewegen
    }
  }
  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  } //appel1 in het scherm tonen
}


class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  } //het object Vijand en zijn eigenschappen introduceren

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;
    //de Vijand beweegt random tussen -1 en 2 alle kanten op. Floor rond het getal af naar beneden en vermedigvuldigen met stapgrootte houd hem in een cel.
    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  } //de Vijand kan niet uit de canvas bewegen

   toon() {
      image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
    } //de Vijand in het scherm tonen
}
class Bom {
  constructor(x, y, snelheidy) {
    this.x = x;
    this.y = y;
    this.sprite = loadImage("images/sprites/bom.png");
    this.snelheidy = snelheidy;  // Snelheid wordt correct ingesteld
  }

  beweeg() {
    this.y += this.snelheidy; // Bom beweegt naar beneden

    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.snelheidy *= -1;  // Als de bom de boven- of onderkant van de canvas raakt, keert hij om
    }
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte); // Zorgt ervoor dat de bom binnen het canvas blijft
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte); // Toont de bom op het canvas
  }
}



function setup() {
  canvas = createCanvas(900, 600); //canvas proporties
  canvas.parent();
  frameRate(10); 
  textFont("Verdana");
  textSize(20);
  //framerate, textfont en textsize waardes geven
  raster = new Raster(12, 18);

  raster.berekenCelGrootte();

  eve = new Jos(); //eve aanmaken uit de eigenschappen van het object Jos
  eve.stapGrootte = 1 * raster.celGrootte; //eve beweegt per cel
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png"); //alle frames van Eve in een array zetten en de sprites switchen dus op commando
    eve.animatie.push(frameEve); //toont eve
  } 
  appel1x = floor(random(0, 18)) * raster.celGrootte;
  appel1y = floor(random(0, 12)) * raster.celGrootte; //begincoördinaten van appel1 zijn ergens random in de canvas
  appel1 = new Appel(appel1x, appel1y); //appel1 aanmaken uit de eigenschappen van het object Appel1
  appel1.sprite = loadImage("images/sprites/appel_1.png"); //appel1 sprite
  appel1.gegeten = false; //appel1 begint als niet gegeten dus moet false zijn

  appel2x = floor(random(0, 18)) * raster.celGrootte;
  appel2y = floor(random(0, 12)) * raster.celGrootte; //begincoördinaten van appel2 zijn ergens random in de canvas
  appel2 = new Appel(appel2x, appel2y); //appel2 aanmaken uit de eigenschappen van het object Appel2
  appel2.sprite = loadImage("images/sprites/appel_2.png"); //appel2 sprite
  appel2.gegeten = false; //appel2 begint als niet gegeten dus moet false zijn
  
  alice = new Vijand(700,200); //alice is de Vijand en word aangemaakt uit de eigenschappen van het object Vijand
  alice.stapGrootte = 1*eve.stapGrootte; //alice beweegt per cel
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png"); //alice spirte

  bob = new Vijand(600,400); //bob is de Vijand en word aangemaakt uit de eigenschappen van het object Vijand
  bob.stapGrootte = 1*eve.stapGrootte; //bob beweegr per cel
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  //bob sprite

bommen = [];
  var bommenmaken = [
  {x: floor(random(9, 18)) * raster.celGrootte, y: floor(random(0, 12)) * raster.celGrootte, snelheidy: 40},
  {x: floor(random(9, 18)) * raster.celGrootte, y: floor(random(0, 12)) * raster.celGrootte, snelheidy: 5},
  {x: floor(random(9, 18)) * raster.celGrootte, y: floor(random(0, 12)) * raster.celGrootte, snelheidy: 30},
  {x: floor(random(9, 18)) * raster.celGrootte, y: floor(random(0, 12)) * raster.celGrootte, snelheidy: 20},
  {x: floor(random(9, 18)) * raster.celGrootte, y: floor(random(0, 12)) * raster.celGrootte, snelheidy: 10},
]; //bommen worden aangemaakt uit de eigenshappen van het object Bom. De bommen worden in een array gezet. De coördinaten en snelheden worden random gekozen.

for (var data of bommenmaken) {
  bommen.push(new Bom(data.x, data.y, data.snelheidy));
} // gegevens van bom worden gepusht
}

function draw() {
  background('white'); //achtergrond is wit
  
  if (mouseX <= raster.celGrootte || mouseY <= raster.celGrootte) {
    background('khaki');
    //als je met de muis over de oranje vakjes hovert verandert de achtergrond
  } 
  fill('orange') //oranje vakjes
  rect(0,0,raster.celGrootte,raster.aantalRijen * raster.celGrootte);
  rect(0,0,raster.aantalKolommen * raster.celGrootte,raster.celGrootte); //vakjes proporties 

  raster.teken();
  eve.beweeg();
  eve.toon();
  alice.toon();
  alice.beweeg();
  bob.toon();
  bob.beweeg(); //alle eigenschappen van eve, alice, bob en raster worden in stand gebracht
  
  for (let bom of bommen) {
    bom.beweeg();
    bom.toon(); //bommen tonen in het scherm
  }
  
  if (appel1.gegeten == false){
  appel1.beweeg();
  appel1.toon(); //als appel1 ongegeten is blijt hij op het scherm en blijft hij bewegen
  }
  if (appel2.gegeten == false){
  appel2.toon(); //als appel2 ongegeten is blijt hij op het scherm
 }

  fill('black')
  text("Levens: " + eve.levens, 0, 30); //levens op het scherm tonen
  
  if (eve.eet(appel1)) {
    eve.levens += 1;
    appel1.gegeten = true;
    appel1.x = -raster.celGrootte;
    appel1.y = -raster.celGrootte; //als eve appel1 eet, dan krijgt hij een leven en de appel verdwijnt
  }
  if (eve.eet(appel2)) {
    eve.levens += 1;
    appel2.gegeten = true; //als eve appel2 eet, dan verhoogt hij zijn levens met 1 en de appel verdwijnt
    appel2.x = -raster.celGrootte;
    appel2.y = -raster.celGrootte;
  }
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    eve.levens -= 1; //als eve bob of alice raakt gaat er een leven vanaf
  }

  if (eve.opgeblazen(bommen)) {
    eve.sound.play(); //er speelt een geluid wanneer eve geraakt wordt door een bom
  }
  if (eve.levens == 0) {
    textSize(90);
    background('red');
    fill('white');
    text("Je  hebt verloren!", 30, 300)
    noLoop(); //als je levens op zijn (0)
  }

  if (eve.gehaald) {
    textSize(90);
    background('green');
    fill('white');
    text("Je hebt gewonnen!", 30, 300);
    noLoop(); //er komt een groen scherm tevoorschijn zodra je het spel hebt gewonnen en dan stopt alle code
  }
}

