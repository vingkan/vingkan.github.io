var userID;
var authObject;

function checkUserInDatabase(authData){
	userID = authData.google.id;
	var path = "https://tinderpreneurship.firebaseio.com/users/" + userID;
	var userRef = new Firebase(path);
	userRef.once('value', function(snapshot){
		if(!snapshot.exists()){
			var userGoogleData = new Firebase(path + "/google");
			userGoogleData.set({
				uid: userID,
				name: authData.google.displayName,
				email: authData.google.email,
				img: authData.google.profileImageURL
			});
			var userProfileData = new Firebase(path + "/profile");
			userProfileData.set({
				description: "",
				desires: JSON.stringify([]),
				peeves: "",
				secretname: getNewSecretName(),
				strengths: JSON.stringify([]),
				likedyou: JSON.stringify([]),
				youliked: JSON.stringify([])
			});
			displayMessage("Welcome to Tinderpreneurship!<br>Since this is your first time, fill out this profile to help others learn more about you.")
			openSection('profile');
		}
		else{
			openSection('menu');
		}
	});
}

function googleLogin(){
	var ref = new Firebase("https://tinderpreneurship.firebaseio.com");
	ref.authWithOAuthPopup('google', function(error, authData){
		if(error){
			console.log(error);
		}
		else{
			console.log(authData);
			authObject = authData;
			checkUserInDatabase(authData);
		}
	},
	{
		scope: "email"
	});
}

/*--------------------------------------------*/
/*---> SECRET NAMES <-------------------------*/
/*--------------------------------------------*/

var colors = ["aeneous","albicant","albugineous","amaranthine","argent","atrous","aubergine","aurulent","azuline","azure","badious","beige","brunneous","burnet","caesious","cardinal","castaneous","castory","celadon","celeste","cerulean","cesious","chartreuse","chlorochrous","chrysochlorous","cinerious","cinnabar","citreous","citrine","claret","coccineous","columbine","coquelicot","corbeau","cramoisy","cretaceous","croceate","cyaneous","eburnean","erythraean","ferruginous","filemot","flammeous","flavescent","fuliginous","fulvous","fuscous","gamboge","glaucous","goldenrod","greige","gridelin","griseous","haematic","heliotrope","hoary","hyacinthine","ianthine","ibis","icterine","icteritious","incarnadine","indigo","infuscate","isabelline","jacinthe","jessamy","kermes","khaki","lateritious","leucochroic","liard","lovat","lurid","luteolous","luteous","lutescent","madder","magenta","maroon","mauve","mazarine","melanic","melichrous","meline","miniaceous","minium","modena","morel","nacarat","nankeen","nigricant","nigrine","niveous","ochre","ochroleucous","olivaceous","or","pavonated","periwinkle","perse","phoeniceous","piceous","plumbeous","ponceau","porphyrous","porraceous","prasinous","primrose","puccoon","puce","puniceous","purpure","purpureal","pyrrhous","rhodopsin","rubiginous","rubious","rufous","russet","sable","saffron","sage","sanguineous","sapphire","sarcoline","sepia","sinopia","slate","smalt","smaragdine","solferino","sorrel","spadiceous","stammel","stramineous","suede","sulphureous","tan","taupe","tawny","teal","terracotta","testaceous","tilleul","titian","topaz","turquoise","ultramarine","umber","vermeil","vermilion","vinaceous","vinous","violaceous","violet","virescent","virid","viridian","vitellary","wallflower","watchet","wheaten","whey","willowish","xanthic","zinnober"];

var animals = ["aardwolf","aasvogel","aberdevine","accentor","acipenser","addax","adjutant","adzebill","aepyornis","agouti","amberjack","amphiuma","anhinga","anoa","anole","antechinus","argali","aurochs","avocet","axolotl","aye-aye","babirusa","bandicoot","bangtail","banteng","barasingha","barbet","beira","bharal","binturong","biscacha","bittern","blauwbok","blenny","blesbok","bongo","bontbok","borzoi","brach","brachet","brandling","brocken","bulbul","bullock","cabrilla","caiman","caple","capybara","caracal","caracara","cassowary","chamois","chevrotain","chiru","chital","chuckwalla","civet","cleg","coelacanth","colobus","colocolo","colugo","conure","corella","coypu","culex","culver","curlew","cusk","dabchick","daw","degu","desman","dhole","dibatag","dik-dik","diprotodon","dobbin","dobsonfly","douc","douroucouli","dowitcher","duarf","dugong","duiker","dunnart","earwig","echidna","eland","emmet","eyas","falanouc","falconet","fossa","francolin","froghopper","galago","galah","gannet","gaur","gayal","gelada","gemsbok","genet","gerenuk","gharial","goa","goanna","goral","gowk","graphiure","grayling","grebe","grilse","grison","grivet","grysbok","guenon","guereza","guillemot","gundi","gymnure","hammerkop","harrier","havier","hellbender","hoatzin","hocco","hogget","huemul","hutia","hyrax","ibex","ibis","ichneumon","iguana","iiwi","ipiti","isatis","ithomiid","iulus","izard","jabiru","jacana","jade","jennet","jerboa","jiboya","junco","jurel","kagu","kaka","kea","keffel","kereru","kiang","kine","kinkajou","kleenebok","klipspringer","knobber","kob","kouprey","kudu","kyloe","lammergeier","langur","lechwe","leopon","leveret","limpkin","linsang","lorikeet","loris","lutung","malbrouck","mangabey","markhor","meerkat","morel","muntjac","murre","nightjar","numbat","nutria","nyala","octodont","okapi","olm","onager","onocrotal","oribi","oropendola","oryx","ouzel","oystercatcher","palfrey","pangolin","peccary","percheron","petrel","phalarope","phoenicopter","pichi","pichiciego","pika","porbeagle","potto","pratincole","prion","pudu","puku","quarrion","quaviver","quawk","quelea","querquedule","quetzal","queyock","quickhatch","quinnat","quokka","quoll","raad","rach","ratel","reebok","reedbuck","rooibok","rooirhebok","rorqual","rosella","saiga","saki","sambar","scanderoon","seriema","serow","serval","shearling","siamang","siskin","sitatunga","skink","skua","solenodon","sounder","spatangoid","springbok","springhare","steenbok","stellion","stirk","sumpter","sunbittern","suni","tabanid","tahr","takin","tamandua","tamaraw","tarpan","tayra","teg","tenrec","thamin","thylacine","tinamou","titi","topi","trogon","tsessebe","tuatara","tucutucu","turaco","tuza","uakari","uguisu","uintathere","uraster","urial","urochs","uromastix","urraca","urubu","vaquita","vedalia","vicuna","vireo","viscacha","wapiti","wether","whiffet","whitecoat","widgeon","wisent","woolbird","xanthareel","xeme","xenops","xenurine","xiphias","xiphosuran","yabby","yaffingale","yakow","yapok","yeanling","yelt","yelting","yowie","zander","zebrinny","zebrule","zebu","zemni","zeren","zho","zokor","zonure","zyzzyva"];

function getNewSecretName(){

	/* STILL NOT WORKING - TODO: Ensure that new secret names are unique
	var secretnames = [];

	function getSecretNames(){
		var secretNameRef = new Firebase("https://tinderpreneurship.firebaseio.com/users/secretnames");
		secretNameRef.once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
				secretnames.push(childSnapshot.val());
			});
		});
		console.log(secretnames);
	}

	getSecretNames();*/

	var color = colors[Math.floor(colors.length * Math.random())];
	var animal = animals[Math.floor(animals.length * Math.random())];
	var number = Math.floor((9999 - 1000) * Math.random()) + 1000;
	var secretname = color.charAt(0).toUpperCase() + color.substr(1) + animal.charAt(0).toUpperCase() + animal.substr(1) + number;
	
	var secretNameRef = new Firebase("https://tinderpreneurship.firebaseio.com/secretnames");
	console.log(secretname);
	secretNameRef.push(secretname);

	return secretname;

}

console.log("LOADED googleAuth.js");