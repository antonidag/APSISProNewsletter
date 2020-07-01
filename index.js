
const request = require('request');
const fs = require('fs');
const dir = 'C:/Users/anbj/Documents/CustomerJobbs/tmp';


if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}




const options = {
    url: 'http://se.api.anpdm.com:80/v1/newsletters/all',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic64encodedAPIkey',
        'Accept-Encoding': 'gzip,deflate'
    }
};

request(options,(err, res, body) => {
  if (err) { return console.log(err); }
  
  let json = JSON.parse(body);
  console.log("Getting Poll..")
  console.log(json.Result.PollURL);


  
  request(json.Result.PollURL,(err, res, body) => {
    if (err) { return console.log(err); }
    
    let json = JSON.parse(body);
    console.log("Getting Dataurl..")
    console.log(body);
    console.log(json.DataUrl);
    
    request(json.DataUrl,(err, res, body) => {
        if (err) { return console.log(err); }
        let json = JSON.parse(body);
        console.log("All Newsletters...");
        

        json.forEach(function (item, index) {
            var str = item.Name;
            str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');

            console.log(str);

            fs.writeFile(dir + '/' + index + '_' + '.html', item.Content.HtmlVersion, function (err) {
                if (err) throw err;
                console.log('File is created successfully.');
              }); 
          });
        });
    });
});


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 


  