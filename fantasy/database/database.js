function InitDatabase(){

var config = {
	apiKey: "AIzaSyDusGUpsFfhJmRnmB2cgfetwR3ZR2otqe4",
	authDomain: "fantasycivics.firebaseapp.com",
	databaseURL: "https://fantasycivics.firebaseio.com",
	storageBucket: "fantasycivics.appspot.com",
	messagingSenderId: "245596715039"
};
var DatabaseFirebase = firebase.initializeApp(config, 'Fantasy Civics Database');

var db = DatabaseFirebase.database();

var League = DatabaseLeague();
var Scoring = DatabaseScoring();

function getBotMap(){
	return new Promise((resolve, reject) => {
		try{
			var ref = db.ref('users');
			var query = ref.orderByChild('bot').startAt(true).endAt(true);
			query.once('value', (snapshot) => {
				var botMap = snapshot.val();
				resolve(botMap);
			});
		}
		catch(err){
			reject(err);
		}
	});
}

var Database = {

	Auth: DatabaseAuth(DatabaseFirebase),
	Scoring: Scoring,

	LOCK_ROSTERS_AFTER: (5 / 7), // Locks rosters 5/7 of the way through the match
	IN_SIMULATED_TIME: false,

	getLockTime: (match) => {
		var duration = match.end - match.start;
		var lockTime = match.start + (Database.LOCK_ROSTERS_AFTER * duration);
		return lockTime;
	},

	when: (eventType, params, callback) => {
		var res = true;
		switch(eventType){
			case 'rosters_change':
				if(!params.leagueid){
					throw new Error('Must specify {leagueid}.');
				}
				var ref = db.ref('leagues/' + params.leagueid + '/rosters');
				ref.on('child_changed', (snapshot) => {
					callback({
						changed: true
					});
				});
				break;
			case 'people_join':
				if(!params.inviteid){
					throw new Error('Must specify {inviteid}.');
				}
				var ref = db.ref('invitations/' + params.inviteid + '/members');
				ref.on('child_added', (snapshot) => {
					callback({
						changed: true
					});
				});
				break;
			default:
				throw new Error('No such event listener: ' + eventType);
				break;
		}
		return res;
	},

	updateUser: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}

		return new Promise((resolve, reject) => {
			var ref = db.ref('users/' + params.userid);
			ref.once('value', (snapshot) => {
				if(snapshot.exists()){
					var userData = snapshot.val();
					var newData = {
						userid: userData.userid || params.userid, // Reversed in case world explodes
						name: params.name || userData.name,
						image: params.image || userData.image,
						email: params.email || userData.email
					}
					ref.set(newData).then(() => {
						resolve({
							success: true,
							newUser: false
						});
					});
				}
				else{
					ref.set(params).then(() => {
						resolve({
							success: true,
							newUser: true
						});
					});
				}
			}).catch(reject);
		});
	},

	setTeamName: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.team){
			throw new Error('Must specify {team}.');
		}

		return new Promise((resolve, reject) => {
			var ref = db.ref('leagues/' + params.leagueid + '/users/' + params.userid + '/team');
			ref.set(params.team).then(() => {
				resolve({
					success: true
				});
			}).catch(reject);
		});
	},
	
	getUser: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}

		return new Promise((resolve, reject) => {
			var ref = db.ref('users/' + params.userid);
			ref.once('value', (snapshot) => {
				if(!snapshot.exists()){
					reject('User {userid: ' + params.userid + '} not found.');
				}
				else{
					var userData = snapshot.val();
					resolve({
						userid: params.userid,
						name: userData.name || false,
						email: userData.email || false,
						image: userData.image || false
					});
				}
			});
		});
	},

	getUserLeagues: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}

		return new Promise((resolve, reject) => {
			var res = {
				userid: params.userid,
				leagues: {}
			}
			var ref = db.ref('leagues');
			ref.once('value', (snapshot) => {
				var leagueMap = snapshot.val();
				for(var lid in leagueMap){
					var league = leagueMap[lid];
					if(params.userid in league.users){
						res.leagues[lid] = {
							name: league.name,
							start: league.start,
							end: league.end,
							users: league.users
						}
					}
				}
				resolve(res);
			}).catch(reject);
		});
	},

	createLeagueInvitation: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		if(!params.name){
			params.name = 'Untitled League';
		}

		return new Promise((resolve, reject) => {
			var ref = db.ref('invitations');
			ref.push({
				league: {
					name: params.name,
					creator: params.userid
				}
			}).then((node) => {
				Database.acceptLeagueInvitation({
					userid: params.userid,
					inviteid: node.key
				}).then((res) => {
					resolve(res);
				}).catch(reject);
			}).catch(reject);
		});
	},

	acceptLeagueInvitation: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		if(!params.inviteid){
			throw new Error('Must specify {inviteid}.');
		}
		
		return new Promise((resolve, reject) => {
			var members = db.ref('invitations/' + params.inviteid + '/members/' + params.userid);
			members.set({
				userid: params.userid,
				accepted: Date.now()
			}).then(() => {
				resolve({
					success: true,
					inviteid: params.inviteid
				});
			}).catch(reject);
		});
	},

	getLeagueInvitations: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}

		return new Promise((resolve, reject) => {
			var ref = db.ref('invitations');
			var query = ref.orderByChild('league/creator').startAt(params.userid).endAt(params.userid);
			query.once('value', (snapshot) => {
				var res = snapshot.val();
				resolve(res);
			}).catch(reject);
		});
	},

	createLeague: (params) => {
		return new Promise((resolve, reject) => {
			getBotMap().then((botMap) => {
				params.players = PLAYER_MAP;
				params.bots = botMap;
				var league = League.generateLeague(params);
				var ref = db.ref('leagues');
				ref.push(league).then((status) => {
					resolve({
						success: true,
						leagueid: status.key
					});
				});
			}).catch(reject)
		});
	},

	getLeague: (params) => {
		if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.from){
			throw new Error('Must specify {from}.');
		}
		else if(!params.to){
			throw new Error('Must specify {to}.');
		}
		
		return new Promise((resolve, reject) => {
			new Promise((resolveLeague, rejectLeague) => {
				var ref = db.ref('leagues/' + params.leagueid);
				ref.once('value', (snapshot) => {
					if(!snapshot.exists()){
						reject('League {leagueid: ' + params.leagueid + '} not found.');
					}
					else{
						var leagueData = snapshot.val();
						leagueData.leagueid = params.leagueid;
						resolveLeague(leagueData);
					}
				}).catch(rejectLeague);
			}).then((league) => {
				league.leagueid = params.leagueid;
				var rosters = league.rosters;
				var userPromises = [];
				var promises = [];
				for(var uid in rosters){
					var q = Database.getUser({
						userid: uid
					});
					q.uid = uid;
					q.type = 'user';
					promises.push(q);
					var roster = rosters[uid];
					for(var pid in roster){
						for(var dataset in Scoring.DATASETS){
							var p = Scoring.queryDataset(dataset, {
								'$where': Scoring.buildDateQuery('creation_date', params.from, params.to),
								'ward': PLAYER_MAP[pid].ward
							});
							p.uid = uid;
							p.pid = pid;
							p.type = 'score';
							p.dataset = dataset;
							promises.push(p);
						}
					}
				}
				Promise.all(promises).then((packets) => {
					for(var s = 0; s < packets.length; s++){
						var data = packets[s];
						var meta = promises[s];
						if(meta.type === 'user'){
							league.users[meta.uid].name = data.name;
						}
						else if(meta.type === 'score'){
							rosters[meta.uid][meta.pid].name = PLAYER_MAP[meta.pid].name;
							rosters[meta.uid][meta.pid].ward = PLAYER_MAP[meta.pid].ward;
							rosters[meta.uid][meta.pid].owner = meta.uid;
							if(!rosters[meta.uid][meta.pid].scores){
								rosters[meta.uid][meta.pid].scores = {};
							}
							var score = Scoring.scoreData(data, params.from, params.to);
							rosters[meta.uid][meta.pid].scores[meta.dataset] = score;
						}
					}
				}).then(() => {
					Database.getLeaderboard({
						leagueid: params.leagueid
					}, league).then((leaderboard) => {
						for(var userKey in league.users){
							league.users[userKey].wins = leaderboard.records[userKey].wins.length;
							league.users[userKey].losses = leaderboard.records[userKey].losses.length;
						}
						var response = {
							leagueid: params.leagueid,
							name: league.name,
							start: league.start,
							end: league.end,
							from: params.from,
							to: params.to,
							schedule: league.schedule,
							users: league.users,
							rosters: rosters
						}
						resolve(response);
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	},

	getLeagueData: (params) => {
		if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		
		return new Promise((resolve, reject) => {
			var ref = db.ref('leagues/' + params.leagueid);
			ref.once('value', (snapshot) => {
				if(!snapshot.exists()){
					reject('League {leagueid: ' + params.leagueid + '} not found.');
				}
				else{
					var rosters = {};
					var league = snapshot.val();
					league.leagueid = params.leagueid;
					for(var uid in league.rosters){
						rosters[uid] = {};
						for(var pid in league.rosters[uid]){
							rosters[uid][pid] = {
								name: PLAYER_MAP[pid].name,
								playerid: pid,
								ward: PLAYER_MAP[pid].ward,
								starter: league.rosters[uid][pid].starter,
								owner: uid
							}
						}
					}
					Database.getLeaderboard({
						leagueid: params.leagueid
					}, league).then((leaderboard) => {
						for(var userKey in league.users){
							league.users[userKey].wins = leaderboard.records[userKey].wins.length;
							league.users[userKey].losses = leaderboard.records[userKey].losses.length;
						}
						var response = {
							leagueid: params.leagueid,
							name: league.name,
							start: league.start,
							end: league.end,
							schedule: league.schedule,
							users: league.users,
							rosters: rosters
						}
						resolve(response);
					}).catch(reject);
				}
			}).catch(reject);
		});
	},

	getLeaderboard: (params, inLeague) => {
		if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}

		var getLeaderboardCallback = (league, resolve, reject) => {
			var records = Util.clone(league.users);
			// Convert counters to lists of opponents
			for(var uid in records){
				records[uid].userid = uid;
				records[uid].wins = [];
				records[uid].losses = [];
			}
			var schedule = league.schedule;
			for(var w in schedule){
				for(var g in schedule[w]){
					var match = schedule[w][g];
					if(match.winner){
						var loser = (match.home === match.winner) ? match.away : match.home;
						/*records[match.winner].wins++;
						records[loser].losses++;*/
						// Track opponents
						records[match.winner].wins.push(loser);
						records[loser].losses.push(match.winner);
					}
				}
			}
			var rankings = Object.keys(records).map((userKey) => {
				records[userKey].userid = userKey;
				return records[userKey];
			}).sort((a, b) => {
				var winDiff = b.wins.length - a.wins.length;
				var loseDiff = a.losses.length - b.losses.length;
				var order = winDiff;
				if(winDiff === 0){
					order = loseDiff;
				}
				return order;
			});
			resolve({
				leagueid: params.leagueid,
				name: league.name,
				records: records,
				rankings: rankings
			});
		}

		return new Promise((resolve, reject) => {
			if(inLeague){
				if(inLeague.leagueid === params.leagueid){
					getLeaderboardCallback(inLeague, resolve, reject);
				}
				else{
					reject('getLeaderboard: League object passed in to accelerate query does not match the given leagueid.');
				}
			}
			else{
				Database.getLeague({
					leagueid: params.leagueid,
					from: 1,
					to: 1
				}).then((league) => {
					getLeaderboardCallback(league, resolve, reject);
				}).catch(reject);				
			}
		});
	},

	getRoster: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.from){
			throw new Error('Must specify {from}.');
		}
		else if(!params.to){
			throw new Error('Must specify {to}.');
		}

		return new Promise((resolve, reject) => {
			Database.getLeague(params).then((league) => {
				var playerMap = league.rosters[params.userid];
				if(!playerMap){
					reject('Not roster for user {userid: ' + params.userid + '} found in league {leagueid: ' + params.leagueid + '}.');
				}
				var res = {
					userid: params.userid,
					leagueid: params.leagueid,
					from: params.from,
					to: params.to,
					players: playerMap
				}
				resolve(res);
			}).catch(reject);
		});
	},

	updateRoster: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.roster){
			throw new Error('Must specify {roster}.');
		}
		else if(!params.change){
			throw new Error('Must specify {change}.');
		}
		else if(Database.IN_SIMULATED_TIME && !params.timestamp){
			throw new Error('Must specify {timestamp} in simulated time.');
		}
		else if(!Database.IN_SIMULATED_TIME){
			params.timestamp = Date.now();
		}

		var roster = params.roster;
		for(var pid in roster){
			var data = roster[pid].starter;
			roster[pid] = data; // Flatten Records
		}

		roster.timestamp = params.timestamp;

		var changes = ['sit', 'start', 'add', 'drop'];
		for(var c = 0; c < changes.length; c++){
			var action = changes[c];
			if(params.change[action]){
				roster[action] = params.change[action];
			}
		}

		return new Promise((resolve, reject) => {
			var ref = db.ref('rosters/' + params.leagueid + '/' + params.userid);
			ref.push(roster).then(() => {
				//console.log('Replicated Roster Successfully: ', roster);
				resolve({
					success: true
				});
			}).catch(reject);
		});
	},

	getHistoricalRoster: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.to){
			throw new Error('Must specify {to}.');
		}

		/*
		 * Errors not accounted for:
		 * Error: userid not in league -> request should fail with descriptive error
		 * Error: league does not exist -> request should fail with descriptive error
		 */

		return new Promise((resolve, reject) => {
			var ref = db.ref('rosters/' + params.leagueid + '/' + params.userid);
			// Using only the endAt() filter, this query gets the earliest possible roster
			var query = ref.orderByChild('timestamp').endAt(params.to).limitToLast(1);
			query.once('value', (snapshot) => {
				var val = snapshot.val();
				if(val){
					var keys = Object.keys(val);
					if(keys.length > 1){
						reject('getHistoricalRoster: Too many historical rosters were returned.');
					}
					else{
						var roster = val[keys[0]];
						delete roster.timestamp;
						var changes = ['sit', 'start', 'add', 'drop'];
						for(var c = 0; c < changes.length; c++){
							var action = changes[c];
							if(roster[action]){
								delete roster[action];
							}
						}
						resolve({
							userid: params.userid,
							leagueid: params.leagueid,
							to: params.to,
							roster: roster
						});
					}
				}
				else{
					//console.warn('getHistoricalRoster: No historical rosters found, using current roster, may be misdated.');
					Database.getLeagueData({
						leagueid: params.leagueid
					}).then((league) => {
						var roster = league.rosters[params.userid];
						for(var pid in roster){
							var data = roster[pid].starter;
							roster[pid] = data; // Flatten Records
						}
						resolve({
							userid: params.userid,
							leagueid: params.leagueid,
							to: params.to,
							roster: roster
						});
					}).catch(reject);
				}
			}).catch(reject);
		});
	},

	getPlayer: (params, inLeague) => {
		if(!params.playerid){
			throw new Error('Must specify {playerid}.');
		}
		else if(!PLAYER_MAP[params.playerid]){
			throw new Error('Could not find player {playerid: ' + params.playerid + '}.');
		}
		else if(!params.leagueid){
			console.warn('No {leagueid} specified.');
		}
		else if(!params.from){
			throw new Error('Must specify {from}.');
		}
		else if(!params.to){
			throw new Error('Must specify {to}.');
		}

		return new Promise((resolve, reject) => {
			var playerData = PLAYER_MAP[params.playerid];
			var res = {
				playerid: params.playerid,
				leagueid: params.leagueid,
				from: params.from,
				to: params.to,
				owner: false,
				name: playerData.name,
				ward: playerData.ward,
				starter: false,
				scores: {}
			}

			var getPlayerCallback = (league) => {
				var onRoster = false;
				for(var uid in league.rosters){
					for(var pid in league.rosters[uid]){
						if(pid === params.playerid){
							res.owner = uid;
							res.starter = league.rosters[uid][pid].starter;
							res.scores = league.rosters[uid][pid].scores;
							onRoster = true;
							break;
						}
					}
				}
				if(!onRoster){
					var promises = [];
					for(var dataset in Scoring.DATASETS){
						var p = Scoring.queryDataset(dataset, {
							'$where': Scoring.buildDateQuery('creation_date', params.from, params.to),
							'ward': playerData.ward
						});
						p.playerid = params.playerid;
						p.type = 'score';
						p.dataset = dataset;
						promises.push(p);
					}
					Promise.all(promises).then((packets) => {
						for(var s = 0; s < packets.length; s++){
							var data = packets[s];
							var meta = promises[s];
							if(meta.type === 'score'){
								var score = Scoring.scoreData(data, params.from, params.to);
								res.scores[meta.dataset] = score;
							}
						}
					}).then(() => {
						resolve(res);
					}).catch(reject);
				}
				else{
					resolve(res);
				}
			}

			/*
			 * Sneaky trick to minimize promise depth of repeated getPlayer() calls
			 * Pass in a properly structured league and use that instead of another getLeague() response
			 * Designed for getAllPlayers() calls
			 */
			if(inLeague && inLeague.leagueid === params.leagueid){
				getPlayerCallback(inLeague);
			}
			else{
				Database.getLeague(params).then((league) => {
					getPlayerCallback(league);
				}).catch(reject);
			}
		});
	},

	getAllPlayers: (params, inLeague) => {
		if(!params.leagueid){
			console.warn('No {leagueid} specified.');
		}
		else if(!params.from){
			throw new Error('Must specify {from}.');
		}
		else if(!params.to){
			throw new Error('Must specify {to}.');
		}

		return new Promise((resolve, reject) => {
			var res = {};

			var getAllPlayersCallback = (league) => {
				for(var uid in league.rosters){
					for(var rpid in league.rosters[uid]){
						var rplayer = league.rosters[uid][rpid];
						res[rpid] = {
							name: rplayer.name,
							playerid: rpid,
							ward: rplayer.ward,
							starter: rplayer.starter,
							owner: uid,
							scores: rplayer.scores
						}
					}
				}
				var freeAgentPromises = [];
				for(var pid in PLAYER_MAP){
					if(!(pid in res)){
						freeAgentPromises.push(Database.getPlayer({
							playerid: pid,
							leagueid: params.leagueid,
							from: params.from,
							to: params.to
						}, league));
					}
				}
				Promise.all(freeAgentPromises).then((freeAgents) => {
					for(var f = 0; f < freeAgents.length; f++){
						var agent = freeAgents[f];
						res[agent.playerid] = {
							name: agent.name,
							playerid: agent.playerid,
							ward: agent.ward,
							starter: agent.starter,
							owner: agent.owner,
							scores: agent.scores
						}
					}
					resolve(res);
				});
			}
			
			/*
			 * Sneaky trick to minimize promise depth
			 * See getPlayer() for more
			 */
			if(inLeague && inLeague.leagueid === params.leagueid){
				getAllPlayersCallback(inLeague);
			}
			else{
				Database.getLeague(params).then((league) => {
					getAllPlayersCallback(league);
				}).catch(reject);
			}
		});
	},

	getMatch: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.on){
			throw new Error('Must specify {on}.');
		}

		return new Promise((resolve, reject) => {
			var res = {
				leagueid: params.leagueid,
				userid: params.userid,
				on: params.on,
				start: false,
				end: false,
				home: false,
				away: false
			}
			var foundDate = false;
			var foundUser = false;
			var ref = db.ref('leagues/' + params.leagueid + '/schedule');
			ref.once('value', (snapshot) => {
				var schedule = snapshot.val();
				for(var week in schedule){
					var games = schedule[week];
					var sampleGame = games[0];
					if(params.on <= sampleGame.end && params.on >= sampleGame.start){
						foundDate = true;
						for(var gid in games){
							var game = games[gid];
							if(game.home === params.userid || game.away === params.userid){
								foundUser = true;
								res.start = game.start;
								res.end = game.end;
								res.home = game.home;
								res.away = game.away;
								res.week = (parseInt(week, 10) + 1);
								break;
							}
						}
						break;
					}
				}
				if(foundDate && foundUser){
					resolve(res);
				}
				else if(!foundUser){
					reject('Could not find a match for user {userid: ' + params.userid + '} in league {leagueid: ' + params.leagueid + '}.');
				}
				else if(!foundDate){
					reject('There are no matches on {' + new Date(params.on) + '} in league {leagueid: ' + params.leagueid + '}.');
				}
			})
		});
	},

	getMatchScore: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.on){
			throw new Error('Must specify {on}.');
		}

		return new Promise((resolve, reject) => {
			Database.getMatch({
				leagueid: params.leagueid,
				userid: params.userid,
				on: params.on
			}).then((match) => {
				var awayProm = Database.getHistoricalRoster({
					leagueid: params.leagueid,
					userid: match.away,
					from: match.start,
					to: match.end
				});
				var homeProm = Database.getHistoricalRoster({
					leagueid: params.leagueid,
					userid: match.home,
					from: match.start,
					to: match.end
				});
				Promise.all([awayProm, homeProm]).then((rosters) => {
					Database.getAllPlayers({
						leagueid: params.leagueid,
						from: match.start,
						to: match.end
					}).then((allPlayers) => {
						var finalScore = {
							home: false,
							away: false
						}
						var gameRosters = {};
						for(var i = 0; i < rosters.length; i++){
							var competitor = rosters[i];
							var roster = competitor.roster;
							var totalScore = 0;
							for(var pid in roster){
								var player = allPlayers[pid];
								player.starter = roster[pid];
								if(roster[pid]){
									for(var dataset in Scoring.DATASETS){
										totalScore += player.scores[dataset];
									}
								}
								if(!gameRosters[competitor.userid]){
									gameRosters[competitor.userid] = {};
								}
								gameRosters[competitor.userid][pid] = player;
							}
							if(match.home === competitor.userid){
								finalScore.home = totalScore;
							}
							else if(match.away === competitor.userid){
								finalScore.away = totalScore;
							}
						}
						var winner = (finalScore.home > finalScore.away) ? match.home : match.away;
						resolve({
							leagueid: params.leagueid,
							match: match,
							rosters: gameRosters,
							winner: winner
						});
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	},

	setMatchOutcome: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.on){
			throw new Error('Must specify {on}.');
		}

		return new Promise((resolve, reject) => {
			Database.getMatchScore(params).then((score) => {
				var ref = db.ref('leagues/' + params.leagueid + '/schedule');
				ref.once('value', (snapshot) => {
					var schedule = snapshot.val();
					var weekKey = (score.match.week - 1);
					var games = schedule[weekKey];
					var found = false;
					var gameKey = false;
					for(var g in games){
						var game = games[g];
						if(game.home === score.match.home && game.away === score.match.away){
							found = true;
							gameKey = g;
							break;
						}
					}
					if(found){
						var outcomeRef = db.ref('leagues/' + params.leagueid + '/schedule/' + weekKey + '/' + gameKey + '/winner');
						outcomeRef.once('value', (snapshot) => {
							if(snapshot.exists()){
								reject('setMatchOutcome: Match outcome already determined.');
							}
							else{
								outcomeRef.set(score.winner).then(() => {
									resolve({
										success: true
									});
								}).catch(reject);
							}
						}).catch(reject);
					}
					else{
						reject('setMatchOutcome: Could not find match {match: ' + JSON.stringify(score.match) + '} in league {leagueid: ' + params.leagueid + '} schedule.');
					}
				}).catch(reject);
			}).catch(reject);
		});
	},

	isLocked: (params) => {
		if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.on){
			throw new Error('Must specify {on}.');
		}

		return new Promise((resolve, reject) => {
			if(Database.IN_SIMULATED_TIME){
				resolve({
					locked: false,
					lockTime: false,
					match: false
				});
			}
			else{
				Database.getMatch(params).then((match) => {
					var lockTime = Database.getLockTime(match);
					var res = params.on > lockTime;
					resolve({
						locked: res,
						lockTime: lockTime,
						match: match
					});
				}).catch(reject);
			}
		});
	},

	movePlayer: (params) => {
		if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.sit){
			throw new Error('Must specify {sit}.');
		}
		else if(!params.start){
			throw new Error('Must specify {start}.');
		}
		else if(Database.IN_SIMULATED_TIME && !params.timestamp){
			throw new Error('Must specify {timestamp} in simulated time.');
		}
		else if(!Database.IN_SIMULATED_TIME){
			params.timestamp = Date.now();
		}

		var movePlayerCallback = (resolve, reject) => {
			var ref = db.ref('leagues/' + params.leagueid + '/rosters/' + params.userid);
			ref.once('value', (snapshot) => {
				var players = snapshot.val();
				var oldRoster = Util.clone(players);
				if(!players){
					reject('No roster for user {userid: ' + params.userid + '} in league {leagueid: ' + params.leagueid + '}');
				}
				else if(!(params.sit in players)){
					reject('Player {sit:playerid: ' + params.sit + '} is not on the roster.');
				}
				else if(!(params.start in players)){
					reject('Player {start:playerid: ' + params.start + '} is not on the roster');	
				}
				else if(players[params.sit].starter === false){
					reject('Cannot sit player {playerid: ' + params.sit + '}, already benched.');
				}
				else if(players[params.start].starter === true){
					reject('Cannot start player {playerid: ' + params.start + '}, already starting.');
				}
				else{
					players[params.sit].starter = false;
					players[params.start].starter = true;
					ref.set(players).then(() => {
						Database.updateRoster({
							userid: params.userid,
							leagueid: params.leagueid,
							roster: players,
							change: params,
							timestamp: params.timestamp
						}).then(() => {
							resolve({
								success: true
							});
						}).catch((err) => {
							ref.set(oldRoster).then(() => {
								reject(err);
							}).reject((fatalErr) => {
								reject('Fatal Error: Replication failed with error message {error: ' + fatalErr + '}, roster data after movePlayer() call may be out of sync.');
							});
						});
					});
				}
			}).catch(reject);
		}

		return new Promise((resolve, reject) => {
			Database.isLocked({
				userid: params.userid,
				leagueid: params.leagueid,
				on: Date.now()
			}).then((res) => {
				if(res.locked){
					reject('Roster locked for remainder of the match.');
				}
				else{
					movePlayerCallback(resolve, reject);
				}
			});
		});		
	},

	acquirePlayer: (params) => {
		if(!params.leagueid){
			throw new Error('Must specify {leagueid}.');
		}
		else if(!params.userid){
			throw new Error('Must specify {userid}.');
		}
		else if(!params.add){
			throw new Error('Must specify {add}.');
		}
		else if(!params.drop){
			throw new Error('Must specify {drop}.');
		}
		else if(Database.IN_SIMULATED_TIME && !params.timestamp){
			throw new Error('Must specify {timestamp} in simulated time.');
		}
		else if(!Database.IN_SIMULATED_TIME){
			params.timestamp = Date.now();
		}

		var acquirePlayerCallback = (resolve, reject) => {
			Database.getLeagueData(params).then((league) => {
				if(!(params.userid in league.rosters)){
					reject('No roster for user {userid: ' + params.userid + '} in league {leagueid: ' + params.leagueid + '}');
				}

				var oldRoster = Util.clone(league.rosters); // For backup purposes

				var playerToDropIsOwned = false;
				var playerToAddIsFree = true;
				for(var uid in league.rosters){
					for(var pid in league.rosters[uid]){
						if(params.userid === uid && params.drop === pid){
							playerToDropIsOwned = true;
						}
						if(params.add === pid){
							playerToAddIsFree = false;
						}
					}
				}
				
				if(!playerToDropIsOwned){
					reject('Player {drop:playerid: ' + params.drop + '} to drop is not on your roster, cannot drop.');
				}
				else if(!playerToAddIsFree){
					reject('Player {add:playerid: ' + params.add + '} to add is on another roster, cannot add.');	
				}
				else if(playerToDropIsOwned && playerToAddIsFree){
					var status = league.rosters[params.userid][params.drop].starter;
					league.rosters[params.userid][params.add] = {
						starter: status
					}
					delete league.rosters[params.userid][params.drop];
					var newRoster = league.rosters[params.userid];
					var ref = db.ref('leagues/' + params.leagueid + '/rosters/' + params.userid);
					ref.set(newRoster).then(() => {
						Database.updateRoster({
							userid: params.userid,
							leagueid: params.leagueid,
							roster: newRoster,
							change: params,
							timestamp: params.timestamp
						}).then(() => {
							resolve({
								success: true
							});
						}).catch((err) => {
							ref.set(oldRoster).then(() => {
								reject(err);
							}).reject((fatalErr) => {
								reject('Fatal Error: Replication failed with error message {error: ' + fatalErr + '}, roster data after acquirePlayer() call may be out of sync.');
							});
						});
					}).catch(reject);
				}
			}).catch(reject);
		}

		return new Promise((resolve, reject) => {
			Database.isLocked({
				userid: params.userid,
				leagueid: params.leagueid,
				on: Date.now()
			}).then((res) => {
				if(res.locked){
					reject('Roster locked for remainder of the match.');
				}
				else{
					acquirePlayerCallback(resolve, reject);
				}
			});
		});

	}

}

return Database;

}