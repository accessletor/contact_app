const fs = require('fs');

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath)
}
const filePath = './data/contacts.json';
if (!fs.existsSync(filePath)) {
	fs.writeFileSync(filePath, '[]', 'utf-8')
}

function loadContact() {
	const file = fs.readFileSync('./data/contacts.json', 'utf-8')
	const contacts = JSON.parse(file);
	return contacts;
}
function detailContact(nama){
	const contacts = loadContact();
	const detail = contacts.find((contact) => contact.nama === nama)
	return detail;
}

const saveContact = (contact => {
	fs.writeFileSync('./data/contacts.json', JSON.stringify(contact))
})
const addContact = (contact => {
	contacts = loadContact();
	contacts.push(contact);
	saveContact(contacts)
})

// hapus contact
const deleteContact = (nama) => {
	const contacts = loadContact();
	const filter = contacts.filter((contact) => contact.nama !== nama)
	// return filter;
	// console.log(filter)
	saveContact(filter)
}

// mengubah contact
const updateContacts = (contactBaru) => {
	const contacts = loadContact();
	// hilangkan contact nama yang namanya sama dengan oldnama
	const filter = contacts.filter((contact) => contact.nama !== contactBaru.oldnama);
	delete contactBaru.oldnama;
	filter.push(contactBaru);
	saveContact(filter)
}

module.exports = {loadContact, detailContact, addContact, deleteContact, updateContacts}