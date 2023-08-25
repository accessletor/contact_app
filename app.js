const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const app = express()
const {loadContact, detailContact, addContact, deleteContact, updateContacts} = require('./utils/contacts.js')
const { check, validationResult } = require('express-validator');
const port = 3000

// gunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts)
app.use(express.urlencoded())
app.get('/', (req, res) => {
const mahasiswa = [
	{
	nama: "asep",
	email: "asepsan@gmail.com"
	},
	{
	nama: "doddy",
	email: "doddysan@gmail.com"
	},
	{
	nama: "rapih",
	email: "rapihsan@gmail.com"
	}
]


  res.render('index', 
  	{nama: 'asep san',
  	layout: 'layouts/main-layouts',
  	title: 'mahasiswa',
  	mahasiswa: mahasiswa
  })
})

app.get('/about', (req, res) => {
  res.render('about', {layout: 'layouts/main-layouts', title: 'halaman about'});
})

app.get('/contact', (req, res) => {
	const contacts = loadContact();
  res.render('contact', {layout: 'layouts/main-layouts', title: 'halaman contact', contacts});
})
app.get('/contact/add', (req, res) => {
  const contacts = loadContact();
  res.render('add', {layout: 'layouts/main-layouts', title: 'halaman tambah kontak', contacts});
})
app.post('/contact',[
	check('nama')
	.notEmpty().withMessage('Nama tidak boleh kosong')
	.custom((value) => {
		const contacts = loadContact();
		const validasi = contacts.find(contact => contact.nama === value)
		if (validasi) {
			throw new Error('nama tersebut sudah ada silahkan gunakan nama lain')
		}
		return true;
	}),
	check('email', 'format email salah').isEmail(),
	check('noHP', 'format nomor hp harus indonesia').isMobilePhone('id-ID')
	], (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const contacts = loadContact();
			res.render('add', {layout: 'layouts/main-layouts', title: 'halaman tambah kontak', contacts, errors: errors.array()});
		}else {
			addContact(req.body);
  			const successMessage = "Data Telah berhasil di tambahkan";
  			const contacts = loadContact()
  			res.render('contact', {layout: 'layouts/main-layouts', title: 'halaman tambah kontak', contacts, successMessage})
  			// res.redirect('/contact')
		}
  // addContact(req.body);
  // const successMessage = "Data Telah berhasil di tambahkan";
  // const contacts = loadContact()
  // res.render('contact', {layout: 'layouts/main-layouts', title: 'halaman tambah kontak', contacts, successMessage})
  // res.redirect('/contact')
})

// proses delete contact
app.get('/contact/delete/:nama', (req,res) => {
	const contact = detailContact(req.params.nama);
	if (!contact) {
		res.status(404);
		res.send('<h1>404</h1>');
	}else{
		deleteContact(req.params.nama)
		const successMessage = "Data Contact berhasil dihapus";
  			const contacts = loadContact()
  			res.render('contact', {layout: 'layouts/main-layouts', title: 'halaman tambah kontak', contacts, successMessage})
	}
})

// ubah
app.get('/contact/edit/:nama', (req, res) => {
  const contact = detailContact(req.params.nama)
  res.render('edit-contact', {layout: 'layouts/main-layouts', title: 'form ubah data', contact});
})

// process ubah data
app.post('/contact/update',[
	check('nama')
	.notEmpty().withMessage('Nama tidak boleh kosong')
	.custom((value, {req}) => {
		const contacts = loadContact();
		const validasi = contacts.find(contact => contact.nama === value)
		if (value !== req.body.oldnama && validasi) {
			throw new Error('nama tersebut sudah ada silahkan gunakan nama lain')
		}
		return true;
	}),
	check('email', 'format email salah').isEmail(),
	check('noHP', 'format nomor hp harus indonesia').isMobilePhone('id-ID')
	], (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render('edit-contact', {layout: 'layouts/main-layouts', title: 'form ubah data', contact: req.body, errors: errors.array()});
		}else {
			updateContacts(req.body);
  			const successMessage = "Data Telah berhasil di ubah";
  			const contacts = loadContact()
  			res.render('contact', {layout: 'layouts/main-layouts', title: 'halaman tambah kontak', contacts, successMessage})
  			res.redirect('/contact')
		}
  // addContact(req.body);
  // const successMessage = "Data Telah berhasil di tambahkan";
  // const contacts = loadContact()
  // res.render('contact', {layout: 'layouts/main-layouts', title: 'halaman tambah kontak', contacts, successMessage})
  // res.redirect('/contact')
})

app.get('/contact/:nama', (req, res) => {
	const contact = detailContact(req.params.nama);
  res.render('detail', {layout: 'layouts/main-layouts', title: 'halaman detail', contact});
})

app.get('/product/:id/', (req,res) => {
	res.send(`Product ID :  ${req.params.id} <br> Category ID : ${req.query.category}`)
})

app.use('/', (req, res) => {
	res.status(404);
	res.send('<h3>404</h3>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})