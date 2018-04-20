import {csv, json, format} from 'd3';

export const parseHist = d => {
    const date = new Date (+d.date.slice(0,4),+d.date.slice(4,6),+d.date.slice(6,8))

    return {
		date: date,
        year: date.getUTCFullYear(),
        home: d.home,
        away: d.away,
		away_triple_plays: +d.away_triple_plays,
		home_triple_plays: +d.home_triple_plays,
		game_triple_plays: (+d.away_triple_plays) + (+d.home_triple_plays),
		away_double_plays: +d.away_double_plays,
		home_double_plays: +d.home_double_plays,
		game_double_plays: (+d.away_double_plays) + (+d.home_double_plays),
		length_outs: +d.length_outs,
		attendance: +d.attendance,
		away_putouts: +d.away_putouts,
		home_putouts: +d.home_putouts,
		away_strikeouts: +d.away_strikeouts,
		home_strikeouts: +d.home_strikeouts,
        away_complete_game: +d.away_complete_game,
		home_complete_game: +d.home_complete_game,
        game_complete_game: (+d.away_complete_game) + (+d.home_complete_game),
        away_no_hitter: +d.away_no_hitter,
		home_no_hitter: +d.home_no_hitter,
        game_no_hitter: (+d.away_no_hitter) + (+d.home_no_hitter),
        away_perfect_game: +d.away_perfect_game,
		home_perfect_game: +d.home_perfect_game,
        game_perfect_game: (+d.away_perfect_game) + (+d.home_perfect_game)
    };
};

export const parseMatrix = d => {
    return {
        year: +d.year,
        team: d.home,
        total_triple_plays: (+d.away_triple_plays) + (+d.home_triple_plays),
        total_complete_game: (+d.away_complete_game) + (+d.home_complete_game),
        total_no_hitter: (+d.away_no_hitter) + (+d.home_no_hitter),
        total_perfect_game: (+d.away_perfect_game) + (+d.home_perfect_game),
        total_games: (+d.away_games) + (+d.home_games)
    };
};

export const fetchData = (url) => {
	return new Promise((resolve, reject) => {
		json(url, (err, data) => {
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		})
	});
};

export const fetchCsv = (url, parse) => {
	return new Promise((resolve, reject) => {
		csv(url, parse, (err, data) => {
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		})
	});
}

export const formatNumber = format('.0f');

export const formatPercent = format(',.2%');
