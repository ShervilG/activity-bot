const fs = require("fs");
let activityMap = new Map(Object.entries(require('./../activity-count.json')));

class ActivityService {
    constructor() {}

    updateUserActivity = async(author) => {
        if (activityMap.get(author.id) != null && activityMap.get(author.id) != undefined) {
            let obj = activityMap.get(author.id);
            obj.count += 1;
            activityMap.set(author.id, obj);
            await fs.writeFile('activity-count.json', JSON.stringify(Object.fromEntries(activityMap)), 'utf8', () => {
                console.log('done updating activity data !');
            });
        } else {
            let obj = {
                username: author.username,
                count: 1,
                user_id: author.id
            }
            activityMap.set(author.id, obj);
            await fs.writeFile('activity-count.json', JSON.stringify(Object.fromEntries(activityMap)), 'utf8',  () => {
                console.log('done updating activity data !');
            });
        }
        console.log(JSON.stringify(activityMap));
    }

    deleteLastActivity = async() => {
        await fs.writeFile('activity-count.json', JSON.stringify({}), 'utf8', () => {
            console.log("Previous activity deleted !");
        });
    } 
}

const activityService = new ActivityService();
module.exports = activityService;