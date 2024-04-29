const {IgApiClient} = require('instagram-private-api')
const { get } = require('request-promise')

export async function createInstagramPost(
    newsId: ArrayBuffer,
    caption: string | null
) {
    const username = process.env.INSTAGRAM_USER_ID
    const password = process.env.INSTAGRAM_PASSWORD

    const ig = new IgApiClient()
    ig.state.generateDevice(username)
    await ig.account.login(username, password)

    caption = (caption == null) ? "Find out more at MSU ACM Webpage https://acm.murraystate.edu." : caption + "  Find out more at MSU ACM Webpage https://acm.murraystate.edu."
    await ig.publish.photo({
      file: newsId,
      caption: caption
    });
}