const ContactsRepository = require('../repositories/ContactsRepository');
const isValidUUID = require('../../helpers/isValidUUID');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);

    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;
    const idIsValidUUID = isValidUUID(id);

    if (!idIsValidUUID) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    response.json(contact);
  }

  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name || !email || !phone) {
      return response.status(400).json({ error: 'Name, email, phone and category_id is required to create a new contact' });
    }

    const contactExists = await ContactsRepository.findByEmail(email);

    if (contactExists) {
      return response.status(400).json({ error: 'Contact already exists' });
    }

    const contact = await ContactsRepository.create({
      name, email, phone, category_id,
    });

    response.json(contact);
  }

  async update(request, response) {
    const { id } = request.params;
    const idIsValidUUID = isValidUUID(id);

    if (!idIsValidUUID) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    const {
      name, email, phone, category_id,
    } = request.body;

    const contactExistsById = await ContactsRepository.findById(id);

    if (!contactExistsById) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    if (!name || !email || !phone) {
      return response.status(400).json({ error: 'Name, email, phone and category_id is required to update a new contact' });
    }

    const contactExistsByEmail = await ContactsRepository.findByEmail(email);

    if (contactExistsByEmail && contactExistsByEmail.id !== id) {
      return response.status(400).json({ error: 'This e-mail is already used by other contact' });
    }

    const contact = await ContactsRepository.update(id, {
      name, email, phone, category_id,
    });

    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;
    const idIsValidUUID = isValidUUID(id);

    if (!idIsValidUUID) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    await ContactsRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new ContactController();
