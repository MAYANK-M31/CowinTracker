const express = require("express")
const app = express()

const bodyparser = require("body-parser")
const port = process.env.PORT || 3000
const schedule = require("node-schedule")
const axios = require("axios")
// const cors = require("cors")

// MIDDLEWARE
// app.use(cors())
app.use(bodyparser.json({ limit: "200mb" }));
app.use(bodyparser.urlencoded())
app.use(express.static(__dirname));
app.use(express.json())

app.listen(port, () => {
    console.log(`server is started at ${port}`)

})

app.get("/home", (req, res) => {
    res.send("Vaccine lagva lai")
})

app.get("/", async function (req, res) {

    res.send("Vaccine Availablity Checker")
await VaccineFinder()
})


async function VaccineFinder() {

    const min_age = 18
    const pincode = [110018, 110027,110058]
    const Dates = new Date(Date.now()).toLocaleDateString()
    const first_date = parseInt(Dates.split("/")[0])
    const month = parseInt(Dates.split("/")[1])
    const year = parseInt(Dates.split("/")[2])


    let checkDates = []
    for (i = first_date; i < 10 + first_date; i++) {
        checkDates.push(i)
    }

    console.log("hi");

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
        },
    }





    checkDates.map(async (dates) => {
        pincode.map(async (pin) => {
            await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${dates}-${month}-${year}`, options)
                .then(async (data) => {
                    const Datas = data.data.sessions
                    // console.log(Datas);
                    if (Datas.length > 0) {
                        Datas.map(async (data) => {
                            if (data.min_age_limit != 45) {
                                await axios({
                                    method: 'post',
                                    url: "https://fcm.googleapis.com/fcm/send",
                                    headers: { "Authorization": "key=AAAAvEwIHt8:APA91bG0ri-gyVLigRiuGLRc_iJDoim0ajfEBMCDTm11Kb8lD_nUG6AzjIQu5GSLKPIanrhGjOe8fIx8iV3H57SsW4cyiq_Aeo-Qe-kWfaD_yDtwiO5mdOPijwUgDh25TpIIJXlH4tEN" },
                                    data: {
                                        "to": "c6bjWzlxT4OEw9hhouvkje:APA91bFIONlCixHijG9npdyLj5f4hv-YwgZv7jRYk17sCXCMqS9ohSGXoxPIn6RYJFSK3aWuYTLMObE5TeJNhcbJMKQuCRfQsri31z2wjgae26-yH268R1GtIPieUzYmzfmfZVyzJzAz",
                                        "priority": "high",
                                        "notification": {
                                            "title": `${data.vaccine} Available:${data.available_capacity}`,
                                            "body": `${data.date} ${month} ${year}  Address:${data.address}`
                                        },
                                        "data": {
                                            "customId": "484747",
                                            "badge": 1,
                                            "sound": "cheering.caf",
                                            "alert": "New data is available"
                                        }
                                    }

                                });
                            }

                        })
                    } else {

                        await axios({
                            method: 'post',
                            url: "https://fcm.googleapis.com/fcm/send",
                            headers: { "Authorization": "key=AAAAvEwIHt8:APA91bG0ri-gyVLigRiuGLRc_iJDoim0ajfEBMCDTm11Kb8lD_nUG6AzjIQu5GSLKPIanrhGjOe8fIx8iV3H57SsW4cyiq_Aeo-Qe-kWfaD_yDtwiO5mdOPijwUgDh25TpIIJXlH4tEN" },
                            data: {
                                "to": "c6bjWzlxT4OEw9hhouvkje:APA91bFIONlCixHijG9npdyLj5f4hv-YwgZv7jRYk17sCXCMqS9ohSGXoxPIn6RYJFSK3aWuYTLMObE5TeJNhcbJMKQuCRfQsri31z2wjgae26-yH268R1GtIPieUzYmzfmfZVyzJzAz",
                                "priority": "high",
                                "notification": {
                                    "title": `No Vaccine Found Yet`,
                                    "body": `on ${dates}/${month}/${year} Pincode ${pin}`

                                },
                                "data": {
                                    "customId": "484747",
                                    "badge": 1,
                                    "sound": "cheering.caf",
                                    "alert": "New data is available"
                                }
                            }

                        });
                    }
                    // console.log(data.data);
                })
                .catch((err) => {


                    // console.log(err);
                });

        })
    })


}




schedule.scheduleJob('1 * * * * *', async () => {
    await VaccineFinder()
})


