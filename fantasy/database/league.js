function DatabaseLeague(){

var League = {

	STARTERS_PER_ROSTER: 3,
	SITTERS_PER_ROSTER: 2,
	DEFAULT_SEASON_LENGTH: 3,

	/*
	 * Fix list of users for a league
	 * Input: list of userids, map of bot users
	 * Output: list of userids
	 */
	fixUserList: (users, bots) => {
		var res = false;
		if(users.length < 1){
			throw new Error('List of userids is empty.');
		}
		else if(users.length % 2 !== 0){
			var newUsers = Util.clone(users);
			var botid = Util.getRandomKey(bots);
			newUsers.push(botid);
			res = newUsers;
		}
		else{
			res = users;
		}
		return res;
	},

	/*
	 * Generate schedules for a league of users
	 * Input: list of userids (must be unique and even-length), number of weeks in season
	 * Output: a list of lists containing the matches for the season
	 */
	generateSchedule: (users, weeksInput) => {
		var schedule = [];
		var weeks = weeksInput || League.DEFAULT_SEASON_LENGTH;
		if(users.length < 1){
			throw new Error('List of userids is empty.');
		}
		else if(users.length % 2 !== 0){
			throw new Error('List of userids must be even in length.');
		}
		else if(weeks < 1){
			throw new Error('Season must be at least one week long');
		}
		else{
			
			/*for(var a = 0; a < half; a++){
				var thisWeek = [];
				for(var u = half; u < users.length; u++){
					var nidx = (u + a) % users.length;
					var opponent = users[nidx];
					if(users[u] === opponent){
						throw new Error('A user cannot be matched up against their own team.');
					}
					thisWeek.push({
						home: users[u],
						away: opponent
					});
				}
				allWeeks.push(thisWeek);
			}*/

			var allWeeks = [];
			var half = Math.floor(users.length / 2);
			for(var x = 0; x < half; x++){
				var thisWeek = [];
				var flipWeek = [];
				for(var a = 0; a < half; a++){
					var home = users[a];
					var aidx = half + ((a + x) % half);
					var away = users[aidx];
					if(!home && !away){
						throw new Error('Failed to match up two teams.');
					}
					else if(home === away){
						throw new Error('A user cannot be matched up against their own team.');
					}
					else{
						thisWeek.push({
							home: home,
							away: away
						});
						flipWeek.push({
							home: away,
							away: home
						});
					}
				}
				allWeeks.push(thisWeek);
				allWeeks.push(flipWeek);
			}

			// Prevent back-to-back repeated matchups in short leagues (allows matchups, but not same host)
			var lastWeekIndex = -1;
			for(var w = 0; w < weeks; w++){
				// Later: Equalize number of home/away matches
				var ridx = Math.floor(allWeeks.length * Math.random());
				while(ridx === lastWeekIndex){
					ridx = Math.floor(allWeeks.length * Math.random());
				}
				var weekMatches = allWeeks[ridx];
				schedule.push(weekMatches);
				lastWeekIndex = ridx;
			}
		}
		return schedule;
	},
	
	/*
	 * Generate rosters for a league of users from given players
	 * Input: list of userids (must be unique and even-length), map of players
	 * Output: map of rosters to userids
	 */
	generateRosters: (users, players) => {
		var rosterMap = {};
		if(!users){
			throw new Error('No userids provided.');
		}
		if(!players){
			throw new Error('No players provided.');
		}
		else if(users.length < 1){
			throw new Error('List of userids is empty.');
		}
		else if(users.length % 2 !== 0){
			throw new Error('List of userids must be even in length.');
		}
		else if(Object.keys(players).length < ((League.STARTERS_PER_ROSTER + League.SITTERS_PER_ROSTER) * users.length)){
			throw new Error('Not enough players to fill rosters.');
		}
		else{
			var possiblePlayers = Object.keys(players);
			for(var u = 0; u < users.length; u++){
				var uid = users[u];
				rosterMap[uid] = {};
				for(var p = 0; p < (League.STARTERS_PER_ROSTER + League.SITTERS_PER_ROSTER); p++){
					var ridx = Math.floor(possiblePlayers.length * Math.random());
					var pid = possiblePlayers.splice(ridx, 1)[0];
					rosterMap[uid][pid] = {
						starter: p < League.STARTERS_PER_ROSTER
					}
				}
			}
		}
		return rosterMap;
	},

	assignScheduleTimes: (matches, start, end) => {
		var seasonDuration = end - start;
		var matchDuration = seasonDuration / matches.length;
		var schedule = matches.map((week, widx) => {
			return week.map((game, gidx) => {
				var matchStart = start + (widx * matchDuration);
				var matchEnd = matchStart + matchDuration;
				return {
					home: game.home,
					away: game.away,
					start: matchStart,
					end: matchEnd
				}
			});
		});
		return schedule;
	},

	generateLeague: (config) => {
		if(!config.users){
			throw new Error('Must provide users in league config.');
		}
		else if(!config.bots){
			throw new Error('Must specify what bots to use in league config.');
		}
		else if(!config.players){
			throw new Error('Must specify what players to use in league config.');
		}
		else if(!config.start){
			throw new Error('Must specify start date in league config.');
		}
		else if(!config.end){
			throw new Error('Must specify end date in league config.');
		}
		else if(config.end < config.start){
			throw new Error('League end date is before league start date.');
		}
		else if(config.end === config.start){
			throw new Error('League end date is the same as league start date.');
		}

		Util.checkValidTimestamp(config.start);
		Util.checkValidTimestamp(config.end);

		var start = Util.floorTimestamp(config.start);
		var end = Util.floorTimestamp(config.end);

		var users = League.fixUserList(config.users, config.bots);
		var rosters = League.generateRosters(users, config.players);
		var matches = League.generateSchedule(users, config.weeks);
		var schedule = League.assignScheduleTimes(matches, config.start, config.end);

		var usersMap = {};
		for(var u = 0; u < users.length; u++){
			usersMap[users[u]] = {
				team: 'Untitled Team',
				wins: 0,
				losses: 0
			}
		}
		return {
			name: config.name || 'Untitled League',
			start: start,
			end: end,
			users: usersMap,
			schedule: schedule,
			rosters: rosters
		}
	}

}

return League;

}