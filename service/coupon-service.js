const couponData = require('../coupons.json');
const fileHelper = require('../helper/file-helper');

class CouponService {
    constructor() {
        this.coupons = [...couponData];
    }

    deleteOldCoupons = () => {
        this.coupons = this.coupons.filter((coupon) => Date.parse(coupon.expiry) >= Date.now());
        fileHelper.writeDataToFileSync(this.coupons, '../coupons.json');
    }

    getAllCoupons = () => {
        return this.coupons;
    }

    disburseCouponToMostActiveUser = async(client, activityMap) => {
        if (activityMap.size == 0 || this.coupons.length == 0) {
            return;
        }
        let mostActiveUser = {
            user_id: "694631299323002890",
            username: "idevice2",
            count: -1
        };
        activityMap.forEach((user, userId) => {
            if (user.count > mostActiveUser.count) {
                mostActiveUser = user
            }
        });
        const coupon = this.coupons[parseInt(Math.random() * this.coupons.length)];
        client.users.fetch(mostActiveUser.user_id).then((user) => {
            user.send(coupon.code);
            let newCoupons = this.coupons.filter((thisCoupon) => thisCoupon.code != coupon.code);
            fileHelper.writeDataToFileAsync(newCoupons, '../coupons.json');
            this.coupons = newCoupons;
        }).catch((error) => {
            console.log("Couldn't fetch user with id : " + mostActiveUser.user_id + " for coupon disbursement ! " + error);
        });
    }
}

const couponService = new CouponService();
module.exports = couponService;