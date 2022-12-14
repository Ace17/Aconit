/*
 * Fichier contenant les fonctions servant à la vérification 
 * des defis de multiplication et de division
 *
*/



var multplieur = 0;
var multiplicand = 0;
var dividende = 0;
var diviseur = 0;
var mutiplicationActif = false;
var divisionActif = false;
// Variable pour signaler que l'on a commencer la division
// Permet de savoir quand on peut/doit signaler les erreurs
// Repasse à faux sur reset et victoire
var dividendOK = false;

function getTotalisateur(){
    var temp = valNumAccu;
    var res = 0;
    for(var i = 0; i<12; i++){
        res+=(temp%10)*10**(11-i);
        temp = Math.floor(temp/ 10);
    }
    return res;
}

function getCompteur(){
    var temp = Math.abs(valNumCompteur);
    var res = 0;
    for(var i = 0; i<7; i++){
       res+=(temp%10)*10**(6-i);
       temp = Math.floor(temp/ 10);   
    }
    return res;
}

function getCurseur(){
	var res = 0;
	for(var i = 0; i<6; i++){
		res = (10*res) + positionCurseur[5-i]
	}
	return res ;
}
/*
 * Fonction qui gère la préparation de l'affichage du mode defi
 *
 * Cache principalement des éléments de l'interface
*/
function initDefi() {
	document.getElementById('boucle').checked = false ; // stop l'execution des exemples en boucle
	if (extractorWindow != null && extractorWindow.open) extractorWindow.close() ;
	
	var btnCalculette = document.getElementById('Calculette') ;
	var btnExtraction = document.getElementById('Extraction') ;
	var btnToutLesBoutons = document.getElementById('TousLesBoutons') ;
	var btnMultiplication = document.getElementById('Multiplication');
	var btnDivision = document.getElementById('Division');
	var msg = document.getElementById('Baniere');
	var baniere = document.getElementById('EnteteMult');
	var multiplier = document.getElementById("DefiMult");

	if(btnCalculette.style.display == 'none' && btnExtraction.style.display ==  'none'){
		btnCalculette.style.display = 'block';
		btnExtraction.style.display = 'block';
		btnToutLesBoutons.style.display =  'block';
		msg.style.display = 'block';
		baniere.style.display = 'none';
		btnMultiplication.style.display = 'none';
		btnDivision.style.display = 'none';
		multiplier.style.display = 'none';
	} else {
		btnCalculette.style.display =  'none';
		btnExtraction.style.display =  'none';
		btnToutLesBoutons.style.display =  'none';
		msg.style.display = 'none';
		baniere.style.display = 'block';
		btnMultiplication.style.display = 'block';
		btnDivision.style.display = 'block';
		multiplier.innerHTML = (language == 0) ? "Choisir Multiplication ou Division" : "Select Multiplication or Division" ;
		multiplier.style.display = 'block';
		document.getElementById("DefiMsg").innerHTML = "";
		var echell = 0.95 ; // grossir un peu
		vueChange(3.27051*echell, 22.62798*echell, -1.17702, -0.3148, 0.9482, -0.0448) ;
	}	
//console.log("position ", camera.position.x, camera.position.y, camera.position.z)
//console.log("rotation ",camera.rotation.x, camera.rotation.y, camera.rotation.z)
//console.log("up       ",camera.up.x, camera.up.y, camera.up.z)	
}

// remet l'arithmomètre dans la configuration initiale
function razArithmometre(){
	for(var i = 0; i<curseur.length; i++){
		curseur[i].position.x = 1.484 ;
		engrCompt[i].position.x = curseur[i].position.x + 0.1;
		cubeMesh[i].position.x = curseur[i].position.x + 0.2;
		positionCurseur[i] = 0 ;
	}
	SpitCurseurNum () ;
	for(var i = 0; i<compteur.length; i++){
		compteur[i].rotation.y = 0 ;
		Compteur[i] = 9 ;
		positionCompteur[i] = 0 ;
	}
	valNumCompteur = 0 ;
	for(var i = 0; i<accumulateur.length; i++){
		accumulateur[i].rotation.y = 0 ;
		positionAccu[i] = 0 ;
	}
	valNumAccu = 0 ;
	cubeMesh[8].position.z -= pivotChariot.position.z ;
	cubeMesh[9].position.z -= pivotChariot.position.z ;
	pivotChariot.position.z = 0 ;
	positionDecalage = 0 ;	
	if (RenverseurSurSous) {
		RenverseurSurSous = false ;
		plaque[0].position.x -= 0.185 ;
		barreAddSub.rotation.y += Math.PI/10 ;
		for(var i = 0; i<doubleEngrenage.length; i++){
			doubleEngrenage[i].position.x -= 0.185 ;
		}	
	}
	pivotChariot.rotation.z = 0 ;
	chariotOuvert = false ;

}

/*
 * Fonction qui initie le defi de multiplication
 * Il tire aléatoirement une multiplication, bornée à 1000 et 20 pour opérateurs respectifs
 * La limite de 20 est pour éviter que devoir tourner trop la manivelle
 * La fonction applique aussi un affichage
*/

function defiMultiplicatif(){
	window.defi = 1;
	window.defiMSG = 0; // messages en 2 langues dans "auxiliaire.js"
	var baniere = document.getElementById('EnteteMult');
	var multiplier = document.getElementById("DefiMult");
	multplieur = Math.floor(Math.random() * 1000) + 1;
	multiplicand = Math.floor(Math.random() * 40) + 9;
// multplieur = 4; multiplicand = 3 ; // pour mise au point
	document.getElementById("DefiMsg").innerHTML = "";
	multiplier.innerHTML = (language == 0) ? "Défi : multiplier "+multplieur+" par "+multiplicand : "Challenge : multiply "+multplieur+" by "+multiplicand;
	multiplier.style.display = 'block';
	baniere.style.display = 'block';
	mutiplicationActif = true;
	divisionActif = false;
	razArithmometre() ;
}

/*
 * Fonction qui initie le defi de division
 * Il tire aléatoirement une division, borné à 1000 et 20 pour opérateurs respectifs
 * La limite de 20 est pour éviter que devoir tourner trop la manivelle
 * La fonction applique aussi un affichage
*/

function defiDivision(){
	window.defi = 2;
	window.defiMSG = 0;
	dividende =  Math.floor(Math.random() * 1000) + 1;
	diviseur =  Math.floor(Math.random() * dividende/2) + 1;
	var baniere = document.getElementById('EnteteMult');
	var multiplier = document.getElementById("DefiMult");
	document.getElementById("DefiMsg").innerHTML = "";
	multiplier.innerHTML = (language == 0) ? "Défi : diviser "+dividende+" par "+diviseur : "Challenge : divide "+dividende+" by "+diviseur;
	multiplier.style.display = 'block';
	baniere.style.display = 'block';
	divisionActif = true;
	mutiplicationActif = false;
	dividendOK = false ;
	razArithmometre() ;
}



function defiInit(){   // appelé quand la manivelle a fait 1/2 tour
	var totalisateur = getTotalisateur() ;
	var kompteur = getCompteur() ;
	var msg = document.getElementById("DefiMsg");
	if(mutiplicationActif){
		msg.innerHTML = "" ;
		if (getCurseur() == multiplicand){ // echange multiplieur/multiplicand
			var chang = multplieur ;
			multplieur = multiplicand ;
			multiplicand = chang ;			
		}
		if(totalisateur == multiplicand*multplieur) {
			defiMSG = 3;
			var multiplier = document.getElementById("DefiMult");
			multiplier.innerHTML = (language == 0) ? ""+multplieur+" × "+multiplicand + " = "+ totalisateur : ""+multplieur+" × "+multiplicand + " = "+totalisateur;
			msg.innerHTML = (language == 0) ? "C'est exact, bravo !" : "That's right, well done !";
		} else {
			if(totalisateur%multplieur != 0 && totalisateur%multiplicand != 0){
				defiMSG = 1;
				msg.innerHTML = (language == 0) ? "Erreur : "+totalisateur+" n'est multiple ni de "+multplieur+" ni de " +multiplicand: "Error : "+totalisateur+" is a multiple neither of "+multplieur+" nor of " +multiplicand;
			} else {
				if(totalisateur > multiplicand*multplieur){
					defiMSG = 2;
					msg.innerHTML = (language == 0) ? "Dépassement : " +totalisateur+" est plus grand que "+multplieur+" × " +multiplicand : "Overtake : " +totalisateur+" is greater than "+multplieur+" × " +multiplicand;
				} else {
					if(totalisateur < multiplicand*multplieur){
						defiMSG = 0;
						msg.innerHTML = (language == 0) ? "Continuez : " +totalisateur+ " (" +(totalisateur/kompteur)+" × " +kompteur+") est plus petit que "+multplieur+" × " +multiplicand : "Carry on ; " +totalisateur+" is less than "+multplieur+" × " +multiplicand;				
					}
				}
			}
		}
		msg.style.display = 'block';		
	}
	if(divisionActif){ // tour de manivelle
		if(!dividendOK){
			dividendOK = (totalisateur == dividende);
			if (dividendOK){ msg.innerHTML = "" ;
			} else { msg.innerHTML = (language == 0) ? "Le totalisateur doit être "+dividende: "The totaliser shoud be "+dividende;}
			msg.style.display = 'block';
		} else {
			if ((dividende - totalisateur)%diviseur != 0){
				msg.innerHTML = (language == 0) ? "Le diviseur est "+diviseur: "The divider is "+diviseur;	
				msg.style.display = 'block';
			} else {
				msg.innerHTML = "";	
				msg.style.display = 'block';	
			} 
			if(totalisateur < diviseur){
				defiMSG = 4;
				var multiplier = document.getElementById("DefiMult");
				multiplier.innerHTML = (language == 0) ? ""+dividende+" ÷ "+diviseur+" = "+ Math.floor(dividende/diviseur)+" ; reste "+totalisateur : ""+dividende+" ÷ "+diviseur+" = "+ Math.floor(dividende/diviseur)+ " ; remain " +totalisateur;
				msg.innerHTML = (language == 0) ? "C'est exact, bravo !" : "That's right, well done !";
				msg.style.display = 'block';
			}
			if(kompteur > Math.floor(dividende/diviseur)){
				defiMSG = 6;
				msg.innerHTML = (language == 0) ? "Tu as tourné trop de fois la manivelle !" : "You turned the cranck too many times !";
				msg.style.display = 'block';
			}else if(totalisateur < dividende%diviseur){
				defiMSG = 7;
				msg.innerHTML = (language == 0) ? "Le reste est plus grand !" : "The remainder of the division is to larger !";
				msg.style.display = 'block';
			}
		}
	}
}
	
function defiRAZaccu(){  // on a remis l'accumulateur à zéro
	if(mutiplicationActif){
		defiMSG = 0;
		var multiplier = document.getElementById("DefiMult");
		multiplier.innerHTML = (language == 0) ? "Défi : multiplier "+multplieur+" par "+multiplicand : "Challenge : multiply "+multplieur+" by "+multiplicand;
		var msg = document.getElementById("DefiMsg");
		msg.innerHTML = "";
		msg.style.display = 'block';
	}
	if(divisionActif && resetCmpt){
		defiMSG = 0;
		var multiplier = document.getElementById("DefiMult");
		multiplier.innerHTML = (language == 0) ? "Défi : diviser "+dividende+" par "+diviseur : "Challenge : divide "+dividende+" by "+diviseur;
		var msg = document.getElementById("DefiMsg");
		msg.innerHTML = "";
		msg.style.display = 'block';
		dividendOK = false;
	}
}

function defiRAZcompteur(){
	if(divisionActif && resetTot){
		defiMSG = 0;
		var multiplier = document.getElementById("DefiMult");
		multiplier.innerHTML = (language == 0) ? "Défi : diviser "+dividende+" par "+diviseur : "Challenge : divide "+dividende+" by "+diviseur;
		var msg = document.getElementById("DefiMsg");
		msg.innerHTML = "";
		msg.style.display = 'block';
		dividendOK = false;
	}
}

