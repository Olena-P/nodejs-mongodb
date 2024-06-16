import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = parsePaginationParams(req.query);
    const pageNumber = parseInt(page, 10);
    const perPageNumber = parseInt(perPage, 10);

    const { contacts, paginationData } = await contactsService.getAllContacts(
      pageNumber,
      perPageNumber,
    );

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        ...paginationData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const contact = await contactsService.getContactById(req.params.contactId);
  if (!contact) {
    next(createHttpError(404, 'Student not found'));
    return;
  }
  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await contactsService.createContact(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res, next) => {
  const contact = await contactsService.updateContact(
    req.params.contactId,
    req.body,
  );
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 'success',
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const contact = await contactsService.deleteContact(req.params.contactId);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(204).send();
};
