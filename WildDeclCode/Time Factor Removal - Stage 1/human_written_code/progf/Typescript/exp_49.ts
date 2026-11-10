var Request = require('express').Request;
var Response = require('express').Response;
var getCustomRepository = require('typeorm').getCustomRepository;
var PermissionRepository = require('../repositories/PermissionRepository');

class PermissionController {
  async create(request: Request, response: Response) {
    const permissionRepository = getCustomRepository(PermissionRepository);

    var name = request.body.name;
var description = request.body.description;

    const existPermission = await permissionRepository.findOne({ name });

    if (existPermission) {
      return response.status(400).json({ err: "Permission already exists!" });
    }

    const permission = permissionRepository.create({
      name,
      description,
    });

    await permissionRepository.save(permission);

    return response.json(permission);
  }
}

module.exports = new PermissionController();
