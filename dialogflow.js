let axios = require('axios')

async function getResponse(question) {
  console.log('question ::: ', question)
  let options = {
    method: 'POST',
    url: 'https://api.dialogflow.com/v1/query?v=20191225',
    headers: {
      'Authorization': 'Bearer 53682eaed182417a9d2d4e7a05d7f738',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      lang: 'en',
      query: question,
      sessionId: '12345',
      timezone: 'Asia/Calcutta',
    }),
  };

  let response = await axios(options).then((data) => {
    console.log('data::', data.data.result.fulfillment['speech']);
    return data.data.result.fulfillment['speech']
  }).catch(err => {
    console.log('err::: ', err);
  });
  return response

}

// getResponse('hello')

// export default getResponse;
exports.getResponse = getResponse;