var fs = require('fs');
var config = require('../config');
var auth = require('google-api-utility'),
    autrequest = auth.request

var jsonfile = 'MY_KEY.json';
var baseurl = 'https://vision.googleapis.com/v1/images:annotate';

function imgContent(path) {
    return fs.readFileSync(path).toString('base64');
}

exports.getJsonOCR = function ocr(imgContent) {
    var out;
    auth.init({
        scope: ['https://www.googleapis.com/auth/cloud-platform'].join(' '),
        json_file: jsonfile
    });


    req = {
        image: { content: imgContent },
        features: [],
    }
    req.features.push({
        type: 'TEXT_DETECTION',
        maxResults: 1
    });
    request = {
        requests: [],
    }
    request.requests.push(req);

    autrequest({
            url: baseurl,
            method: 'post',
            json: request
        },
        function(error, r, dat) {
        	var sNIP;
            if (error) out = { ERROR: error };
            else {
                data = JSON.stringify(dat.responses[0].textAnnotations[0].description);
                str = data.split('\\n');
                for (var i = 1; i < str.length; i++) {
                    if (str[i].toLocaleLowerCase().includes('suma') || str[i].toLocaleLowerCase().includes('suna')) {
                        if (a = str[i].match(new RegExp('[0-9]*(,)[0-9]{2}', 'g'))) sPrice = a;
                        else if (a = str[i + 1].match(new RegExp('[0-9]*(,)[0-9]{2}', 'g'))) { sPrice = a;
                            i++; }
                    } else if (a = str[i].match(new RegExp('[0-9]{4}(-)[0-9]{2}(-)[0-9]{2}', 'g'))) sData = a;
                    else if (a = str[i].match(new RegExp('[0-9]*(-)[0-9]*(-)[0-9]*(-)[0-9]*', 'g')))
                        sNIP = a;
                }
                out = {
                    text: str.join(' '),
                    name: str[0].replace("\"", ""),
                    NIP: sNIP[0],
                    Data: sData[0],
                    Price: sPrice[0]
                };
                console.log(out);
                return out;
            }
        });
}