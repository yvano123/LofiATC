class Airport {
	constructor(code: string, name: string, uri: string) {
		this.code = code;
		this.name = name;
		this.uri = uri;
	}
	code!: string;
	name!: string;
	uri!: string;
}
export const airports = [
	new Airport(
		'KJFK',
		'John F. Kennedy International Airport',
		'https://s1-bos.liveatc.net/kjfk9_twr?nocache=2026031418573514244'
	),
	new Airport(
		'KLAX',
		'Los Angeles International Airport',
		'https://s1-fmt2.liveatc.net/klax3?nocache=2026031418404644290'
	),
	new Airport(
		'KORD',
		"Chicago O'Hare International Airport",
		'https://s1-fmt2.liveatc.net/kord1n2_twr_ctr2?nocache=2026031414211026529'
	),
	new Airport(
		'KATL',
		'Hartsfield–Jackson Atlanta International Airport',
		'https://s1-bos.liveatc.net/katl_twr?nocache=2026031414215433160'
	),
	new Airport(
		'KSEA',
		'Seattle–Tacoma International Airport',
		'https://s1-fmt2.liveatc.net/ksea3_twr_east?nocache=2026031414223667715'
	),
	new Airport(
		'EHAM',
		'Amsterdam Airport Schiphol',
		'https://s1-fmt2.liveatc.net/eham_twr_0624?nocache=2026031414234593333'
	),
	new Airport(
		'LSZH',
		'Zurich Airport',
		'https://s1-fmt2.liveatc.net/lszh1_twr?nocache=2026031414250272293'
	),
	new Airport(
		'VHHH',
		'Hong Kong International Airport',
		'https://s1-bos.liveatc.net/vhhh5?nocache=2026031414263134696'
	),
	new Airport(
		'RJTT',
		'Tokyo Haneda Airport',
		'https://s1-bos.liveatc.net/rjtt_control?nocache=2026031414270863029'
	),
	new Airport(
		'RJAA',
		'Narita International Airport',
		'https://s1-bos.liveatc.net/rjaa_twr?nocache=2026031414281242252'
	),
	new Airport(
		'WSSS',
		'Singapore Changi Airport',
		'https://s1-fmt2.liveatc.net/wsss3?nocache=2026031414285761375'
	),
	new Airport(
		'YSSY',
		'Sydney Kingsford Smith Airport',
		'https://s1-bos.liveatc.net/yssy1_twr?nocache=2026031414293649150'
	),
	new Airport(
		'YMML',
		'Melbourne Airport',
		'https://s1-fmt2.liveatc.net/ymml3?nocache=2026031414300014838'
	),
	new Airport(
		'CYYZ',
		'Toronto Pearson International Airport',
		'https://s1-bos.liveatc.net/cyyz1_twr_north?nocache=2026031414304763805'
	),
	new Airport(
		'CYVR',
		'Vancouver International Airport',
		'https://s1-fmt2.liveatc.net/cyvr1_twr?nocache=2026031414313071412'
	),
	new Airport(
		'MMMX',
		'Mexico City International Airport',
		'https://s1-bos.liveatc.net/mmmx1_twr?nocache=2026031414321841408'
	)
];
