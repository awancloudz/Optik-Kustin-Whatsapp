const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

exports.initwhatsapp = (req, res) => {
    client.initialize();
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });    
    client.on('ready', () => {
        console.log('Whatsapp sudah ready!');
    });        
}

exports.sendwhatsapp = (req, res) => {    
    console.log('Check Whatsapp Engine.....');
    const NoHandphone = req.body.NoHandphone;
    const FilePDF = req.body.FilePDF;
    const NamaCustomer = req.body.NamaCustomer;

    client.initialize();
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    }); 
    client.on('ready', () => {
        console.log('Whatsapp sudah ready!');
        sendwa();
    }); 

    const sendwa = async () => {
        console.log('Sedang mengirim pesan.....');
        const sanitized_number = NoHandphone.toString().replace(/[- )(]/g, ""); // hapus karakter lain yang tidak digunakan
        const kurangi = parseInt(sanitized_number.length - 1);
        const final_number = `62${sanitized_number.substring(sanitized_number.length - kurangi)}`; // tambahkan 62 di depan nomor
        const number_details = await client.getNumberId(final_number); // detail nomor akhir
        const greetingmessage = "Terima Kasih Bpk/Ibu/Sdr " + `${NamaCustomer}` + ", telah berbelanja di Optik Kustin. Berikut kami kirimkan nota pembelian anda.";
        const footermessage = "* Barang yang sudah dibeli tidak dapat ditukar/dikembalikan, uang muka tidak dapat dikembalikan. \r\n* Barang yang tidak diambil setelah 3 bulan diluar tanggung jawab kami. \r\n* Kritik dan saran hub. 0813 7757 2015";
    
        if (number_details) {
            const media = MessageMedia.fromFilePath('C:\\Project\\optikkustin-new\\public\\pdf\\'+`${FilePDF}`);
            await client.sendMessage(number_details._serialized, greetingmessage); // kirim greeting
            await client.sendMessage(number_details._serialized, media)// kirim pdf
            //await client.sendMessage(number_details._serialized, footermessage); // kirim footer      
            console.log('Whatsapp Terkirim!');
            setInterval(function() {
                res.end(); 
            }, 2000);
            
        } else {
            console.log('Whatsapp Tidak Terkirim! Nomor tidak terdaftar');
            setInterval(function() {
                res.end(); 
            }, 2000);
        }
    }
}