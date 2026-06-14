import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class LoginDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .max(12)
      .required()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .message(
        "password must contain Minimum 8 characters, at least 1 lowercase letter, at least 1 uppercase letter, at least 1 number, and at least 1 special character.",
      ),
  });
}

export default LoginDto;
