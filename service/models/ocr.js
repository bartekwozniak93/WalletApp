var auth = require('google-api-utility')
  , autrequest = auth.request

exports.OCR = function(imgContent, callback){
	var jsonfile = 'MY_KEY.json';
	var baseurl = 'https://vision.googleapis.com/v1/images:annotate';
	auth.init({
		scope: ['https://www.googleapis.com/auth/cloud-platform'].join(' '),
		json_file: jsonfile
	});

	req ={
		image: {content: imgContent},
        	features:[],
	}
	req.features.push({ 
			type:'TEXT_DETECTION',
			maxResults: 1
			});
	request={
		requests:[],
	}
	request.requests.push(req);	
	autrequest(
		{url:baseurl,
		method:'post',
		json:request},
		function (error, req, dat){
			if(error)callback(error,null);
			else{
				data = JSON.stringify(dat.responses[0].textAnnotations[0].description); 			
				lines=data.split('\\n');
				allText=lines.join(' ');
			//Price
				if(a = allText.match(new RegExp('(S|s)(U|u)(M|m|N|n)(A|a)( )*(.){2,3}( )* [0-9]*(,)[0-9]{2}', 'g'))) sPrice=a[0].split(' ')[2];
				else if (a = allText.match(new RegExp('(S|s)(U|u)(M|m|N|n)(A|a)(:)( )*[0-9]*(,)[0-9]{2}', 'g'))) sPrice=a[0].split(' ')[1];
				else if (a = allText.match(new RegExp('(R|r)(A|a)(Z|z)(E|e)(M|m)( )*(.){2,3}( )* [0-9]*(,)[0-9]{2}', 'g'))) sPrice=a[0].split(' ')[2];
				else sPrice=" ";
			//Time
				if(a = allText.match(new RegExp('[0-9]{4}(-)[0-9]{2}(-)[0-9]{2}', 'g'))) sData=a[0];
				else sData=" ";
			//NIP
				if(a = allText.match(new RegExp('[0-9]{2,4}(-)[0-9]{2,4}(-)[0-9]{2,4}(-)[0-9]{2,4}', 'g'))) sNIP=a[0];
				else sNIP=" ";
			//Name
				try{
					sName=lines[0].replace("\"", "");
				}catch(e){
					sName=" ";
				}
					
			out={
				textReceipt:allText,
				companyName:sName,	
				nip:sNIP,
				dateReceipt:sData,
				price:sPrice
				};
			callback(null,out);
			}
		}
		
	);
}
