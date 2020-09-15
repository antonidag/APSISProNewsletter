
const request = require('request');
const fs = require('fs');
const { Console } = require('console');
const dir = 'C:/Users/anton/Documents/NewsletterArchive';


if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}




const options = {
    url: 'http://se.api.anpdm.com:80/v1/newsletters/all',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic <64BaseEncodedAPIKEY>',
        'Accept-Encoding': 'gzip,deflate'
    }
};




async function GetPollUrl(){
  console.log('Getting Poll url..')
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
        if (error) reject(error);
        if (response.statusCode != 200) {
            reject('Invalid status code <' + response.statusCode + '>');
        }
        let json = JSON.parse(body);
        resolve(json.Result.PollURL);
    });
  });
}


async function GetDataUrl(url){
  console.log('Getting Data url..')
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
        if (error) reject(error);
        if (response.statusCode != 200) {
            reject('Invalid status code <' + response.statusCode + '>');
        }
        let json = JSON.parse(body);
        resolve(json);
    });
  });
}

async function GetData(url){
  console.log('Getting Data url..')

  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
        if (error) reject(error);
        if (response.statusCode != 200) {
            reject('Invalid status code <' + response.statusCode + '>');
        }
        console.log("All Newsletters...");
        let json = JSON.parse(body);

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
}

async function main(){
  const pollrul = await GetPollUrl();
  console.log(pollrul);
  
  let run = true;
  let dataurl = '';
  while(run){
    const json = await GetDataUrl(pollrul);
    if(json.StateName == 'Completed'){
      console.log("Data ready...")
      run = false;
      dataurl = json.DataUrl;
    }
    if(json.StateName != 'Completed'){
      await sleep(5000);
      console.log("...polling for data...")
    }
  }
  const data = await GetData(dataurl);

}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

main();





  
