class RadioStation {
	constructor( name: string, uri: string) {
		this.name = name;
		this.uri = uri;
	}
	name!: string;
	uri!: string;
}

export const radioStations = [
    new RadioStation("Chill Lofi", "https://stream-178.zeno.fm/f3wvbbqmdg8uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJmM3d2YmJxbWRnOHV2IiwiaG9zdCI6InN0cmVhbS0xNzguemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IlU2VlJDNDJMU0h1SHo3b25zWkFvM3ciLCJpYXQiOjE3NzQzNDc1MzcsImV4cCI6MTc3NDM0NzU5N30.5RfHzFW7IWHHoZa9aQx4GF6baMJ1U3vJsRPiWktzvxE"),
    new RadioStation("Lofi Girl", "https://stream-167.zeno.fm/v5reddyk8rhvv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ2NXJlZGR5azhyaHZ2IiwiaG9zdCI6InN0cmVhbS0xNjcuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IjZXQUxwSUdXUlVPSl9zdHYwXzRKdXciLCJpYXQiOjE3NzQzNDY4OTMsImV4cCI6MTc3NDM0Njk1M30.tLRfITbsfHG68C7WXDNoVB8tHVaSOa9gySbA7dzCOZo&aw_0_req_lsid=7973f080d11543c4d8a22b8f3fc4e405"),
    new RadioStation("Lofi Hiphop", "https://stream-164.zeno.fm/fe1azb8s0v8uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJmZTFhemI4czB2OHV2IiwiaG9zdCI6InN0cmVhbS0xNjQuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IkFuR2swTTAwUzJTS3VKUC14dF9JUmciLCJpYXQiOjE3NzQzNDcwMzMsImV4cCI6MTc3NDM0NzA5M30.TZRnTDVPWLaQ_Io-a9sQpgc4x6RUVDAxeAwCBpnJyCo&aw_0_req_lsid=7973f080d11543c4d8a22b8f3fc4e405"),
    new RadioStation("Study Lofi", "https://stream-157.zeno.fm/tabzverz0fctv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ0YWJ6dmVyejBmY3R2IiwiaG9zdCI6InN0cmVhbS0xNTcuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IldQVVUyRXY3UUJxSFoxVnBmQkQ4Z3ciLCJpYXQiOjE3NzQzNDY5ODEsImV4cCI6MTc3NDM0NzA0MX0.awcF5su-tkTFeHjfa5nCHrK2lT0zMH2etzjbLLjF-K4&aw_0_req_lsid=7973f080d11543c4d8a22b8f3fc4e405"),
    new RadioStation("Diverse Lofi", "https://stream-179.zeno.fm/z65dsrrsrg0uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ6NjVkc3Jyc3JnMHV2IiwiaG9zdCI6InN0cmVhbS0xNzkuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6Ilp1Y2ZweUdhUWxXQmljMFBiTXZWWlEiLCJpYXQiOjE3NzQzNDY5NTAsImV4cCI6MTc3NDM0NzAxMH0.xYZPHRuZViOLbR4ITpWM3xKogm639gHLOGq2hvBRDeg&aw_0_req_lsid=7973f080d11543c4d8a22b8f3fc4e405"),
    new RadioStation("Minecraft Lofi", "https://stream-178.zeno.fm/kp41ftw3zehvv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJrcDQxZnR3M3plaHZ2IiwiaG9zdCI6InN0cmVhbS0xNzguemVuby5mbSIsInJ0dGwiOjUsImp0aSI6InAwOFoxbXlmUndhTG1KZ3J5WmdMNWciLCJpYXQiOjE3NzQzNDcwNTEsImV4cCI6MTc3NDM0NzExMX0.hL1NTe4tFh78AT3ivUfI0EKrV9ceOpIObdo8rNR1bqU&aw_0_req_lsid=7973f080d11543c4d8a22b8f3fc4e405"),
]