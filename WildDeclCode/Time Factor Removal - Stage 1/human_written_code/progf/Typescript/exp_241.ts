var core = require('@actions/core');
var parser = require('./parser');
var slack = require('./lib/slack');

(async function () {
    const WEBHOOKS = process.env.WEBHOOKS
    if(null == WEBHOOKS) throw new Error("⚠️ Github Secrets 에서 WEBHOOK 등록여부를 확인해주세요")

    const webhookList = WEBHOOKS.split(",")
    const parsed = await parser() 

    webhookList.map(async url => {

        // Slack webhook
        if(url.includes('hooks.slack.com')) {   
           await slack({
               data: parsed.blog,
               url,
           })
        }
    })

    console.log("✅ 성공적으로 슬랙에 전송되었습니다.")
})().catch(function e {
    console.log(e)
    core.setFailed(e)
})