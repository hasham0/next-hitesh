import dbConnection from "@/lib/dbConnect";
import User from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/validation_Schema/signUpSchema";
