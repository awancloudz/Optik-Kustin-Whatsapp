const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false }
});
exports.initwhatsapp = (req, res) => {
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    }); 
    client.on('ready', () => {
        console.log('Whatsapp sudah ready!');
        return "Whatsapp sudah ready!";
    }); 
    client.on('disconnected', () => {
        console.log('Client is disconnected!');
    });    
    client.on('authenticated', () => {
        console.log('Client is authenticated!');
    });    
    client.on('auth_failure', () => {
        console.log('Client is auth_failure!');
    });
    client.initialize();
}

exports.sendwhatsapp = (req, res) => {  
    console.log('Whatsapp Engine Start!');  
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    }); 
    client.on('ready', () => {
        console.log('Whatsapp sudah ready!');
        sendwa();    
    }); 
    client.on('disconnected', () => {
        console.log('Client is disconnected!');
    });    
    client.on('authenticated', () => {
        console.log('Client is authenticated!');
    });    
    client.on('auth_failure', () => {
        console.log('Client is auth_failure!');
    });
    client.initialize();

    const sendwa = async () => {
        console.log('Sedang mengirim pesan.....');
        const JenisTransaksi = req.body.JenisTransaksi;
        const Cabang = req.body.Cabang;
        const NoHandphone = req.body.NoHandphone;
        const FilePDF = req.body.FilePDF;
        const NamaCustomer = req.body.NamaCustomer;

        const sanitized_number = NoHandphone.toString().replace(/[- )(]/g, ""); // hapus karakter lain yang tidak digunakan
        const kurangi = parseInt(sanitized_number.length - 1);
        const final_number = `62${sanitized_number.substring(sanitized_number.length - kurangi)}`; // tambahkan 62 di depan nomor
        const number_details = await client.getNumberId(final_number); // detail nomor akhir
        const greetingmessage = "Terima Kasih Bpk/Ibu/Sdr " + `${NamaCustomer}` + ", telah berbelanja di Optik Kustin. Berikut kami kirimkan nota pembelian anda.";
        const footermessage = "* Barang yang sudah dibeli tidak dapat ditukar/dikembalikan, uang muka tidak dapat dikembalikan. \r\n* Barang yang tidak diambil setelah 3 bulan diluar tanggung jawab kami. \r\n* Kritik dan saran hub. 0813 7757 2015";
    
        if (number_details) {
            if(JenisTransaksi == "PESAN KACAMATA"){
                const FilePDF2 = req.body.FilePDF2;
                const media = MessageMedia.fromFilePath('C:\\Project\\optikkustin-new\\public\\pdf\\'+`${FilePDF}`); //Windows
                //const media = MessageMedia.fromFilePath('/home/optikkustin/Optik-Kustin-New/public/pdf/'+`${FilePDF}`); //Linux
                const media2 = MessageMedia.fromFilePath('C:\\Project\\optikkustin-new\\public\\pdf\\'+`${FilePDF2}`); //Windows
                //const media2 = MessageMedia.fromFilePath('/home/optikkustin/Optik-Kustin-New/public/pdf/'+`${FilePDF2}`); //Linux
                await client.sendMessage(number_details._serialized, greetingmessage); // kirim greeting
                await client.sendMessage(number_details._serialized, media)// kirim NOTA
                await client.sendMessage(number_details._serialized, media2)// kirim GARANSI
                //await client.sendMessage(number_details._serialized, footermessage); // kirim footer  
                res.end(); 
                client.pupPage.close();
            }
            else if(JenisTransaksi == "JUAL LANGSUNG"){
                const media = MessageMedia.fromFilePath('C:\\Project\\optikkustin-new\\public\\pdf\\'+`${FilePDF}`); //Windows
                //const media = MessageMedia.fromFilePath('/home/optikkustin/Optik-Kustin-New/public/pdf/'+`${FilePDF}`); //Linux
                await client.sendMessage(number_details._serialized, greetingmessage); // kirim greeting
                await client.sendMessage(number_details._serialized, media)// kirim pdf
                //await client.sendMessage(number_details._serialized, footermessage); // kirim footer  
                res.end(); 
                client.pupPage.close();
            }
                
            console.log('Whatsapp Terkirim!');               
        } else {
            console.log('Whatsapp Tidak Terkirim! Nomor tidak terdaftar');
            res.end();    
        }
    }
}