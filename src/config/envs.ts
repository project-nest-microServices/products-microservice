import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
    port: number;
    dataBaseUrl: string;
}

const envVarsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
}).unknown(true);

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const envs: EnvVars = {
    port: envVars.PORT,
    dataBaseUrl: envVars.DATABASE_URL
};