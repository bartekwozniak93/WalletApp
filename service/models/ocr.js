var auth = require('google-api-utility')
  , autrequest = auth.request

exports.OCR = function(imgContent, callback){
	try{
		var jsonfile = 'service/MY_KEY.json';
		var baseurl = 'https://vision.googleapis.com/v1/images:annotate';
		auth.init({
			scope: ['https://www.googleapis.com/auth/cloud-platform'].join(' '),
			json_file: jsonfile
		});

		req ={
			image: {content: imgContent.split(',')[1]},
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
					try{
					if(a = allText.match(new RegExp('(S|s)(U|u)(M|m|N|n)(A|a)( )*(.){2,3}( )* [0-9]*(,)[0-9]{2}', 'g'))) sPrice=parseFloat(a[0].split(' ')[2].replace(",","."));
					else if (a = allText.match(new RegExp('(S|s)(U|u)(M|m|N|n)(A|a)(:)( )*[0-9]*(,)[0-9]{2}', 'g'))) sPrice=parseFloat(a[0].split(' ')[1].replace(",","."));
					else if (a = allText.match(new RegExp('(S|s)(U|u)(M|m|N|n)(A|a)( )*[0-9]*(,)[0-9]{2}', 'g'))) sPrice=parseFloat(a[0].split(' ')[1].replace(",","."));
					else if (a = allText.match(new RegExp('(R|r)(A|a)(Z|z)(E|e)(M|m)( )*(.){2,3}( )* [0-9]*(,)[0-9]{2}', 'g'))) sPrice=parseFloat(a[0].split(' ')[2].replace(",","."));
					else if (a = allText.match(new RegExp('(P|p)(L|l)(N|n)( )*[0-9]*(,)[0-9]{2}', 'g'))) sPrice=parseFloat(a[0].split(' ')[1].replace(",","."));
					else sPrice=" ";
					}catch(err){ sPrice=" ";}
				//Time
					if(a = allText.match(new RegExp('[0-9]{4}(-)[0-9]{2}(-)[0-9]{2}', 'g'))) sData=a[0];
					else sData=" ";
				//NIP
					if(a = allText.match(new RegExp('[0-9]{2,4}(-)[0-9]{2,4}(-)[0-9]{2,4}(-)[0-9]{2,4}', 'g'))) sNIP=a[0];
					else sNIP=" ";
				//Name
					try{
						sName=lines[0].replace("\"", "");
					}catch(err){sName=" ";}
						
					out={
						textReceipt:allText,
						companyName:sName,	
						nip:sNIP,
						dateReceipt:sData,
						price:sPrice
					};
					callback(null,out);
				}
			});
	}catch(err){
		callback(err,null);
	}

}
