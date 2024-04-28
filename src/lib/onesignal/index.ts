import { CreateNotificationSuccessResponse, DefaultApi, Notification, createConfiguration } from "@onesignal/node-onesignal";

const configuration = createConfiguration({
    appKey: process.env.ONESIGNAL_API_KEY
});

const client = new DefaultApi(configuration);

export const getClient = async () => {
    return client;
}

export const sendNotification = async ({
    name,
    heading,
    content,
}: {
    name: string,
    heading: string,
    content: string
}) => {
    let notification = new Notification();
        notification.app_id = process.env.ONESIGNAL_APP_ID as string;
        notification.name = name;
        notification.headings = {
            en: heading
        };
        notification.contents = {
            en: content
        };
        notification.included_segments = ["All"]; // we want this to go out to everyone
        
    try {
        let notifResponse = await client.createNotification(notification);

        if (notifResponse.errors) {
            if (notifResponse.errors.invalid_external_user_ids) {
                notifResponse.errors
                    .invalid_external_user_ids
                    .forEach(error => console.log(error));
            } else if (notifResponse.errors.invalid_player_ids) {
                notifResponse.errors
                    .invalid_player_ids
                    .forEach(error => console.log(error));
            }
        }

        return notifResponse;
    } catch (err) {
        console.log(err);

        return undefined;
    }
}