import ApiResponse from "../../../common/utils/api-response.js";
import * as service from "../services/owner.service.js";

const createOwner = async (req, res) => {
  const result = await service.createOwner(req.body);

  ApiResponse.created(res, "owner created successfully", result);
};

const getAllOwner = async (req, res) => {
  const owners = await service.getAllOwner();

  ApiResponse.ok(res, "Owners fetched successfully", owners);
};

const getOwnerById = async (req, res) => {
  const owner = await service.getOwnerById(req.params.id);

  ApiResponse.ok(res, "Owner fetched successfully", owner);
};

const updateOwner = async (req, res) => {
  const updatedOwner = await service.updateOwner(req.params.id, req.body);

  ApiResponse.ok(res, "owner updated successfully", updatedOwner);
};

const deleteOwner = async (req, res) => {
  const deletedOwner = await service.deleteOwner(req.params.id);

  ApiResponse.ok(res, "Owner deleted successfully", deletedOwner);
};

export { createOwner, getAllOwner, getOwnerById, updateOwner, deleteOwner };
