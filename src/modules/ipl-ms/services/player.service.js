import Player from "../models/player.model.js";
import ApiError from "../../../common/utils/api-error.js";
import Team from "../models/team.model.js";

const createPlayer = async ({ name, role }) => {
  const temp = Player.findOne({ name, role });
  if (temp) throw ApiError.conflict("player already exists");

  const player = await Player.create({
    name,
    role,
  });
};

const transferPlayer = async (playerId, newTeamId) => {
  const team = await Team.findById(newTeamId);
  if (!team) throw ApiError.notFound("team not found");

  const player = await Player.findByIdAndUpdate(
    playerId,
    { teamId: newTeamId },
    { returnDocument: "after", runValidators: true },
  ).populate("teamId", "name");

  if (!player) throw ApiError.notFound("player not found");

  return player;
};

const updatePlayerRole = async (playerId, role) => {
  const player = await Player.findByIdAndUpdate(
    playerId,
    { role },
    { returnDocument: "after", runValidators: true },
  ).populate("teamId","name")
  if (!player) throw ApiError.notFound("player not found");
};
export { createPlayer };
