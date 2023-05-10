require('dotenv').config()
const express = require('express')
const axios = require('axios')

const router = express.Router();
const app = express();

app.set('views', './src');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/src'));

router.get('/', async (req, res) => {
    return res.render('pages/index', { data: [global._jadibot1, global._jadibot2, global._jadibot3, global._jadibot4] })
})

router.post(`/webhook/${process.env.WEBHOOK_SECRET_DONATENOTIF}/donate-notif`, async (req, res) => {
    await axios.post(`http://${process.env.CORE_BOT_PORT}/webhook/${process.env.WEBHOOK_SECRET_DONATENOTIF}/donate-notif`, req.body)
    return res.json({ status: true })
})

app.use('/', router);
app.set('port', (process.env.PORT))

app.listen(app.get('port'), async () => {
    console.log('Server started on port', app.get('port'))
    await setAllJadibotData()
});

setInterval(async () => {
    await setAllJadibotData()
}, 60000)

async function setAllJadibotData () {
    global._jadibot1 = (await axios.post(`http://localhost:${process.env.JADIBOT1_BOT_PORT}/get-jadibot`)).data
    global._jadibot2 = (await axios.post(`http://localhost:${process.env.JADIBOT2_BOT_PORT}/get-jadibot`)).data
    global._jadibot3 = (await axios.post(`http://localhost:${process.env.JADIBOT3_BOT_PORT}/get-jadibot`)).data
    global._jadibot4 = (await axios.post(`http://localhost:${process.env.JADIBOT4_BOT_PORT}/get-jadibot`)).data
    return true
}