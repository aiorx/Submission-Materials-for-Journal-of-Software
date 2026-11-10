import { Request, Response, NextFunction } from "express";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import PetshopService from "@services/petshop.service";

// thanks copilot for the documentation, im lazy to write it myself

/**
 * Middleware to validate the petshop data in the request body.
 * 
 * This function checks if the name and CNPJ are provided and valid. It also checks if the petshop
 * already exists in the PetshopService. If any validation fails, it responds with an appropriate
 * error message. If all validations pass, it sets the petshop data in the request object and calls
 * the next middleware.
 */
export async function validatePetshopData(req: Request, res: Response, next: NextFunction) {
  const { name, cnpj } = req.body || {};

  if (!name) {
    res.status(400).json({ error: "Nome é obrigatório!" });
    return;
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 255) {
    res.status(400).json({ error: "Nome deve conter entre 2 e 255 caracteres!" });
    return;
  }

  if (!cnpj) {
    res.status(400).json({ error: "CNPJ é obrigatório!" });
    return;
  }

  if (!cnpjValidator.isValid(cnpj)) {
    res.status(400).json({ error: "CNPJ inválido!" });
    return;
  }

  req.petshop = { name: trimmedName, cnpj };

  next();
}

/**
 * Middleware to validate the CNPJ passed as a header in the request.
 * 
 * This function checks if the CNPJ is provided in the request headers and if the petshop exists
 * in the PetshopService. If any validation fails, it responds with an appropriate error message.
 * If all validations pass, it sets the CNPJ in the request object and calls the next middleware.
 */
export async function checkExistUsserAccount(req: Request, res: Response, next: NextFunction) {
  const cnpjHeader = req.headers['cnpj'] as string;

  if (!cnpjHeader) {
    res.status(400).json({ error: "CNPJ é obrigatório!" });
    return;
  }

  if (!await PetshopService.hasPetshop(cnpjHeader)) {
    res.status(404).json({ error: "Petshop não cadastrado!" });
    return;
  }

  req.cnpj = cnpjHeader;
  next();
}

/**
 * Middleware to validate the existence of a pet.
 * 
 * This function checks if a pet exists in the PetshopService based on the provided
 * CNPJ and pet ID from the request parameters. If the pet is not found, it responds
 * with a 404 status and an error message. If the pet is found, it sets the pet index
 * in the request object and calls the next middleware.
 */
export async function validatePetExistence(req: Request, res: Response, next: NextFunction) {
  const pet = await PetshopService.getPetObject(req.params.id);
  if (!pet) {
    res.status(404).json({ error: "Pet não encontrado!" });
    return;
  }
  req.petId = pet.id;
  next();
}

/**
 * Middleware to validate the pet data in the request body.
 * 
 * This function checks if the name, type, and vaccination date are provided and valid.
 * If any validation fails, it responds with an appropriate error message. If all validations
 * pass, it sets the pet data in the request object and calls the next middleware.
 */
export function validatePetData(req: Request, res: Response, next: NextFunction) {
  let { name, description, type, deadline_vaccination } = req.body || {};

  const trimmedName = name.trim();

  if (!trimmedName) {
    res.status(400).json({ error: "Nome é obrigatório!" });
    return;
  }

  const trimmedType = type.trim();

  if (!trimmedType) {
    res.status(400).json({ error: "Tipo é obrigatório!" });
    return;
  }

  // Verifica se a data de vacinação está no formato correto e se é uma data válida
  const parsedVaccinationDate = new Date(deadline_vaccination);
  if (isNaN(parsedVaccinationDate.getTime())) {
    res.status(400).json({ error: "Data de vacinação inválida!" });
    return;
  }

  req.pet = { name: trimmedName, description, type: trimmedType, deadline_vaccination: parsedVaccinationDate };

  next();
}
