const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

exports.initwhatsapp = (req, res) => {
    console.log('Whatsapp Engine Start!'); 
    const Cabang = req.body.STORE;
    const RX = req.body.RX;
    const SessionIDWA = Cabang + "_" + RX;
    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const client = new Client({
        authStrategy: new LocalAuth({clientId: SessionIDWA }),
        bypassCSP: true,
        puppeteer: {
          headless: 'new',
          ignoreHTTPSErrors: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-extensions",
            '--disable-gpu', 
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            '--disable-dev-shm-usage'
          ],
        },
    });
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    }); 
    client.on('ready', () => {
        console.log('Whatsapp sudah ready!');
    });   
    client.on('authenticated', async () => {
        console.log('Client is authenticated!');
        res.end();
        await sleep(5000);
        await client.destroy();
        await client.removeAllListeners();
        console.log('Client Destroy!');
    });    
    client.on('auth_failure', () => {
        console.log('Client is auth_failure!');
    });
    client.initialize();
}

exports.sendwhatsapp = (req, res) => { 
    console.log('Whatsapp Engine Start!');  
    const Cabang = req.body.Cabang;
    const RX = req.body.RX;
    const SessionIDWA = Cabang + "_" + RX;
    const client = new Client({
        authStrategy: new LocalAuth({clientId: SessionIDWA }),
        bypassCSP: true,
        puppeteer: {
          headless: 'new',
          ignoreHTTPSErrors: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-extensions",
            '--disable-gpu', 
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            '--disable-dev-shm-usage'
          ],
        },
    });
        
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
        const NoHandphone = req.body.NoHandphone;
        const FilePDF = req.body.FilePDF;
        const NamaCustomer = req.body.NamaCustomer;

        const sanitized_number = NoHandphone.toString().replace(/[- )(]/g, ""); // hapus karakter lain yang tidak digunakan
        const kurangi = parseInt(sanitized_number.length - 1);
        const final_number = `62${sanitized_number.substring(sanitized_number.length - kurangi)}`; // tambahkan 62 di depan nomor
        const number_details = await client.getNumberId(final_number); // detail nomor akhir
        const footermessage = "* Barang yang sudah dibeli tidak dapat ditukar/dikembalikan, uang muka tidak dapat dikembalikan. \r\n* Barang yang tidak diambil setelah 3 bulan diluar tanggung jawab kami. \r\n* Kritik dan saran hub. 0813 7757 2015";
    
        function sleep(ms){
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        if (number_details) {
            if(JenisTransaksi == "PESAN KACAMATA"){
                const FilePDF2 = req.body.FilePDF2;
                const FilePDF3 = req.body.FilePDF3;
                const greetingmessage = "Terima Kasih Bpk/Ibu/Sdr " + `${NamaCustomer}` + ", telah berbelanja di Optik Kustin. Berikut kami kirimkan nota pemesanan anda.";
                const media = MessageMedia.fromFilePath('C:\\Project\\Optik-Kustin-New\\public\\pdf\\'+`${FilePDF}`); //Windows
                //const media = MessageMedia.fromFilePath('/home/optikkustin/Optik-Kustin-New/public/pdf/'+`${FilePDF}`); //Linux
                const media2 = MessageMedia.fromFilePath('C:\\Project\\Optik-Kustin-New\\public\\pdf\\'+`${FilePDF2}`); //Windows
                //const media2 = MessageMedia.fromFilePath('/home/optikkustin/Optik-Kustin-New/public/pdf/'+`${FilePDF2}`); //Linux
                const media3 = MessageMedia.fromFilePath('C:\\Project\\Optik-Kustin-New\\public\\pdf\\'+`${FilePDF3}`); //Windows
                //const media3 = MessageMedia.fromFilePath('/home/optikkustin/Optik-Kustin-New/public/pdf/'+`${FilePDF3}`); //Linux
                try {
                    await client.sendMessage(number_details._serialized, greetingmessage); // kirim greeting
                    await client.sendMessage(number_details._serialized, media)// kirim NOTA PEMESANAN
                    //await client.sendMessage(number_details._serialized, media2)// kirim GARANSI
                    //await client.sendMessage(number_details._serialized, media3)// kirim SURAT ORDER
                    //await client.sendMessage(number_details._serialized, footermessage); // kirim footer  
                    console.log('Nota Pemesanan Terkirim!'); 
                    res.end(); 
                    await sleep(10000);
                    await client.destroy();
                    await client.removeAllListeners();
                    console.log('Client Destroy!');
                } catch (error) {
                    console.log(error);
                } 
            }
            else if(JenisTransaksi == "JUAL LANGSUNG"){          
                const greetingmessage = "Terima Kasih Bpk/Ibu/Sdr " + `${NamaCustomer}` + ", telah berbelanja di Optik Kustin. Berikut kami kirimkan nota pembelian anda.";      
                const media = MessageMedia.fromFilePath('C:\\Project\\Optik-Kustin-New\\public\\pdf\\'+`${FilePDF}`); //Windows
                //const media = MessageMedia.fromFilePath('/home/optikkustin/Optik-Kustin-New/public/pdf/'+`${FilePDF}`); //Linux
                try {
                    await client.sendMessage(number_details._serialized, greetingmessage); // kirim greeting
                    await client.sendMessage(number_details._serialized, media); // kirim pdf
                    //await client.sendMessage(number_details._serialized, footermessage); // kirim footer
                    console.log('Nota Penjualan Terkirim!'); 
                    res.end(); 
                    await sleep(5000);
                    await client.destroy();
                    await client.removeAllListeners();
                    console.log('Client Destroy!'); 
                } catch (error) {
                    console.log(error);
                }                
                
            }                           
        } else {
            console.log('Whatsapp Tidak Terkirim! Nomor tidak terdaftar');
            res.end();    
        }
    }
}