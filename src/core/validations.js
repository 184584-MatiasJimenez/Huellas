const { generateTimeSlots } = require('./reserva.js');

function isNumber(valor) {
  return typeof valor === 'number' && !isNaN(valor);
}

function esString(valor) {
  return typeof valor === 'string';
}

function isNotEmpty(valor) {
  return valor !== '';
}

function isStringNotEmpty(valor) {
  return esString(valor) && isNotEmpty(valor);
}

function isEmail(valor) {
  const regexEmail = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  return esString(valor) && regexEmail.test(valor);
}

function isDocumentValid(valor) {
  return typeof valor === 'string' && valor.length === 8;
}

function isValidPetType(valor) {
  return valor === 'Perro' || valor === 'Gato';
}

function isPhoneOk(valor) {
  return esString(valor) && valor.length >= 9 && valor.length <= 15;
}

function isBoolean(valor) {
  return typeof valor === 'boolean';
}

function isProfessionalId(valor) {
  return valor === 'vet-1' || valor === 'vet-2' || valor === 'vet-3' || valor === 'est-1' || valor === 'est-2';
}

function isProfessionalType(valor) {
  return valor === 'veterinario' || valor === 'estetica';
}

function isValidTime(valor) {
  return generateTimeSlots().includes(valor);
}

function isValidService(valor) {
  return valor === 'corte-pelo' || valor === 'bano' || valor === 'consulta-veterinaria' || valor === 'control-general';
}



module.exports = {
  isNumber,
  isStringNotEmpty,
  isNotEmpty,
  isEmail,
  isBoolean,
  isProfessionalId,
  isProfessionalType,
  isValidTime,
  isValidPetType,
  isPhoneOk,
  isDocumentValid,
  isValidService
};
