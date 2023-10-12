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
    return res.render('pages/index', { data: [global._jadibot1, global._jadibot2, global._jadibot3, global._jadibot4, global._jadibot5, global._jadibot6, global._jadibot7, global._jadibot8, global._jadibot9] })
})

router.post(`/webhook/${process.env.WEBHOOK_SECRET_DONATENOTIF}/donate-notif`, async (req, res) => {
    await axios.post(`http://localhost:${process.env.CORE_BOT_PORT}/webhook/${process.env.WEBHOOK_SECRET_DONATENOTIF}/donate-notif`, req.body)
    return res.json({ status: true })
})

router.post(`/webhook/${process.env.WEBHOOK_SECRET_CGWINNER}/cg-winner`, async (req, res) => {
    const serverSend = `http://localhost:${req.body.server == 'CORE' ? process.env.CORE_BOT_PORT : process.env[`${req.body.server}_BOT_PORT`]}/access`

    let winner = undefined
    let textFormattedWinner = `Score List:\n`
    const sortedData = Object.values(JSON.parse(req.body.data)).sort((a, b) => b.c - a.c)
    let formattedData = []
    for(let i = 0; i < sortedData.length; i++) {
        const idUser = sortedData[i].u
        const nameUser = sortedData[i].n
        if(sortedData[i].i == req.body.winner) {
            winner = { idUser, nameUser }
        }
        textFormattedWinner += `\n${i + 1}. wa.me/${idUser.replace('@s.whatsapp.net', '')} *(${nameUser})* - ${sortedData[i].c}`
        formattedData.push({ idUser, nameUser, score: sortedData[i].c })
    }

    const data = {
        key: process.env.BOT_SECRET_ACCESS,
        id: req.body.botId || 'CORE',
        method: 'sendMessage',
        content: [req.body.groupId, { text: `Selamat kepada @${winner.idUser.replace('@s.whatsapp.net', '')} *(${winner.nameUser})* telah memenangkan click game 🎉\n\n${textFormattedWinner}` }, { quoted: JSON.parse(req.body.msgMetadata) }]
    }
    const result = await axios.post(serverSend, data)
    const resultHighScore = await axios.post(`http://localhost:${process.env.CORE_BOT_PORT}/api/post/addClickGamesLeaderboard`, { key: process.env.WEBHOOK_SECRET_CGLB, data: formattedData } )
    return res.json({ status: true, result: result.data, resultHighScore: resultHighScore.data })
})

router.post(`/webhook/${process.env.WEBHOOK_SECRET_GITHUBPUSH}/github/:repoName`, async (req, res) => {
    await axios.post(`http://localhost:${process.env.CORE_BOT_PORT}/webhook/${process.env.WEBHOOK_SECRET_GITHUBPUSH}/github/${req.params.repoName}`, req.body)
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
    setTimeout(async () => {
        async function getJadibot1 () {
            try {
                global._jadibot1 = (await axios.post(`http://localhost:${process.env.JADIBOT1_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot2 () {
            try {
                global._jadibot2 = (await axios.post(`http://localhost:${process.env.JADIBOT2_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot3 () {
            try {
                global._jadibot3 = (await axios.post(`http://localhost:${process.env.JADIBOT3_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot4 () {
            try {
                global._jadibot4 = (await axios.post(`http://localhost:${process.env.JADIBOT4_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot5 () {
            try {
                global._jadibot5 = (await axios.post(`http://localhost:${process.env.JADIBOT5_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot6 () {
            try {
                global._jadibot6 = (await axios.post(`http://localhost:${process.env.JADIBOT6_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot7 () {
            try {
                global._jadibot7 = (await axios.post(`http://localhost:${process.env.JADIBOT7_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot8 () {
            try {
                global._jadibot8 = (await axios.post(`http://localhost:${process.env.JADIBOT8_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        async function getJadibot9 () {
            try {
                global._jadibot9 = (await axios.post(`http://localhost:${process.env.JADIBOT9_BOT_PORT}/get-jadibot`))?.data
            } catch (err) {
                console.error(err)
            }
        }
        Promise.all([getJadibot1(), getJadibot2(), getJadibot3(), getJadibot4(), getJadibot5(), getJadibot6(), getJadibot7(), getJadibot8(), getJadibot9()])
    }, 10000)
    return true
}