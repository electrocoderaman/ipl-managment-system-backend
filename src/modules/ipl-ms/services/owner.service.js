import ApiError from "../../../common/utils/api-error.js";
import Owner from "../models/owner.model.js";

const createOwner = async ({ name, company }) => {
  const user = await Owner.findOne({ name, company });

  if (user) throw ApiError.conflict("Owner already exists");

  const owner = await Owner.create({
    name,
    company,
  });

  return owner;
};

const getAllOwner = async () => {
  const owners = await Owner.find();

  return owners;
};

const getOwnerById = async (id) => {
  const owner = await Owner.findById(id);
  if (!owner) throw ApiError.notFound("owner with this id does not exists");

  return owner;
};

const updateOwner = async (id, { name, company }) => {
  const ownerUpdated = await Owner.findByIdAndUpdate(
    id,
    { name, company },
    { returnDocument: "after", runValidators: true },
  );

  if (!ownerUpdated)
    throw ApiError.notFound("owner with this id does not exists");

  return ownerUpdated;
};

const deleteOwner = async (id) => {
  const deleteOwner = await Owner.findByIdAndDelete(id);

  if (!deleteOwner) throw ApiError.notFound("Owner not found with this id");

  return deleteOwner;
};
export { createOwner, getAllOwner, getOwnerById, updateOwner, deleteOwner };
