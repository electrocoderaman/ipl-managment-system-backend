import ApiResponse from "../../../common/utils/api-response.js";
import * as playerService from "../services/player.service.js";

const createPlayer = async (req, res) => {
  const player = await playerService.createPlayer(req.body);

  ApiResponse.created(res, "player profile created successfully", player);
};

const getAllPlayer = async (req, res) => {};

const getPlayerById = async (req, res) => {};

const updatePlayer = async (req, res) => {};

const deletePlayer = async (req, res) => {};
