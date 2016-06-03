lwip = require('lwip');

exports.CreateTN=function (source,callback){
	try{
		data=source.split(',');
		buf=new Buffer(data[1],'base64');	
		format=data[0].split(';')[0].split('/')[1];
		lwip.open(buf,format , function(err, image){
			if(err) callback(err,null);
			image.resize(100,100, function(err,thumbImage){
				if(err) callback(err,null);
				thumbImage.toBuffer('png', function(err,buffer){
					if(err) callback(err,null);
						out="data:image/png;base64,"+buffer.toString('base64');
						callback(null,out);
					}
				);			
			});
		});
	}catch(err){
		callback(err,null)
	}
}
